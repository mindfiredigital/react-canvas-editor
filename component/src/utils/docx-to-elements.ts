/**
 * Direct DOCX XML → IElement[] converter.
 *
 * Parses the OpenXML inside a .docx ZIP file and converts directly
 * to the canvas-editor's per-character IElement[] format.
 *
 * Flow: DOCX (ZIP) → XML parsing → IElement[]
 * No HTML intermediate — preserves exact fonts, sizes, colors, images.
 */
import JSZip from 'jszip';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EditorTableCell {
  borderWidthBottom?: number;
  borderWidthLeft?: number;
  borderWidthRight?: number;
  colspan: number;
  rowspan: number;
  value: EditorElement[];
  verticalAlign?: string;
  backgroundColor?: string;
  borderBgTop?: string;
  borderBgBottom?: string;
  borderBgLeft?: string;
  borderBgRight?: string;
  borderWidthTop?: number;
}

export interface EditorTableRow {
  height: number;
  minHeight?: number;
  tdList: EditorTableCell[];
}

export interface EditorColgroup {
  width: number;
}

export interface EditorElement {
  value: string;
  type?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikeout?: boolean;
  color?: string;
  highlight?: string;
  font?: string;
  size?: number;
  url?: string;
  rowFlex?: string;
  titleLevel?: string;
  listType?: string;
  listStyle?: string;
  listId?: string;
  listIndentWidth?: number;
  valueList?: EditorElement[];
  width?: number;
  height?: number;
  rowMargin?: number;
  paragraphSpacingBefore?: number;
  paragraphSpacingAfter?: number;
  dashArray?: number[];
  // Table fields
  trList?: EditorTableRow[];
  colgroup?: EditorColgroup[];
  borderType?: string;
  pageBreakBorderTop?: string;
  pageBreakBorderTopWidth?: number;
  pageBreakBorderBottom?: string;
  pageBreakBorderBottomWidth?: number;
}

interface RunFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeout: boolean;
  color: string | undefined;
  highlight: string | undefined;
  font: string | undefined;
  size: number | undefined;
  vertAlign: string | undefined; // 'subscript' | 'superscript'
}

interface ParaFormat {
  alignment: string | undefined; // 'center' | 'right' | 'alignment' (justify)
  titleLevel: string | undefined;
  listType: string | undefined; // 'ul' | 'ol'
  listStyle: string | undefined;
  numId?: number;
  indentLevel: number;
  indentLeftTwips?: number;
  indentHangingTwips?: number;
  borderBetween?: string;
  spacingBeforeTwips?: number;
  spacingAfterTwips?: number;
  spacingLineTwips?: number;
  spacingLineRule?: string; // 'auto' | 'exact' | 'atLeast'
}

interface StyleDef {
  runFormat: Partial<RunFormat>;
  paraFormat: Partial<ParaFormat>;
}

interface NumberingLevel {
  numFmt: string; // 'bullet' | 'decimal' | 'lowerLetter' etc.
}

interface NumberingDef {
  levels: Map<number, NumberingLevel>;
}

/* ------------------------------------------------------------------ */
/*  XML Namespace helpers                                              */
/* ------------------------------------------------------------------ */

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const WP_NS = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';
const A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const PIC_NS = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';

function wEl(parent: Element, localName: string): Element | null {
  return parent.getElementsByTagNameNS(W_NS, localName)[0] ?? null;
}

function wEls(parent: Element, localName: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS(W_NS, localName));
}

/** Direct children only — avoids picking up nested descendants. */
function wChildren(parent: Element, localName: string): Element[] {
  const result: Element[] = [];
  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.childNodes[i];
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      (child as Element).localName === localName &&
      (child as Element).namespaceURI === W_NS
    ) {
      result.push(child as Element);
    }
  }
  return result;
}

function wAttr(el: Element, localName: string): string | null {
  return el.getAttributeNS(W_NS, localName) || el.getAttribute(`w:${localName}`) || el.getAttribute(localName);
}

function rAttr(el: Element, localName: string): string | null {
  return el.getAttributeNS(R_NS, localName) || el.getAttribute(`r:${localName}`) || el.getAttribute(localName);
}

/* ------------------------------------------------------------------ */
/*  Parse relationships (word/_rels/document.xml.rels)                 */
/* ------------------------------------------------------------------ */

function parseRelationships(xml: string): Map<string, { target: string; type: string }> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const map = new Map<string, { target: string; type: string }>();
  const rels = doc.getElementsByTagNameNS(REL_NS, 'Relationship');

  for (let i = 0; i < rels.length; i++) {
    const rel = rels[i];
    const id = rel.getAttribute('Id') || '';
    const target = rel.getAttribute('Target') || '';
    const type = rel.getAttribute('Type') || '';
    map.set(id, { target, type });
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Parse styles (word/styles.xml)                                     */
/* ------------------------------------------------------------------ */

interface ParsedStyles {
  styles: Map<string, StyleDef>;
  docDefaults: Partial<RunFormat>;
  paraDefaults: Partial<ParaFormat>;
  defaultParaStyleId: string | undefined;
}

function parseStyles(xml: string): ParsedStyles {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const map = new Map<string, StyleDef>();
  let docDefaults: Partial<RunFormat> = {};
  let paraDefaults: Partial<ParaFormat> = {};

  // Parse w:docDefaults — the base font/size and paragraph defaults for the whole document
  const docDefaultsEl = wEl(doc.documentElement, 'docDefaults');
  if (docDefaultsEl) {
    const rPrDefaultEl = wEl(docDefaultsEl, 'rPrDefault');
    if (rPrDefaultEl) {
      const rPr = wEl(rPrDefaultEl, 'rPr');
      if (rPr) {
        docDefaults = parseRunProperties(rPr);
      }
    }
    const pPrDefaultEl = wEl(docDefaultsEl, 'pPrDefault');
    if (pPrDefaultEl) {
      const pPr = wEl(pPrDefaultEl, 'pPr');
      if (pPr) {
        paraDefaults = parseParagraphProperties(pPr, new Map<never, never>());
      }
    }
  }

  let defaultParaStyleId: string | undefined;
  const styles = wEls(doc.documentElement, 'style');

  for (const style of styles) {
    const styleId = wAttr(style, 'styleId');
    if (!styleId) continue;

    // Detect the default paragraph style (w:default="1" w:type="paragraph")
    const styleType = wAttr(style, 'type');
    const isDefault = wAttr(style, 'default');
    if (styleType === 'paragraph' && (isDefault === '1' || isDefault === 'true')) {
      defaultParaStyleId = styleId;
    }

    const def: StyleDef = { runFormat: {}, paraFormat: {} };

    // Parse run properties from style
    const rPr = wEl(style, 'rPr');
    if (rPr) {
      def.runFormat = parseRunProperties(rPr);
    }

    // Parse paragraph properties from style
    const pPr = wEl(style, 'pPr');
    if (pPr) {
      def.paraFormat = parseParagraphProperties(pPr, new Map<never, never>());
    }

    // Detect heading styles
    const nameEl = wEl(style, 'name');
    const styleName = nameEl ? (wAttr(nameEl, 'val') || '') : '';
    const headingMatch = styleName.match(/^heading (\d)$/i);
    if (headingMatch) {
      const level = parseInt(headingMatch[1], 10);
      def.paraFormat.titleLevel = levelToTitleLevel(level);
    }

    map.set(styleId, def);
  }
  return { styles: map, docDefaults, paraDefaults, defaultParaStyleId };
}

function levelToTitleLevel(level: number): string | undefined {
  switch (level) {
    case 1: return 'first';
    case 2: return 'second';
    case 3: return 'third';
    case 4: return 'fourth';
    case 5: return 'fifth';
    case 6: return 'sixth';
    default: return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Parse numbering (word/numbering.xml)                               */
/* ------------------------------------------------------------------ */

function parseNumbering(xml: string): { abstractNums: Map<number, NumberingDef>; numIdToAbstract: Map<number, number> } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const abstractNums = new Map<number, NumberingDef>();
  const numIdToAbstract = new Map<number, number>();

  // Parse abstract numbering definitions
  const abstractNumEls = wEls(doc.documentElement, 'abstractNum');
  for (const absEl of abstractNumEls) {
    const absId = parseInt(wAttr(absEl, 'abstractNumId') || '0', 10);
    const levels = new Map<number, NumberingLevel>();

    const lvlEls = wEls(absEl, 'lvl');
    for (const lvlEl of lvlEls) {
      const ilvl = parseInt(wAttr(lvlEl, 'ilvl') || '0', 10);
      const numFmtEl = wEl(lvlEl, 'numFmt');
      const numFmt = numFmtEl ? (wAttr(numFmtEl, 'val') || 'bullet') : 'bullet';
      levels.set(ilvl, { numFmt });
    }

    abstractNums.set(absId, { levels });
  }

  // Map numId → abstractNumId
  const numEls = wEls(doc.documentElement, 'num');
  for (const numEl of numEls) {
    const numId = parseInt(wAttr(numEl, 'numId') || '0', 10);
    const absRef = wEl(numEl, 'abstractNumId');
    const absId = absRef ? parseInt(wAttr(absRef, 'val') || '0', 10) : 0;
    numIdToAbstract.set(numId, absId);
  }

  return { abstractNums, numIdToAbstract };
}

/* ------------------------------------------------------------------ */
/*  Parse run properties (w:rPr)                                       */
/* ------------------------------------------------------------------ */

function parseRunProperties(rPr: Element): Partial<RunFormat> {
  const fmt: Partial<RunFormat> = {};

  // Bold
  const bEl = wEl(rPr, 'b');
  if (bEl) {
    const val = wAttr(bEl, 'val');
    fmt.bold = val !== '0' && val !== 'false';
  }

  // Italic
  const iEl = wEl(rPr, 'i');
  if (iEl) {
    const val = wAttr(iEl, 'val');
    fmt.italic = val !== '0' && val !== 'false';
  }

  // Underline
  const uEl = wEl(rPr, 'u');
  if (uEl) {
    const val = wAttr(uEl, 'val');
    fmt.underline = val !== 'none' && val !== '0' && val !== 'false' && val !== null;
  }

  // Strikethrough
  const strikeEl = wEl(rPr, 'strike');
  if (strikeEl) {
    const val = wAttr(strikeEl, 'val');
    fmt.strikeout = val !== '0' && val !== 'false';
  }

  // Color
  const colorEl = wEl(rPr, 'color');
  if (colorEl) {
    const val = wAttr(colorEl, 'val');
    if (val && val !== 'auto') {
      fmt.color = `#${val}`;
    }
  }

  // Highlight / shading
  const highlightEl = wEl(rPr, 'highlight');
  if (highlightEl) {
    const val = wAttr(highlightEl, 'val');
    if (val && val !== 'none') {
      fmt.highlight = highlightNameToHex(val);
    }
  }
  const shdEl = wEl(rPr, 'shd');
  if (shdEl && !fmt.highlight) {
    const fill = wAttr(shdEl, 'fill');
    if (fill && fill !== 'auto') {
      fmt.highlight = `#${fill}`;
    }
  }

  // Font
  const fontsEl = wEl(rPr, 'rFonts');
  if (fontsEl) {
    const ascii = wAttr(fontsEl, 'ascii') || wAttr(fontsEl, 'hAnsi');
    if (ascii) fmt.font = ascii;
  }

  // Size (stored as half-points: 28 = 14pt)
  const szEl = wEl(rPr, 'sz');
  if (szEl) {
    const val = wAttr(szEl, 'val');
    if (val) fmt.size = Math.round(parseInt(val, 10) / 2);
  }

  // Vertical alignment (subscript/superscript)
  const vertAlignEl = wEl(rPr, 'vertAlign');
  if (vertAlignEl) {
    fmt.vertAlign = wAttr(vertAlignEl, 'val') || undefined;
  }

  return fmt;
}

function highlightNameToHex(name: string): string {
  const map: Record<string, string> = {
    yellow: '#ffff00', green: '#00ff00', cyan: '#00ffff',
    magenta: '#ff00ff', blue: '#0000ff', red: '#ff0000',
    darkBlue: '#000080', darkCyan: '#008080', darkGreen: '#008000',
    darkMagenta: '#800080', darkRed: '#800000', darkYellow: '#808000',
    darkGray: '#808080', lightGray: '#c0c0c0', black: '#000000',
    white: '#ffffff',
  };
  return map[name] || '#ffff00';
}

/* ------------------------------------------------------------------ */
/*  Parse paragraph properties (w:pPr)                                 */
/* ------------------------------------------------------------------ */

function parseParagraphProperties(
  pPr: Element,
  numbering: { abstractNums: Map<number, NumberingDef>; numIdToAbstract: Map<number, number> } | Map<never, never>,
): Partial<ParaFormat> {
  const fmt: Partial<ParaFormat> = {};

  // Alignment
  const jcEl = wEl(pPr, 'jc');
  if (jcEl) {
    const val = wAttr(jcEl, 'val');
    switch (val) {
      case 'center': fmt.alignment = 'center'; break;
      case 'right': fmt.alignment = 'right'; break;
      case 'both': fmt.alignment = 'alignment'; break;
    }
  }

  // Style reference (for headings)
  const pStyleEl = wEl(pPr, 'pStyle');
  if (pStyleEl) {
    const styleId = wAttr(pStyleEl, 'val') || '';
    const headingMatch = styleId.match(/^Heading(\d)$/i);
    if (headingMatch) {
      fmt.titleLevel = levelToTitleLevel(parseInt(headingMatch[1], 10));
    }
  }

  // Numbering (lists)
  const numPrEl = wEl(pPr, 'numPr');
  if (numPrEl && 'abstractNums' in numbering) {
    const ilvlEl = wEl(numPrEl, 'ilvl');
    const numIdEl = wEl(numPrEl, 'numId');
    const ilvl = ilvlEl ? parseInt(wAttr(ilvlEl, 'val') || '0', 10) : 0;
    const numId = numIdEl ? parseInt(wAttr(numIdEl, 'val') || '0', 10) : 0;

    fmt.indentLevel = ilvl;

    if (numId > 0) {
      fmt.numId = numId;
      const absId = numbering.numIdToAbstract.get(numId);
      const absDef = absId !== undefined ? numbering.abstractNums.get(absId) : undefined;
      const level = absDef?.levels.get(ilvl);
      const numFmt = level?.numFmt || 'bullet';

      if (numFmt === 'bullet') {
        fmt.listType = 'ul';
        fmt.listStyle = 'disc';
      } else {
        fmt.listType = 'ol';
        fmt.listStyle = 'decimal';
      }
    }
  }

  // Indentation
  const indEl = wEl(pPr, 'ind');
  if (indEl) {
    const left = wAttr(indEl, 'left');
    const hanging = wAttr(indEl, 'hanging');
    if (left) fmt.indentLeftTwips = parseInt(left, 10);
    if (hanging) fmt.indentHangingTwips = parseInt(hanging, 10);
  }

  // Paragraph border between (often used for dashed separators).
  // Ignore "nil"/"none" which mean "no border" — Word emits these for
  // every paragraph and treating them as a border yields spurious lines.
  const pBdrEl = wEl(pPr, 'pBdr');
  if (pBdrEl) {
    const betweenEl = wEl(pBdrEl, 'between');
    if (betweenEl) {
      const val = wAttr(betweenEl, 'val');
      if (val && val !== 'nil' && val !== 'none') fmt.borderBetween = val;
    }
  }

  // Paragraph spacing (before/after/line)
  const spacingEl = wEl(pPr, 'spacing');
  if (spacingEl) {
    const before = wAttr(spacingEl, 'before');
    const after = wAttr(spacingEl, 'after');
    const line = wAttr(spacingEl, 'line');
    const lineRule = wAttr(spacingEl, 'lineRule');
    if (before) fmt.spacingBeforeTwips = parseInt(before, 10);
    if (after) fmt.spacingAfterTwips = parseInt(after, 10);
    if (line) fmt.spacingLineTwips = parseInt(line, 10);
    if (lineRule) fmt.spacingLineRule = lineRule;
  }

  return fmt;
}

/* ------------------------------------------------------------------ */
/*  Merge formatting: style defaults + direct formatting               */
/* ------------------------------------------------------------------ */

/** Priority: direct run formatting > paragraph style > document defaults */
function mergeRunFormat(
  docDefaults: Partial<RunFormat>,
  styleFmt: Partial<RunFormat>,
  directFmt: Partial<RunFormat>,
): RunFormat {
  return {
    bold: directFmt.bold ?? styleFmt.bold ?? docDefaults.bold ?? false,
    italic: directFmt.italic ?? styleFmt.italic ?? docDefaults.italic ?? false,
    underline: directFmt.underline ?? styleFmt.underline ?? docDefaults.underline ?? false,
    strikeout: directFmt.strikeout ?? styleFmt.strikeout ?? docDefaults.strikeout ?? false,
    color: directFmt.color ?? styleFmt.color ?? docDefaults.color,
    highlight: directFmt.highlight ?? styleFmt.highlight ?? docDefaults.highlight,
    font: directFmt.font ?? styleFmt.font ?? docDefaults.font,
    size: directFmt.size ?? styleFmt.size ?? docDefaults.size,
    vertAlign: directFmt.vertAlign ?? styleFmt.vertAlign ?? docDefaults.vertAlign,
  };
}

/* ------------------------------------------------------------------ */
/*  Convert a single character to EditorElement                        */
/* ------------------------------------------------------------------ */

function charToElement(char: string, fmt: RunFormat, para: Partial<ParaFormat>, url?: string): EditorElement {
  const el: EditorElement = { value: char };

  if (fmt.bold) el.bold = true;
  if (fmt.italic) el.italic = true;
  if (fmt.underline) el.underline = true;
  if (fmt.strikeout) {
    el.strikeout = true;
  }
  if (fmt.color) el.color = fmt.color;
  if (fmt.highlight) el.highlight = fmt.highlight;
  if (fmt.font) el.font = fmt.font;
  if (fmt.size) el.size = fmt.size;

  if (fmt.vertAlign === 'subscript') el.type = 'subscript';
  if (fmt.vertAlign === 'superscript') el.type = 'superscript';

  if (url) {
    el.type = 'hyperlink';
    el.url = url;
  }

  if (para.alignment) el.rowFlex = para.alignment;
  if (para.titleLevel) el.titleLevel = para.titleLevel;
  if (para.listType) {
    el.listType = para.listType;
    el.listStyle = para.listStyle;
    if (para.numId !== undefined) {
      const ilvl = para.indentLevel ?? 0;
      el.listId = `list-${para.numId}-${ilvl}`;
    }
  }

  return el;
}

/* ------------------------------------------------------------------ */
/*  Image handling                                                     */
/* ------------------------------------------------------------------ */

/** EMU → pixels (96 DPI) */
function emuToPx(emu: number): number {
  return Math.round(emu / 914400 * 96);
}

/** Twips → pixels (96 DPI, 1 twip = 1/1440 inch) */
function twipsToPx(twips: number): number {
  return Math.round(twips / 15); // https://www.unitconverters.net/typography/twip-to-pixel-x.htm
}

function parseDrawing(
  drawingEl: Element,
  rels: Map<string, { target: string; type: string }>,
  images: Map<string, string>,
): EditorElement | null {
  // Get dimensions from wp:extent
  const extentEl = drawingEl.getElementsByTagNameNS(WP_NS, 'extent')[0];
  let width = 300;
  let height = 200;

  if (extentEl) {
    const cx = parseInt(extentEl.getAttribute('cx') || '0', 10);
    const cy = parseInt(extentEl.getAttribute('cy') || '0', 10);
    if (cx > 0) width = emuToPx(cx);
    if (cy > 0) height = emuToPx(cy);
  }

  // For wp:anchor (floating images), read horizontal positioning so we can
  // preserve at least the row-flex (left/center/right) on the canvas.
  // wp:anchor > wp:positionH > wp:align = "left" | "center" | "right"
  let anchorAlign: 'left' | 'center' | 'right' | undefined;
  const anchorEl = drawingEl.getElementsByTagNameNS(WP_NS, 'anchor')[0];
  if (anchorEl) {
    const posH = anchorEl.getElementsByTagNameNS(WP_NS, 'positionH')[0];
    if (posH) {
      const alignEl = posH.getElementsByTagNameNS(WP_NS, 'align')[0];
      const alignText = alignEl?.textContent?.trim().toLowerCase();
      if (alignText === 'left' || alignText === 'center' || alignText === 'right') {
        anchorAlign = alignText;
      } else {
        // wp:posOffset (EMU) — derive coarse alignment from offset sign
        const offEl = posH.getElementsByTagNameNS(WP_NS, 'posOffset')[0];
        const off = offEl ? parseInt(offEl.textContent || '0', 10) : 0;
        if (off > 0) anchorAlign = 'right';
      }
    }
  }

  // Constrain to page width
  const MAX_WIDTH = 600;
  if (width > MAX_WIDTH) {
    const ratio = MAX_WIDTH / width;
    width = MAX_WIDTH;
    height = Math.round(height * ratio);
  }

  // Get image reference: pic:blipFill > a:blip r:embed
  const blips = drawingEl.getElementsByTagNameNS(A_NS, 'blip');
  if (blips.length === 0) return null;

  const blip = blips[0];
  const rId = rAttr(blip, 'embed') || blip.getAttribute('r:embed');
  if (!rId) return null;

  const rel = rels.get(rId);
  if (!rel) return null;

  // The target is like "media/image1.png"
  const imagePath = rel.target.startsWith('/') ? `word${rel.target}` : `word/${rel.target}`;
  const base64 = images.get(imagePath);
  if (!base64) return null;

  // Determine MIME type from extension
  const ext = rel.target.split('.').pop()?.toLowerCase() || 'png';
  const mimeMap: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    gif: 'image/gif', bmp: 'image/bmp', svg: 'image/svg+xml',
    tiff: 'image/tiff', webp: 'image/webp',
  };
  const mime = mimeMap[ext] || 'image/png';

  const result: EditorElement = {
    value: `data:${mime};base64,${base64}`,
    type: 'image',
    width,
    height,
  };
  if (anchorAlign) result.rowFlex = anchorAlign;
  return result;
}

/* ------------------------------------------------------------------ */
/*  Process a run (w:r)                                                */
/* ------------------------------------------------------------------ */

function processRun(
  runEl: Element,
  docDefaults: Partial<RunFormat>,
  styleRunFmt: Partial<RunFormat>,
  paraFmt: Partial<ParaFormat>,
  url: string | undefined,
  rels: Map<string, { target: string; type: string }>,
  images: Map<string, string>,
): EditorElement[] {
  const elements: EditorElement[] = [];

  // Get direct run formatting
  const rPr = wEl(runEl, 'rPr');
  const directFmt = rPr ? parseRunProperties(rPr) : {};
  const fmt = mergeRunFormat(docDefaults, styleRunFmt, directFmt);

  // Process child nodes
  for (let i = 0; i < runEl.childNodes.length; i++) {
    const child = runEl.childNodes[i];
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const el = child as Element;
    const localName = el.localName;

    // Text
    if (localName === 't') {
      const text = el.textContent || '';
      for (const char of text) {
        elements.push(charToElement(char, fmt, paraFmt, url));
      }
    }

    // Tab
    if (localName === 'tab') {
      elements.push(charToElement('\t', fmt, paraFmt, url));
    }

    // Line break within a run
    if (localName === 'br') {
      const br: EditorElement = { value: '\n' };
      if (paraFmt.alignment) br.rowFlex = paraFmt.alignment;
      elements.push(br);
    }

    // Drawing (image)
    if (localName === 'drawing') {
      const imgEl = parseDrawing(el, rels, images);
      if (imgEl) {
        // Anchor-derived rowFlex (set by parseDrawing) wins over paragraph alignment;
        // only fall back to paragraph alignment if image has none.
        if (!imgEl.rowFlex && paraFmt.alignment) imgEl.rowFlex = paraFmt.alignment;
        elements.push(imgEl);
      }
    }
  }

  return elements;
}

/* ------------------------------------------------------------------ */
/*  Process a paragraph (w:p)                                          */
/* ------------------------------------------------------------------ */

function processParagraph(
  pEl: Element,
  docDefaults: Partial<RunFormat>,
  paraDefaults: Partial<ParaFormat>,
  defaultParaStyleId: string | undefined,
  styles: Map<string, StyleDef>,
  numbering: { abstractNums: Map<number, NumberingDef>; numIdToAbstract: Map<number, number> },
  rels: Map<string, { target: string; type: string }>,
  images: Map<string, string>,
): EditorElement[] {
  const elements: EditorElement[] = [];

  // Get paragraph properties
  const pPr = wEl(pEl, 'pPr');
  let paraFmt: Partial<ParaFormat> = {};
  let styleRunFmt: Partial<RunFormat> = {};

  // Start with paragraph defaults from w:docDefaults/w:pPrDefault
  if (paraDefaults.alignment) paraFmt.alignment = paraDefaults.alignment;

  // Apply default paragraph style (e.g. "Normal") as base
  if (defaultParaStyleId) {
    const defaultStyle = styles.get(defaultParaStyleId);
    if (defaultStyle) {
      if (defaultStyle.paraFormat.alignment && !paraFmt.alignment) {
        paraFmt.alignment = defaultStyle.paraFormat.alignment;
      }
      styleRunFmt = { ...defaultStyle.runFormat };
    }
  }

  if (pPr) {
    const directParaFmt = parseParagraphProperties(pPr, numbering);

    // Resolve paragraph style for run defaults
    const pStyleEl = wEl(pPr, 'pStyle');
    if (pStyleEl) {
      const styleId = wAttr(pStyleEl, 'val') || '';
      const styleDef = styles.get(styleId);
      if (styleDef) {
        // Style overrides defaults
        if (styleDef.paraFormat.alignment) {
          paraFmt.alignment = styleDef.paraFormat.alignment;
        }
        if (styleDef.paraFormat.titleLevel) {
          paraFmt.titleLevel = styleDef.paraFormat.titleLevel;
        }
        styleRunFmt = { ...styleRunFmt, ...styleDef.runFormat };
      }
    }

    // Direct paragraph properties override everything
    if (directParaFmt.alignment) paraFmt.alignment = directParaFmt.alignment;
    if (directParaFmt.titleLevel) paraFmt.titleLevel = directParaFmt.titleLevel;
    if (directParaFmt.listType) {
      paraFmt.listType = directParaFmt.listType;
      paraFmt.listStyle = directParaFmt.listStyle;
    }
    if (directParaFmt.numId !== undefined) paraFmt.numId = directParaFmt.numId;
    if (directParaFmt.indentLevel !== undefined) paraFmt.indentLevel = directParaFmt.indentLevel;
    if (directParaFmt.indentHangingTwips !== undefined) paraFmt.indentHangingTwips = directParaFmt.indentHangingTwips;
    if (directParaFmt.borderBetween) paraFmt.borderBetween = directParaFmt.borderBetween;

    // Paragraph-level rPr overrides style run format
    const pRPr = wEl(pPr, 'rPr');
    if (pRPr) {
      const pRunOverrides = parseRunProperties(pRPr);
      styleRunFmt = { ...styleRunFmt, ...pRunOverrides };
    }
  }

  // Process runs and hyperlinks
  for (let i = 0; i < pEl.childNodes.length; i++) {
    const child = pEl.childNodes[i];
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const el = child as Element;
    const localName = el.localName;

    // Regular run
    if (localName === 'r') {
      elements.push(...processRun(el, docDefaults, styleRunFmt, paraFmt, undefined, rels, images));
    }

    // Hyperlink
    if (localName === 'hyperlink') {
      const rId = rAttr(el, 'id') || el.getAttribute('r:id');
      let url: string | undefined;
      if (rId) {
        const rel = rels.get(rId);
        if (rel) url = rel.target;
      }

      const linkRuns = wEls(el, 'r');
      const inner: EditorElement[] = [];
      for (const linkRun of linkRuns) {
        // Pass undefined url to processRun — we group at the hyperlink level below.
        inner.push(...processRun(linkRun, docDefaults, styleRunFmt, paraFmt, undefined, rels, images));
      }

      if (url && inner.some((e) => e.value && e.value !== '\n')) {
        // Emit one grouped hyperlink element with valueList — canonical canvas-editor form.
        // Strip per-char rowFlex/titleLevel/listType (these belong on paragraph break).
        const valueList: EditorElement[] = [];
        for (const c of inner) {
          if (c.type === 'image') {
            // Images inside hyperlinks: keep as-is, but emit alongside (not inside valueList).
            elements.push(c);
            continue;
          }
          delete c.type;
          delete c.url;
          delete c.rowFlex;
          delete c.titleLevel;
          delete c.listType;
          delete c.listStyle;
          valueList.push(c);
        }
        if (valueList.length > 0) {
          const linkEl: EditorElement = {
            type: 'hyperlink',
            value: '',
            url,
            valueList,
          };
          if (paraFmt.alignment) linkEl.rowFlex = paraFmt.alignment;
          elements.push(linkEl);
        }
      } else {
        elements.push(...inner);
      }
    }
  }

  // If the paragraph is empty but has a "between" border, render a dashed line.
  const hasVisibleContent = elements.some(
    (e) => e.type === 'image' || e.type === 'hyperlink' || (e.value && e.value !== '\n'),
  );
  if (!hasVisibleContent && paraFmt.borderBetween) {
    // Use canvas-editor's native separator element — renders as a full-row
    // horizontal rule that auto-fits the page width, never wraps.

    const dashArray =
      paraFmt.borderBetween === 'dashed' ? [3, 3] : [];
    elements.push({ value: '\n', type: 'separator', dashArray });
  }

  // Collapse paragraphs whose entire visible content is a literal
  // "- - - - -" separator. Word/Google pages are wider than canvas-editor
  // so the original glyph count wraps to a second half-row. Replace with
  // a native single-row separator element.
  // Replace any contiguous run of literal "- " separator chars (≥30 dashes)
  // anywhere in the paragraph with a native separator element. Word/Google
  // pages are wider than canvas-editor, so the original glyph count wraps
  // to a second half-row. Handles cases where the dashes share a paragraph
  // with prior text + a line break (e.g. "Particulars: ... <br/>- - - ...").


  if (hasVisibleContent) {
    const isDashRunChar = (e: EditorElement) =>
      !e.type && (e.value === '-' || e.value === ' ');
    let i = 0;
    while (i < elements.length) {
      if (isDashRunChar(elements[i])) {
        let j = i;
        let dashes = 0;
        while (j < elements.length && isDashRunChar(elements[j])) {
          if (elements[j].value === '-') dashes++;
          j++;
        }
        if (dashes >= 30) {
          elements.splice(i, j - i, { value: '\n', type: 'separator', dashArray: [3, 3] });
          i++;
          continue;
        }
        i = j;
      } else {
        i++;
      }
    }
  }

  // Normalize paragraph content:
  // - Keep images on their own line for better layout.
  // - Collapse excessive blank lines inside list items.
  // - Trim trailing manual breaks (paragraph break is added below).
  const normalized: EditorElement[] = [];

  // For list items, inject a ZERO marker ('\n' → ZERO after canvas-editor normalisation)
  // so canvas-editor's native ListParticle.drawListStyle renders the bullet symbol and
  // applies the hanging-indent offsetX automatically (works for both main content and
  // table cells because computeRowList calls computeListStyle on each cell's elementList).
  if (paraFmt.listType) {
    const listId = paraFmt.numId !== undefined
      ? `list-${paraFmt.numId}-${paraFmt.indentLevel ?? 0}`
      : undefined;
    const listMarker: EditorElement = {
      value: '\n',
      listType: paraFmt.listType,
      listStyle: paraFmt.listStyle,
    };
    if (listId) listMarker.listId = listId;
    normalized.push(listMarker);
  }

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el.type === 'image') {
      // Carry image alignment (from wp:anchor positionH or paragraph w:jc) onto the
      // image itself + its surrounding newlines so the canvas editor renders the
      // image in the correct row-flex (left/center/right).
      const imgAlign = el.rowFlex || paraFmt.alignment;
      if (imgAlign && !el.rowFlex) el.rowFlex = imgAlign;
      const prev = normalized[normalized.length - 1];
      if (!prev || prev.value !== '\n' || prev.type) {
        const br: EditorElement = { value: '\n' };
        if (imgAlign) br.rowFlex = imgAlign;
        normalized.push(br);
      } else if (imgAlign && !prev.rowFlex) {
        prev.rowFlex = imgAlign;
      }
      normalized.push(el);
      const next = elements[i + 1];
      if (!next || next.value !== '\n' || next.type) {
        const br: EditorElement = { value: '\n' };
        if (imgAlign) br.rowFlex = imgAlign;
        normalized.push(br);
      }
      continue;
    }

    if (paraFmt.listType && el.value === '\n' && !el.type) {
      const prev = normalized[normalized.length - 1];
      if (prev && prev.value === '\n' && !prev.type) {
        continue; // collapse consecutive blank lines inside list items
      }
    }

    normalized.push(el);
  }

  while (normalized.length > 0 && normalized[normalized.length - 1].value === '\n' && !normalized[normalized.length - 1].type) {
    normalized.pop();
  }

  // Map docx line spacing to canvas-editor rowMargin (Google-Docs-style multiplier).
  // lineRule="auto": line/240 = multiplier (240=single→1.0, 360=1.5, 480=double→2.0).
  let lineRowMargin: number | undefined;
  if (
    paraFmt.spacingLineTwips &&
    (!paraFmt.spacingLineRule || paraFmt.spacingLineRule === 'auto')
  ) {
    const mult = paraFmt.spacingLineTwips / 240;
    if (mult > 0) lineRowMargin = mult;
  }

  // Paragraph before/after spacing intentionally NOT applied — it makes wrapped
  // lines within a paragraph (line spacing only) feel tight while paragraph
  // boundaries (line spacing + paraSpacing) get larger gaps. Uniform line
  // spacing avoids the uneven look users notice when typing/pressing Enter.

  // If paragraph is empty (no visible content), drop it unless it carries borders.
  // List markers (listId set) count as non-empty so empty bullet items still render.
  const hasNonEmpty = normalized.some((e) => e.type === 'image' || e.type === 'hyperlink' || e.type === 'separator' || (e.value && e.value !== '\n') || !!e.listId);
  if (!hasNonEmpty && !paraFmt.borderBetween) {
    if (!lineRowMargin) {
      return [];
    }
    // Empty paragraph w/ explicit line spacing: emit a single break carrying it
    const blank: EditorElement = { value: '\n' };
    blank.rowMargin = lineRowMargin;
    return [blank];
  }

  // Apply line spacing (rowMargin) to every element of the paragraph
  if (lineRowMargin) {
    for (const e of normalized) {
      if (e.rowMargin === undefined) e.rowMargin = lineRowMargin;
    }
  }

  // The separator element already carries value:'\n' and terminates its own row —
  // adding another paraBreak would create a spurious blank line below the rule.
  const isSeparatorOnly = normalized.length === 1 && normalized[0].type === 'separator';
  if (!isSeparatorOnly) {
    if (paraFmt.listType) {
      // List items: no trailing paraBreak — the next item's leading ZERO marker (or the
      // listId→undefined transition for the following non-list element) causes the row break.
      // Adding a trailing '\n' here would create an extra blank row between list items.
    } else {
      // End paragraph with newline — carry paragraph formatting so canvas editor picks it up
      const paraBreak: EditorElement = { value: '\n' };
      if (paraFmt.alignment) paraBreak.rowFlex = paraFmt.alignment;
      if (paraFmt.titleLevel) paraBreak.titleLevel = paraFmt.titleLevel;
      if (lineRowMargin) paraBreak.rowMargin = lineRowMargin;
      normalized.push(paraBreak);
    }
  }

  return normalized;
}

/* ------------------------------------------------------------------ */
/*  Process a table (w:tbl) — flatten to linear content                */
/* ------------------------------------------------------------------ */

// Matches canvas-editor's default rendered line height for size 11 text:
// fontSize * defaultRowMargin (1.12) + small padding. Keeping this tight
// prevents inflated row heights on import (which caused extra whitespace
// inside cells and premature page breaks at the bottom of pages).
const LINE_HEIGHT_PX = 20;
// Matches canvas-editor's defaultTrMinHeight. Emitting this as both height
// and minHeight on every row lets canvas-editor measure rendered cell
// content and grow rows from there. Using a larger estimate (our previous
// behavior) locked rows to that estimate and produced visible empty space
// below text in cells like Experience.
const MIN_ROW_HEIGHT = 40;
const MIN_CELL_HEIGHT = 20;

/**
 * Estimate line count for a cell's content at a given usable width.
 * Handles both per-character elements and multi-character elements.
 */
function estimateLineCount(elements: EditorElement[], usableWidth: number): number {
  let lineCount = 1;
  let currentLineWidth = 0;

  for (const el of elements) {
    if (el.value === '\n' && !el.type) {
      lineCount++;
      currentLineWidth = 0;
      continue;
    }

    if (el.type === 'image') {
      const imgWidth = el.width || 0;
      if (imgWidth > 0) {
        if (currentLineWidth + imgWidth > usableWidth && currentLineWidth > 0) {
          lineCount++;
          currentLineWidth = 0;
        }
        currentLineWidth += Math.min(imgWidth, usableWidth);
      }
      continue;
    }

    const charWidth = (el.size || 16) * 0.6;
    const elWidth = charWidth * (el.value.length || 1);
    currentLineWidth += elWidth;
    while (currentLineWidth > usableWidth) {
      lineCount++;
      currentLineWidth -= usableWidth;
    }
  }

  return lineCount;
}

/**
 * Split a cell's elements into chunks that each fit within maxLines.
 * Prefers splitting at paragraph boundaries (\n), but will split mid-element
 * list if a single paragraph exceeds the limit.
 */
function splitCellContent(
  elements: EditorElement[],
  usableWidth: number,
  maxLines: number,
): EditorElement[][] {
  if (elements.length === 0) return [elements];

  const chunks: EditorElement[][] = [];
  let chunkStart = 0;
  let lineCount = 1;
  let currentLineWidth = 0;
  let lastGoodBreak = -1;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el.value === '\n' && !el.type) {
      lineCount++;
      currentLineWidth = 0;

      if (lineCount <= maxLines) {
        lastGoodBreak = i;
      }

      if (lineCount > maxLines) {
        if (lastGoodBreak >= chunkStart) {
          chunks.push(elements.slice(chunkStart, lastGoodBreak + 1));
          chunkStart = lastGoodBreak + 1;
        } else {
          chunks.push(elements.slice(chunkStart, i + 1));
          chunkStart = i + 1;
        }
        lineCount = 1;
        currentLineWidth = 0;
        lastGoodBreak = -1;
      }
    } else if (el.type === 'image') {
      const imgWidth = el.width || 0;
      if (imgWidth > 0) {
        if (currentLineWidth + imgWidth > usableWidth && currentLineWidth > 0) {
          lineCount++;
          currentLineWidth = 0;
        }
        currentLineWidth += Math.min(imgWidth, usableWidth);
        if (lineCount > maxLines) {
          if (lastGoodBreak >= chunkStart) {
            chunks.push(elements.slice(chunkStart, lastGoodBreak + 1));
            chunkStart = lastGoodBreak + 1;
          } else {
            chunks.push(elements.slice(chunkStart, i));
            chunkStart = i;
          }
          lineCount = 1;
          currentLineWidth = 0;
          lastGoodBreak = -1;
          i--;
        }
      }
    } else {
      const charWidth = (el.size || 16) * 0.6;
      const elWidth = charWidth * (el.value.length || 1);
      currentLineWidth += elWidth;
      while (currentLineWidth > usableWidth) {
        lineCount++;
        currentLineWidth -= usableWidth;
      }

      if (lineCount > maxLines) {
        if (lastGoodBreak >= chunkStart) {
          chunks.push(elements.slice(chunkStart, lastGoodBreak + 1));
          chunkStart = lastGoodBreak + 1;
        } else {
          chunks.push(elements.slice(chunkStart, i));
          chunkStart = i;
        }
        lineCount = 1;
        currentLineWidth = 0;
        lastGoodBreak = -1;
        i--;
      }
    }
  }

  if (chunkStart < elements.length) {
    chunks.push(elements.slice(chunkStart));
  }

  return chunks.length > 0 ? chunks : [elements];
}

/**
 * Split an oversized row into multiple rows, preserving column layout.
 * The first split row keeps original non-tallest cell content; subsequent rows
 * get empty placeholders in those cells.
 */
function splitOversizedRow(
  row: EditorTableRow,
  colgroup: EditorColgroup[],
  maxLinesPerRow: number,
): EditorTableRow[] {
  const tdList = row.tdList;
  let tallestIdx = 0;
  let tallestHeight = 0;

  for (let ci = 0; ci < tdList.length; ci++) {
    let cellWidthPx = 0;
    const colEnd = Math.min(ci + (tdList[ci].colspan || 1), colgroup.length);
    for (let c = ci; c < colEnd; c++) cellWidthPx += colgroup[c]?.width ?? 100;
    const usableWidth = Math.max(cellWidthPx - 8, 40);
    const lines = estimateLineCount(tdList[ci].value, usableWidth);
    const h = Math.max(30, lines * LINE_HEIGHT_PX);
    if (h > tallestHeight) {
      tallestHeight = h;
      tallestIdx = ci;
    }
  }

  let tallCellWidth = 0;
  const colEnd = Math.min(tallestIdx + (tdList[tallestIdx].colspan || 1), colgroup.length);
  for (let c = tallestIdx; c < colEnd; c++) tallCellWidth += colgroup[c]?.width ?? 100;
  const usableWidth = Math.max(tallCellWidth - 8, 40);

  const chunks = splitCellContent(tdList[tallestIdx].value, usableWidth, maxLinesPerRow);
  if (chunks.length <= 1) {
    return [row];
  }

  const result: EditorTableRow[] = [];
  for (let ci = 0; ci < chunks.length; ci++) {
    const newTdList: EditorTableCell[] = [];

    for (let ti = 0; ti < tdList.length; ti++) {
      if (ti === tallestIdx) {
        const chunkContent = chunks[ci];
        const td: EditorTableCell = {
          colspan: tdList[ti].colspan,
          rowspan: 1,
          value: chunkContent,
        };
        if (tdList[ti].backgroundColor) td.backgroundColor = tdList[ti].backgroundColor;
        if (ci === 0) {
          if (tdList[ti].borderBgTop) td.borderBgTop = tdList[ti].borderBgTop;
          if (tdList[ti].borderWidthTop) td.borderWidthTop = tdList[ti].borderWidthTop;
        } else {
          td.borderBgTop = '#ffffff';
        }
        if (ci === chunks.length - 1) {
          if (tdList[ti].borderBgBottom) td.borderBgBottom = tdList[ti].borderBgBottom;
          if (tdList[ti].borderWidthBottom) td.borderWidthBottom = tdList[ti].borderWidthBottom;
        } else {
          td.borderBgBottom = '#ffffff';
        }
        if (tdList[ti].borderBgLeft) td.borderBgLeft = tdList[ti].borderBgLeft;
        if (tdList[ti].borderBgRight) td.borderBgRight = tdList[ti].borderBgRight;
        newTdList.push(td);
      } else if (ci === 0) {
        const nonTallTd = { ...tdList[ti], rowspan: 1 };
        nonTallTd.borderBgBottom = '#ffffff';
        nonTallTd.borderWidthBottom = undefined;
        newTdList.push(nonTallTd);
      } else {
        const td: EditorTableCell = {
          colspan: tdList[ti].colspan,
          rowspan: 1,
          value: [{ value: '\u200B', size: 16 }],
        };
        if (tdList[ti].backgroundColor) td.backgroundColor = tdList[ti].backgroundColor;
        if (tdList[ti].borderBgLeft) td.borderBgLeft = tdList[ti].borderBgLeft;
        if (tdList[ti].borderBgRight) td.borderBgRight = tdList[ti].borderBgRight;
        td.borderBgTop = '#ffffff';
        td.borderBgBottom = '#ffffff';
        newTdList.push(td);
      }
    }

    let maxCellHeight = 40;
    for (let ti = 0; ti < newTdList.length; ti++) {
      let w = 0;
      const ce = Math.min(ti + (newTdList[ti].colspan || 1), colgroup.length);
      for (let c = ti; c < ce; c++) w += colgroup[c]?.width ?? 100;
      const uw = Math.max(w - 8, 40);
      const lines = estimateLineCount(newTdList[ti].value, uw);
      const h = Math.max(30, lines * LINE_HEIGHT_PX);
      if (h > maxCellHeight) maxCellHeight = h;
    }

    result.push({ height: maxCellHeight, tdList: newTdList });
  }

  return result;
}

/** Parse border color from a w:tblBorders child element. Returns null for val="nil" (explicit no border). */
function parseBorderColor(borderEl: Element | null): string | null | undefined {
  if (!borderEl) return undefined;
  const val = wAttr(borderEl, 'val');
  if (val === 'nil' || val === 'none') return '#ffffff';
  const sz: string | null  = wAttr(borderEl, 'sz');
  if (sz === '0') return '#ffffff'; // explicitly no border
  const color = wAttr(borderEl, 'color');
  if (color && color !== 'auto') return `#${color}`;
  return undefined;
}

function parseBorderSize(borderEl: Element | null): number | undefined {
  if (!borderEl) return undefined;

  const sz: string | null  = wAttr(borderEl, 'sz');
  if (sz === null) return undefined;
  if (!isNaN(Number(sz))) return Number(sz)/8; // sz is in eighths of a point
  return undefined;
}
/** Parse table-level borders from w:tblPr/w:tblBorders */
function parseTableBorders(tblPr: Element | null): {
  top?: string; bottom?: string; left?: string; right?: string; insideH?: string; insideV?: string;
} {
  if (!tblPr) return {};
  const borders = wEl(tblPr, 'tblBorders');
  if (!borders) return {};
  return {
    top: parseBorderColor(wEl(borders, 'top')) || undefined,
    bottom: parseBorderColor(wEl(borders, 'bottom')) || undefined,
    left: parseBorderColor(wEl(borders, 'left')) || parseBorderColor(wEl(borders, 'start')) || undefined,
    right: parseBorderColor(wEl(borders, 'right')) || parseBorderColor(wEl(borders, 'end')) || undefined,
    insideH: parseBorderColor(wEl(borders, 'insideH')) || undefined,
    insideV: parseBorderColor(wEl(borders, 'insideV')) || undefined,

  };
}

/** Process cell content into EditorElement[] (paragraphs + nested tables) */
function processCellContent(
  tc: Element,
  docDefaults: Partial<RunFormat>,
  paraDefaults: Partial<ParaFormat>,
  defaultParaStyleId: string | undefined,
  styles: Map<string, StyleDef>,
  numbering: { abstractNums: Map<number, NumberingDef>; numIdToAbstract: Map<number, number> },
  rels: Map<string, { target: string; type: string }>,
  images: Map<string, string>,
): EditorElement[] {
  const cellElements: EditorElement[] = [];

  for (let i = 0; i < tc.childNodes.length; i++) {
    const child = tc.childNodes[i];
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const childEl = child as Element;
    if (childEl.localName === 'p') {
      cellElements.push(...processParagraph(childEl, docDefaults, paraDefaults, defaultParaStyleId, styles, numbering, rels, images));
    } else if (childEl.localName === 'tbl') {
      // canvas-editor's click-to-position resolution does not descend into nested
      // tables, so hyperlinks/images inside a nested table cell become unclickable.
      // Flatten the nested table by inlining each cell's content, separated by a space.
      const innerRows = wChildren(childEl, 'tr');
      for (let r = 0; r < innerRows.length; r++) {
        const innerCells = wChildren(innerRows[r], 'tc');
        for (let c = 0; c < innerCells.length; c++) {
          const inlineCell = processCellContent(
            innerCells[c], docDefaults, paraDefaults, defaultParaStyleId, styles, numbering, rels, images,
          );
          // Strip the cell's leading zero-width placeholder if present.
          const cleaned = inlineCell.filter(
            (e, idx) => !(idx === 0 && e.value === '​'),
          );
          // Drop trailing empty newlines so cells flow inline.
          while (cleaned.length > 0 && cleaned[cleaned.length - 1].value === '\n' && !cleaned[cleaned.length - 1].type) {
            cleaned.pop();
          }
          if (c > 0 && cleaned.length > 0) {
            cellElements.push({ value: ' ' });
          }
          cellElements.push(...cleaned);
        }
        if (r < innerRows.length - 1) cellElements.push({ value: '\n' });
      }
    }
  }

  // Remove trailing newline from cell content (canvas editor doesn't need it for last paragraph in cell)
  while (cellElements.length > 0 && cellElements[cellElements.length - 1].value === '\n' && !cellElements[cellElements.length - 1].type) {
    cellElements.pop();
  }

  // Cell must have at least one element — canvas editor requires this
  if (cellElements.length === 0) {
    cellElements.push({ value: '\u200B', size: 16 });
  }

  return cellElements;
}

function processTable(
  tblEl: Element,
  docDefaults: Partial<RunFormat>,
  paraDefaults: Partial<ParaFormat>,
  defaultParaStyleId: string | undefined,
  styles: Map<string, StyleDef>,
  numbering: { abstractNums: Map<number, NumberingDef>; numIdToAbstract: Map<number, number> },
  rels: Map<string, { target: string; type: string }>,
  images: Map<string, string>,
): EditorElement[] {
  const tblPr = wEl(tblEl, 'tblPr');

  // --- Resolve table style (e.g. Table1, Table2) for border/shading defaults ---
  let tableStyleDef: StyleDef | undefined;
  if (tblPr) {
    const tblStyleEl = wEl(tblPr, 'tblStyle');
    if (tblStyleEl) {
      const tblStyleId = wAttr(tblStyleEl, 'val') || '';
      tableStyleDef = styles.get(tblStyleId);
    }
  }

  // --- Parse column widths from w:tblGrid ---
  // Canvas editor page: width=816, margins=120 each side → content area = 576px
  const MAX_TABLE_WIDTH = 576;
  const colgroup: EditorColgroup[] = [];
  const tblGrid = wEl(tblEl, 'tblGrid');
  if (tblGrid) {
    const gridCols = wChildren(tblGrid, 'gridCol');
    const rawWidths: number[] = [];
    for (const gc of gridCols) {
      const w = wAttr(gc, 'w');
      rawWidths.push(w ? twipsToPx(parseInt(w, 10)) : 100);
    }
    // Scale down if total exceeds available content width
    const totalRaw = rawWidths.reduce((a, b) => a + b, 0);
    const scale = totalRaw > MAX_TABLE_WIDTH ? MAX_TABLE_WIDTH / totalRaw : 1;
    for (const rw of rawWidths) {
      colgroup.push({ width: Math.round(rw * scale) });
    }
  }

  // --- Parse table borders (direct on table, or from style) ---
  const borders = parseTableBorders(tblPr);
  if (!borders.top && !borders.bottom && !borders.left && !borders.right && tableStyleDef) {
    // Try to get borders from table style — check tblPr within the style
    // (Style-level borders would need separate parsing; use fallback)
  }
  const defaultBorderColor = borders.top || borders.insideH || borders.left || '#000000';
  const hasBorders = !!(borders.top || borders.bottom || borders.left || borders.right || borders.insideH || borders.insideV);

  // --- Process rows ---
  const trList: EditorTableRow[] = [];
  const rows = wChildren(tblEl, 'tr');

  // Canvas editor page: height=1056, margins=200 BUFFER= 120 each side → content area = 736px
  const MAX_TABLE_HEIGHT = 736;
  const maxLinesPerRow = Math.max(4, Math.floor(MAX_TABLE_HEIGHT / LINE_HEIGHT_PX));

  for (const tr of rows) {
    const cells = wChildren(tr, 'tc');
    const tdList: EditorTableCell[] = [];

    // Read explicit <w:trHeight> if present. Used only as a starting value
    // for the splitOversizedRow decision below; the row we emit to the
    // editor always ships MIN_ROW_HEIGHT as height/minHeight so canvas-
    // editor sizes rows from rendered cell content instead of an estimate.
    const trPr = wEl(tr, 'trPr');
    let rowHeight = MIN_ROW_HEIGHT;
    if (trPr) {
      const trHeightEl = wEl(trPr, 'trHeight');
      if (trHeightEl) {
        const hVal = wAttr(trHeightEl, 'val');
        if (hVal) rowHeight = Math.max(twipsToPx(parseInt(hVal, 10)), MIN_ROW_HEIGHT);
      }
    }

    for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
      const tc = cells[cellIdx];
      const tcPr = wEl(tc, 'tcPr');

      // Colspan from w:gridSpan
      let colspan = 1;
      if (tcPr) {
        const gridSpanEl = wEl(tcPr, 'gridSpan');
        if (gridSpanEl) {
          const gs = wAttr(gridSpanEl, 'val');
          if (gs) colspan = parseInt(gs, 10) || 1;
        }
      }

      // Rowspan from w:vMerge
      let rowspan = 1;
      if (tcPr) {
        const vMergeEl = wEl(tcPr, 'vMerge');
        if (vMergeEl) {
          const mergeVal = wAttr(vMergeEl, 'val');
          if (mergeVal === 'restart') {
            // Start of a merge — count how many rows this cell spans
            rowspan = 1; // Will be incremented if subsequent rows have vMerge continue
          } else {
            // Continuation cell — set rowspan to 0 to mark as merged
            rowspan = 0;
          }
        }
      }

      // Skip continuation cells (rowspan = 0 means merged into cell above)
      if (rowspan === 0) {
        tdList.push({
          colspan,
          rowspan: 1,
          value: [{ value: '\u200B', size: 16 }],
        });
        continue;
      }

      // Cell background from w:shd
      let backgroundColor: string | undefined;
      if (tcPr) {
        const shdEl = wEl(tcPr, 'shd');
        if (shdEl) {
          const fill = wAttr(shdEl, 'fill');
          if (fill && fill !== 'auto' && fill !== 'nil') {
            backgroundColor = `#${fill}`;
          }
        }
      }

      // Cell vertical alignment
      let verticalAlign: string | undefined;
      if (tcPr) {
        const vAlignEl = wEl(tcPr, 'vAlign');
        if (vAlignEl) {
          verticalAlign = wAttr(vAlignEl, 'val') || undefined;
        }
      }

      // Process cell content
      const cellContent = processCellContent(tc, docDefaults, paraDefaults, defaultParaStyleId, styles, numbering, rels, images);

      // Build cell with borders
      const td: EditorTableCell = {
        colspan,
        rowspan,
        value: cellContent,
      };

      if (backgroundColor) td.backgroundColor = backgroundColor;
      if (verticalAlign) td.verticalAlign = verticalAlign;

      // Apply border colors
      if (hasBorders) {
        const isFirstRow = trList.length === 0;
        const isLastRow = rows.indexOf(tr) === rows.length - 1;
        const isFirstCol = cellIdx === 0;
        const isLastCol = cellIdx === cells.length - 1;

        td.borderBgTop = isFirstRow ? (borders.top || defaultBorderColor) : (borders.insideH || defaultBorderColor);
        td.borderBgBottom = isLastRow ? (borders.bottom || defaultBorderColor) : (borders.insideH || defaultBorderColor);
        td.borderBgLeft = isFirstCol ? (borders.left || defaultBorderColor) : (borders.insideV || defaultBorderColor);
        td.borderBgRight = isLastCol ? (borders.right || defaultBorderColor) : (borders.insideV || defaultBorderColor);
        
      }
      
      // Parse cell-level border overrides (w:tcBorders) — null means explicitly no border
      if (tcPr) {
        const tcBorders = wEl(tcPr, 'tcBorders');
        if (tcBorders) {
          const cellTop = parseBorderColor(wEl(tcBorders, 'top'));
          const cellBottom = parseBorderColor(wEl(tcBorders, 'bottom'));
          const cellLeft = parseBorderColor(wEl(tcBorders, 'left')) ?? parseBorderColor(wEl(tcBorders, 'start'));
          const cellRight = parseBorderColor(wEl(tcBorders, 'right')) ?? parseBorderColor(wEl(tcBorders, 'end'));
          td.borderWidthTop = parseBorderSize(wEl(tcBorders, 'top'));
          td.borderWidthBottom = parseBorderSize(wEl(tcBorders, 'bottom'));
          td.borderWidthLeft = parseBorderSize(wEl(tcBorders, 'left')) ?? parseBorderSize(wEl(tcBorders, 'start'));
          td.borderWidthRight = parseBorderSize(wEl(tcBorders, 'right')) ?? parseBorderSize(wEl(tcBorders, 'end'));

          if (cellTop !== undefined) { if (cellTop === null) delete td.borderBgTop; else td.borderBgTop = cellTop; }
          if (cellBottom !== undefined) { if (cellBottom === null) delete td.borderBgBottom; else td.borderBgBottom = cellBottom; }
          if (cellLeft !== undefined) { if (cellLeft === null) delete td.borderBgLeft; else td.borderBgLeft = cellLeft; }
          if (cellRight !== undefined) { if (cellRight === null) delete td.borderBgRight; else td.borderBgRight = cellRight; }

          // Strip "bottom-only" decorative borders. Cells that author the
          // bottom border alone (top/left/right explicitly w:val="nil")
          // produce broken partial strokes when neighbour cells in the
          // same row have a different bottom width or none. Google Docs
          // hides these; matched cells in this resume are the inter-bullet
          // separators in the Recent Projects section. Cells with both top
          // and bottom borders (e.g. section header rows) are unaffected.
          const sideIsNil = (sideEl: Element | null) => {
            if (!sideEl) return false;
            const v = wAttr(sideEl, 'val');
            return v === 'nil' || v === 'none';
          };
          const topNil = sideIsNil(wEl(tcBorders, 'top'));
          const leftNil =
            sideIsNil(wEl(tcBorders, 'left')) ||
            sideIsNil(wEl(tcBorders, 'start'));
          const rightNil =
            sideIsNil(wEl(tcBorders, 'right')) ||
            sideIsNil(wEl(tcBorders, 'end'));
          const bottomSet =
            !!wEl(tcBorders, 'bottom') &&
            !sideIsNil(wEl(tcBorders, 'bottom'));
          if (topNil && leftNil && rightNil && bottomSet) {
            delete td.borderBgBottom;
            td.borderWidthBottom = undefined;
          }
        }
      }

      tdList.push(td);
    }

    // Estimate row height based on cell content.
    // Account for both explicit newlines AND text that will wrap within the cell.
    let estimatedHeight = rowHeight;
    for (let ci = 0; ci < tdList.length; ci++) {
      const td = tdList[ci];
      // Resolve column width for this cell (sum widths if colspan > 1)
      let cellWidthPx = 0;
      const colStart = ci;
      const colEnd = Math.min(ci + (td.colspan || 1), colgroup.length);
      for (let c = colStart; c < colEnd; c++) {
        cellWidthPx += colgroup[c]?.width ?? 100;
      }
      // Subtract cell padding (canvas-editor default tdPadding = 4, both sides)
      const usableWidth = Math.max(cellWidthPx - 8, 40);

      // Walk through elements: count explicit newlines and estimate wrapped lines
      let lineCount = 1;
      let currentLineWidth = 0;
      for (const el of td.value) {
        if (el.value === '\n' && !el.type) {
          lineCount++;
          currentLineWidth = 0;
          continue;
        }
        // Estimate character width: ~60% of font size for proportional fonts
        const fontSize = el.size || 16;
        const charWidth = fontSize * 0.6;
        currentLineWidth += charWidth;
        if (currentLineWidth > usableWidth) {
          lineCount++;
          currentLineWidth = charWidth; // wrap carry-over
        }
      }
      const cellHeight = Math.max(MIN_CELL_HEIGHT, lineCount * LINE_HEIGHT_PX);
      if (cellHeight > estimatedHeight) estimatedHeight = cellHeight;
    }

    // Emit the floor height to canvas-editor instead of our estimate.
    // Canvas-editor re-measures each row against its rendered cell content
    // and expands as needed. Passing our inflated estimate locks rows to
    // that height, leaving large empty gaps below the actual text (the
    // "extra spacing" seen in the Experience cell and at page bottoms).
    if (estimatedHeight > MAX_TABLE_HEIGHT) {
      // Splitting decision still uses the estimate, but each emitted row
      // ships with the floor so canvas-editor sizes it from content.
      const splitRows = splitOversizedRow({ height: estimatedHeight, tdList }, colgroup, maxLinesPerRow);
      for (const sr of splitRows) {
        sr.height = MIN_ROW_HEIGHT;
        sr.minHeight = MIN_ROW_HEIGHT;
        trList.push(sr);
      }
    } else {
      trList.push({ height: MIN_ROW_HEIGHT, minHeight: MIN_ROW_HEIGHT, tdList });
    }
  }

  // Per-row fill-missing only: if any cell in a row declares a top or
  // bottom border, copy it to the cells in the same row that have none.
  // Never overrides authored borders, so Skills/Education thick (sz=18)
  // dividers stay intact. Just closes nil-bottom asymmetries so the row
  // bottom renders as a continuous line across all columns, matching
  // Google Docs' page-end rendering of the same DOCX.
  for (const row of trList) {
    let fillBottomColor: string | undefined;
    let fillBottomWidth: number | undefined;
    let fillTopColor: string | undefined;
    let fillTopWidth: number | undefined;
    for (const td of row.tdList) {
      if (td.borderBgBottom && fillBottomColor === undefined) {
        fillBottomColor = td.borderBgBottom;
        fillBottomWidth = td.borderWidthBottom;
      }
      if (td.borderBgTop && fillTopColor === undefined) {
        fillTopColor = td.borderBgTop;
        fillTopWidth = td.borderWidthTop;
      }
    }
    for (const td of row.tdList) {
      if (fillBottomColor && !td.borderBgBottom) {
        td.borderBgBottom = fillBottomColor;
        td.borderWidthBottom = fillBottomWidth;
      }
      if (fillTopColor && !td.borderBgTop) {
        td.borderBgTop = fillTopColor;
        td.borderWidthTop = fillTopWidth;
      }
    }
  }

  // Gap after section separators: when the previous row draws a visible
  // bottom border (red sz>0), prepend a small blank line to each cell of
  // the next row so the text doesn't sit flush against the divider —
  // matches Google Docs spacing after section separators.
  const isVisibleBorder = (color: string | undefined) =>
    !!color && color.toLowerCase() !== '#ffffff' && color.toLowerCase() !== '#fff';
  for (let r = 1; r < trList.length; r++) {
    const prev = trList[r - 1];
    const hasPrevBottom = prev.tdList.some(td => isVisibleBorder(td.borderBgBottom));
    const hasOwnTop = trList[r].tdList.some(td => isVisibleBorder(td.borderBgTop));
    if (!hasPrevBottom && !hasOwnTop) continue;
    for (const td of trList[r].tdList) {
      if (!td.value || td.value.length === 0) continue;
      td.value.unshift({ value: '\n', size: 20 });
    }
  }

  // Page-break border continuity: when the renderer paginates this table
  // across page boundaries, it should paint the table's outer top/bottom
  // border on each page (matching Google Docs). Cache color+width here so
  // the renderer can apply it at every split point.
  const tblBordersEl = tblPr ? wEl(tblPr, 'tblBorders') : null;
  // Prefer the accent color used by section-separator rows (e.g. #fa0001)
  // over the generic tblBorders color so every page-break line matches the
  // visual accent rather than the dull insideH/top fallback.
  const accentBorderColor =
    trList.flatMap(r => r.tdList).map(td => td.borderBgTop).find(c => c && c !== '#ffffff') ||
    trList.flatMap(r => r.tdList).map(td => td.borderBgBottom).find(c => c && c !== '#ffffff');
  const pageBreakBorderTop = accentBorderColor || borders.top || borders.insideH;
  const pageBreakBorderBottom = accentBorderColor || borders.bottom || borders.insideH;
  const pageBreakBorderTopWidth = tblBordersEl
    ? parseBorderSize(wEl(tblBordersEl, 'top')) ?? parseBorderSize(wEl(tblBordersEl, 'insideH'))
    : undefined;
  const pageBreakBorderBottomWidth = tblBordersEl
    ? parseBorderSize(wEl(tblBordersEl, 'bottom')) ?? parseBorderSize(wEl(tblBordersEl, 'insideH'))
    : undefined;

  const buildTable = (rows: EditorTableRow[]): EditorElement => {
    const t: EditorElement = {
      value: '',
      type: 'table',
      colgroup: colgroup.length > 0 ? colgroup : [{ width: 200 }, { width: 200 }],
      trList: rows,
      borderType: hasBorders ? 'all' : 'empty',
    };
    if (pageBreakBorderTop) {
      t.pageBreakBorderTop = pageBreakBorderTop;
      if (pageBreakBorderTopWidth !== undefined) t.pageBreakBorderTopWidth = pageBreakBorderTopWidth;
    }
    if (pageBreakBorderBottom) {
      t.pageBreakBorderBottom = pageBreakBorderBottom;
      if (pageBreakBorderBottomWidth !== undefined) t.pageBreakBorderBottomWidth = pageBreakBorderBottomWidth;
    }
    return t;
  };

  // Split large tables into multiple tables so pagination can occur between them.
  const tables: EditorElement[] = [];
  let currentRows: EditorTableRow[] = [];
  let currentHeight = 0;

  for (const row of trList) {
    if (currentRows.length > 0 && currentHeight + row.height > MAX_TABLE_HEIGHT) {
      tables.push(buildTable(currentRows));
      // Avoid inserting a hard page break here; the editor paginates between tables.
      // Adding a pageBreak can create an empty page between split tables.
      currentRows = [];
      currentHeight = 0;
    }
    currentRows.push(row);
    currentHeight += row.height;
  }

  if (currentRows.length > 0) {
    tables.push(buildTable(currentRows));
  }
  return tables;
}

/* ------------------------------------------------------------------ */
/*  Process document body                                              */
/* ------------------------------------------------------------------ */

function processBody(
  bodyEl: Element,
  docDefaults: Partial<RunFormat>,
  paraDefaults: Partial<ParaFormat>,
  defaultParaStyleId: string | undefined,
  styles: Map<string, StyleDef>,
  numbering: { abstractNums: Map<number, NumberingDef>; numIdToAbstract: Map<number, number> },
  rels: Map<string, { target: string; type: string }>,
  images: Map<string, string>,
): EditorElement[] {
  const elements: EditorElement[] = [];

  for (const child of bodyEl.childNodes) {
    if (child.nodeType !== Node.ELEMENT_NODE) {
    continue;
    }
    
    const el = child as Element;
    switch (el.localName) {
      case 'p':
        elements.push(...processParagraph(el, docDefaults, paraDefaults, defaultParaStyleId, styles, numbering, rels, images));
        break;
      case 'tbl':
        elements.push(...processTable(el, docDefaults, paraDefaults, defaultParaStyleId, styles, numbering, rels, images));
        break;
      default:
        // Ignore other body-level elements for now (e.g. sectPr)
        break;
    }
  }

  return elements;
}

/* ------------------------------------------------------------------ */
/*  Clean up pass                                                      */
/* ------------------------------------------------------------------ */

function cleanElements(elements: EditorElement[]): EditorElement[] {
  const result: EditorElement[] = [];
  let lastWasNewline = true;

  for (const el of elements) {
    if (el.value === '\n' && !el.type && !el.listId) {
      // Non-list newlines: collapse consecutive duplicates
      if (lastWasNewline) continue;
      lastWasNewline = true;
      result.push(el);
    } else {
      // Canvas editor requires a \n before every table element
      if (el.type === 'table' && (result.length === 0 || result[result.length - 1].value !== '\n')) {
        result.push({ value: '\n' });
      }
      lastWasNewline = false;
      result.push(el);
      // Canvas editor requires a \n after every table element
      if (el.type === 'table') {
        result.push({ value: '\n' });
        lastWasNewline = true;
      }
    }
  }

  // Remove trailing newlines
  while (result.length > 0 && result[result.length - 1].value === '\n' && !result[result.length - 1].type) {
    result.pop();
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface DocxImportResult {
  header: EditorElement[];
  main: EditorElement[];
  footer: EditorElement[];
}

/**
 * Parses a .docx ArrayBuffer directly into IElement[] for the canvas editor.
 * No HTML intermediate — reads OpenXML directly.
 */
export async function docxToElements(arrayBuffer: ArrayBuffer): Promise<DocxImportResult> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parser = new DOMParser();

  // 1. Parse relationships
  const relsXml = await zip.file('word/_rels/document.xml.rels')?.async('text');
  const rels = relsXml ? parseRelationships(relsXml) : new Map<string, { target: string; type: string }>();

  // 2. Parse styles (includes docDefaults — base font/size for the document)
  const stylesXml = await zip.file('word/styles.xml')?.async('text');
  const { styles, docDefaults, paraDefaults, defaultParaStyleId } = stylesXml
    ? parseStyles(stylesXml)
    : { styles: new Map<string, StyleDef>(), docDefaults: {} as Partial<RunFormat>, paraDefaults: {} as Partial<ParaFormat>, defaultParaStyleId: undefined };

  // 3. Parse numbering
  const numberingXml = await zip.file('word/numbering.xml')?.async('text');
  const numbering = numberingXml
    ? parseNumbering(numberingXml)
    : { abstractNums: new Map<number, NumberingDef>(), numIdToAbstract: new Map<number, number>() };

  // 4. Extract all images as base64
  const images = new Map<string, string>();
  const mediaFiles = zip.folder('word/media');
  if (mediaFiles) {
    const imagePromises: Promise<void>[] = [];
    mediaFiles.forEach((relativePath, file) => {
      imagePromises.push(
        file.async('base64').then((base64) => {
          images.set(`word/media/${relativePath}`, base64);
        })
      );
    });
    await Promise.all(imagePromises);
  }

  // 5. Parse main document
  const docXml = await zip.file('word/document.xml')?.async('text');
  if (!docXml) {
    throw new Error('Invalid DOCX: missing word/document.xml');
  }

  const doc = parser.parseFromString(docXml, 'text/xml');
  const bodyEl = doc.getElementsByTagNameNS(W_NS, 'body')[0];
  if (!bodyEl) {
    throw new Error('Invalid DOCX: missing w:body');
  }

  // 6. Process the body
  const raw = processBody(bodyEl, docDefaults, paraDefaults, defaultParaStyleId, styles, numbering, rels, images);

  // 7. Header / footer extraction.
  // header/footer XML parts are referenced via sectPr → w:headerReference / w:footerReference.
  // Their root element (w:hdr / w:ftr) holds w:p / w:tbl children — same shape as w:body —
  // so processBody works on them directly. Each part can have its own *.xml.rels for inline images.
  const loadPart = async (
    refTag: 'headerReference' | 'footerReference',
    rootLocalName: 'hdr' | 'ftr',
  ): Promise<EditorElement[]> => {
    const refs = bodyEl.getElementsByTagNameNS(W_NS, refTag);
    const collected: EditorElement[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < refs.length; i++) {
      const refEl = refs[i];
      const rId = rAttr(refEl, 'id');
      if (!rId) continue;
      const rel = rels.get(rId);
      if (!rel || !rel.target) continue;
      if (seen.has(rel.target)) continue;
      seen.add(rel.target);

      const partPath = rel.target.startsWith('/')
        ? rel.target.slice(1)
        : `word/${rel.target}`;
      const partXml = await zip.file(partPath)?.async('text');
      if (!partXml) continue;

      const partRelsPath = partPath.replace(/([^/]+)$/, '_rels/$1.rels');
      const partRelsXml = await zip.file(partRelsPath)?.async('text');
      const partRels = partRelsXml
        ? parseRelationships(partRelsXml)
        : new Map<string, { target: string; type: string }>();
      const mergedRels = new Map(rels);
      partRels.forEach((v, k) => mergedRels.set(k, v));

      const partDoc = parser.parseFromString(partXml, 'text/xml');
      const rootEl = partDoc.getElementsByTagNameNS(W_NS, rootLocalName)[0];
      if (!rootEl) continue;

      const parsed = processBody(
        rootEl,
        docDefaults,
        paraDefaults,
        defaultParaStyleId,
        styles,
        numbering,
        mergedRels,
        images,
      );
      collected.push(...parsed);
      // Only honor first reference; skip alternates (default/even/first) to avoid duplication.
      break;
    }
    return cleanElements(collected);
  };

  const [header, footer] = await Promise.all([
    loadPart('headerReference', 'hdr'),
    loadPart('footerReference', 'ftr'),
  ]);

  return {
    header,
    main: cleanElements(raw),
    footer,
  };
}
