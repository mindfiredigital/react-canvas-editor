/**
 * HTML → IElement[] converter for LibreOffice HTML output.
 *
 * Parses the high-fidelity HTML produced by LibreOffice headless conversion
 * and converts it to the canvas-editor's per-character IElement[] format.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EditorTableCell {
  colspan: number;
  rowspan: number;
  value: EditorElement[];
  verticalAlign?: string;
  backgroundColor?: string;
  borderBgTop?: string;
  borderBgBottom?: string;
  borderBgLeft?: string;
  borderBgRight?: string;
}

export interface EditorTableRow {
  height: number;
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
  width?: number;
  height?: number;
  trList?: EditorTableRow[];
  colgroup?: EditorColgroup[];
  borderType?: string;
}

/* ------------------------------------------------------------------ */
/*  Formatting context                                                 */
/* ------------------------------------------------------------------ */

interface FormatCtx {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeout: boolean;
  color?: string;
  font?: string;
  size?: number;
  highlight?: string;
  url?: string;
  alignment?: string;
  titleLevel?: string;
  listType?: string;
  listStyle?: string;
}

function defaultCtx(): FormatCtx {
  return { bold: false, italic: false, underline: false, strikeout: false };
}

/* ------------------------------------------------------------------ */
/*  Style parsing helpers                                              */
/* ------------------------------------------------------------------ */

function getInlineStyles(el: Element): Record<string, string> {
  const style = el.getAttribute('style');
  if (!style) return {};
  const map: Record<string, string> = {};
  for (const part of style.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    if (key && val) map[key] = val;
  }
  return map;
}

function parseFontSizePt(raw: string): number | undefined {
  if (!raw) return undefined;
  const ptMatch = raw.match(/([\d.]+)\s*pt/i);
  if (ptMatch) return Math.round(parseFloat(ptMatch[1]));
  const pxMatch = raw.match(/([\d.]+)\s*px/i);
  if (pxMatch) return Math.round(parseFloat(pxMatch[1]) * 0.75);
  return undefined;
}

function htmlSizeToPt(size: string): number | undefined {
  const n = parseInt(size, 10);
  if (isNaN(n)) return undefined;
  const map: Record<number, number> = { 1: 8, 2: 10, 3: 12, 4: 14, 5: 18, 6: 24, 7: 36 };
  return map[n] || 12;
}

function parseColor(raw: string | null): string | undefined {
  if (!raw || raw === 'auto' || raw === 'transparent' || raw === 'inherit') return undefined;
  // strip anything after a color value (e.g. "transparent url(...)")
  const trimmed = raw.trim().split(/\s+/)[0];
  if (trimmed === 'transparent' || trimmed === 'none') return undefined;
  if (trimmed.startsWith('#')) return trimmed;
  const rgbMatch = raw.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return undefined;
}

function parseAlignment(el: Element): string | undefined {
  const align = el.getAttribute('align');
  if (align) {
    switch (align.toLowerCase()) {
      case 'center': return 'center';
      case 'right': return 'right';
      case 'justify': return 'alignment';
    }
  }
  const styles = getInlineStyles(el);
  const ta = styles['text-align'];
  if (ta) {
    switch (ta.toLowerCase()) {
      case 'center': return 'center';
      case 'right': return 'right';
      case 'justify': return 'alignment';
    }
  }
  return undefined;
}

function parseBorderFromStyle(borderStr: string): string | undefined {
  if (!borderStr) return undefined;
  const lower = borderStr.toLowerCase().trim();
  if (lower === 'none' || lower.startsWith('none')) return undefined;
  const colorMatch = lower.match(/#[0-9a-f]{3,6}/i);
  if (colorMatch) return colorMatch[0];
  if (lower.includes('solid') || lower.includes('double') || lower.includes('dashed')) return '#000000';
  return undefined;
}

function parsePixelWidth(raw: string | null | undefined): number | undefined {
  if (!raw) return undefined;
  const num = parseInt(raw, 10);
  return isNaN(num) ? undefined : num;
}

/* ------------------------------------------------------------------ */
/*  HTML whitespace collapsing                                         */
/* ------------------------------------------------------------------ */

function collapseWhitespace(text: string): string {
  return text.replace(/[\t\n\r]+/g, ' ').replace(/ {2,}/g, ' ');
}

/* ------------------------------------------------------------------ */
/*  Format merging                                                     */
/* ------------------------------------------------------------------ */

function mergeFormat(parent: FormatCtx, el: Element): FormatCtx {
  const ctx: FormatCtx = { ...parent };
  const tag = el.tagName.toLowerCase();
  const styles = getInlineStyles(el);

  if (tag === 'b' || tag === 'strong') ctx.bold = true;
  if (tag === 'i' || tag === 'em') ctx.italic = true;
  if (tag === 'u') ctx.underline = true;
  if (tag === 's' || tag === 'strike' || tag === 'del') ctx.strikeout = true;

  if (tag === 'font') {
    const face = el.getAttribute('face');
    if (face) ctx.font = face.split(',')[0].trim();
    const color = el.getAttribute('color');
    const parsed = parseColor(color);
    if (parsed) ctx.color = parsed;
    const sizeAttr = el.getAttribute('size');
    if (sizeAttr) {
      const mapped = htmlSizeToPt(sizeAttr);
      if (mapped) ctx.size = mapped;
    }
  }

  if (styles['font-weight'] === 'bold' || styles['font-weight'] === '700') ctx.bold = true;
  if (styles['font-style'] === 'italic') ctx.italic = true;
  if (styles['text-decoration']?.includes('underline')) ctx.underline = true;
  if (styles['text-decoration']?.includes('line-through')) ctx.strikeout = true;

  const styleColor = parseColor(styles['color'] || null);
  if (styleColor) ctx.color = styleColor;

  // FIX BUG 9: check both background-color AND background shorthand
  const bgColor = parseColor(styles['background-color'] || styles['background'] || null);
  if (bgColor && bgColor !== '#fcfcfc') ctx.highlight = bgColor;

  const fontFamily = styles['font-family'];
  if (fontFamily) ctx.font = fontFamily.split(',')[0].trim().replace(/['"]/g, '');

  const fontSize = styles['font-size'];
  if (fontSize) {
    const mapped = parseFontSizePt(fontSize);
    if (mapped) ctx.size = mapped;
  }

  if (tag === 'a') {
    const href = el.getAttribute('href');
    if (href) ctx.url = href;
  }

  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Character element builder                                          */
/* ------------------------------------------------------------------ */

function charToElement(char: string, ctx: FormatCtx): EditorElement {
  const el: EditorElement = { value: char };
  if (ctx.bold) el.bold = true;
  if (ctx.italic) el.italic = true;
  if (ctx.underline) el.underline = true;
  if (ctx.strikeout) el.strikeout = true;
  if (ctx.color) el.color = ctx.color;
  if (ctx.highlight) el.highlight = ctx.highlight;
  if (ctx.font) el.font = ctx.font;
  if (ctx.size) el.size = ctx.size;
  if (ctx.url) {
    el.type = 'hyperlink';
    el.url = ctx.url;
  }
  if (ctx.alignment) el.rowFlex = ctx.alignment;
  if (ctx.titleLevel) el.titleLevel = ctx.titleLevel;
  if (ctx.listType) {
    el.listType = ctx.listType;
    el.listStyle = ctx.listStyle;
  }
  return el;
}

function pushText(text: string, ctx: FormatCtx, elements: EditorElement[]): void {
  const collapsed = collapseWhitespace(text);
  if (!collapsed) return;

  let str = collapsed;
  if (str.startsWith(' ') && elements.length > 0) {
    const last = elements[elements.length - 1];
    if (last.value === ' ' || last.value === '\n' || last.value === '\t') {
      str = str.slice(1);
    }
  }
  if (!str) return;

  for (const char of str) {
    elements.push(charToElement(char, ctx));
  }
}

/* ------------------------------------------------------------------ */
/*  Image handling                                                     */
/* ------------------------------------------------------------------ */

function parseImage(img: Element): EditorElement | null {
  const src = img.getAttribute('src');
  if (!src) return null;

  let width = parsePixelWidth(img.getAttribute('width')) || 300;
  let height = parsePixelWidth(img.getAttribute('height')) || 200;

  const MAX_WIDTH = 600;
  if (width > MAX_WIDTH) {
    const ratio = MAX_WIDTH / width;
    width = MAX_WIDTH;
    height = Math.round(height * ratio);
  }

  return { value: src, type: 'image', width, height };
}

/* ------------------------------------------------------------------ */
/*  Direct children helper                                             */
/* ------------------------------------------------------------------ */

function directChildren(parent: Element, tagName: string): Element[] {
  const result: Element[] = [];
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i].tagName.toLowerCase() === tagName) {
      result.push(parent.children[i]);
    }
  }
  return result;
}

function getDirectRows(tableEl: Element): Element[] {
  const rows: Element[] = [];
  for (let i = 0; i < tableEl.children.length; i++) {
    const child = tableEl.children[i];
    const tag = child.tagName.toLowerCase();
    if (tag === 'tr') rows.push(child);
    if (tag === 'tbody' || tag === 'thead' || tag === 'tfoot') {
      rows.push(...directChildren(child, 'tr'));
    }
  }
  return rows;
}

/* ------------------------------------------------------------------ */
/*  Table processing                                                   */
/* ------------------------------------------------------------------ */

function parseColgroup(tableEl: Element): EditorColgroup[] {
  const MAX_TABLE_WIDTH = 576;
  const colgroup: EditorColgroup[] = [];
  const cols = directChildren(tableEl, 'col');
  for (const cg of directChildren(tableEl, 'colgroup')) {
    cols.push(...directChildren(cg, 'col'));
  }
  const rawWidths: number[] = [];
  for (const col of cols) {
    const w = parsePixelWidth(col.getAttribute('width'));
    rawWidths.push(w || 100);
  }
  if (rawWidths.length > 0) {
    const totalRaw = rawWidths.reduce((a, b) => a + b, 0);
    const scale = totalRaw > MAX_TABLE_WIDTH ? MAX_TABLE_WIDTH / totalRaw : 1;
    for (const rw of rawWidths) {
      colgroup.push({ width: Math.round(rw * scale) });
    }
  }
  return colgroup;
}

/** Process cell content into EditorElement[]. */
function processCellContent(cell: Element, extraCtx?: Partial<FormatCtx>): EditorElement[] {
  const cellCtx: FormatCtx = { ...defaultCtx(), ...extraCtx };
  const cellContent = processInlineContent(cell, cellCtx);

  // Trim trailing newlines
  while (cellContent.length > 0 && cellContent[cellContent.length - 1].value === '\n' && !cellContent[cellContent.length - 1].type) {
    cellContent.pop();
  }
  // Trim leading whitespace
  while (cellContent.length > 0 && cellContent[0].value.trim() === '' && !cellContent[0].type) {
    cellContent.shift();
  }
  if (cellContent.length === 0) {
    cellContent.push({ value: '\u200B', size: 16 });
  }
  return cellContent;
}

/**
 * Process a single <tr> into a table row + its parsed cell content.
 * Returns null for empty spacer rows.
 * We return the parsed cell content alongside the row so it can be reused
 * by flattenRowToElements without double-parsing (FIX BUG 1).
 */
/**
 * Canvas editor page height = 1056px. A table row exceeding this gets clipped
 * because the editor cannot page-break within a table row.
 * When a row is too tall, split its content across multiple table rows so the
 * 2-column layout is preserved (e.g. resume: label | content).
 */
const MAX_ROW_HEIGHT_FOR_TABLE = 700;
const LINE_HEIGHT_PX = 22;

/**
 * Estimate line count for a cell's content at a given usable width.
 * Handles both per-character elements ({value:"a"}) and multi-character
 * elements ({value:"Headless Pivot Table Library"}).
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
    // Each character in the value contributes charWidth pixels
    const charWidth = (el.size || 16) * 0.6;
    const elWidth = charWidth * (el.type === 'image' ? 1 : el.value.length);
    currentLineWidth += elWidth;
    // Wrap: how many full lines does this element span?
    while (currentLineWidth > usableWidth) {
      lineCount++;
      currentLineWidth -= usableWidth;
    }
  }
  return lineCount;
}

interface ParsedRow {
  row: EditorTableRow;
  anyBorder: boolean;
  cellContents: EditorElement[][];
  cells: Element[];
}

function processTableRow(
  tr: Element,
  hasBorderAttr: boolean,
  colgroup: EditorColgroup[] = [],
): ParsedRow | null {
  const cells = directChildren(tr, 'td').concat(directChildren(tr, 'th'));
  if (cells.length === 0) return null;

  const tdList: EditorTableCell[] = [];
  const isHeader = cells.some((c) => c.tagName.toLowerCase() === 'th');
  let anyBorder = false;
  const cellContents: EditorElement[][] = [];

  let rowHeight = 40;
  const trStyles = getInlineStyles(tr);
  if (trStyles['height']) {
    const h = parsePixelWidth(trStyles['height']);
    if (h) rowHeight = Math.max(h, 30);
  }

  for (const cell of cells) {
    const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
    const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
    const cellStyles = getInlineStyles(cell);

    let backgroundColor: string | undefined;
    const bg = parseColor(cellStyles['background'] || cellStyles['background-color'] || null);
    if (bg) backgroundColor = bg;

    const vAlign = cell.getAttribute('valign') || cellStyles['vertical-align'];

    const extraCtx: Partial<FormatCtx> = {};
    if (isHeader) extraCtx.bold = true;
    const cellContent = processCellContent(cell, extraCtx);
    cellContents.push(cellContent);

    const td: EditorTableCell = { colspan, rowspan, value: cellContent };
    if (backgroundColor) td.backgroundColor = backgroundColor;
    if (vAlign && vAlign !== 'baseline') td.verticalAlign = vAlign;

    const borderTop = parseBorderFromStyle(cellStyles['border-top'] || '');
    const borderBottom = parseBorderFromStyle(cellStyles['border-bottom'] || '');
    const borderLeft = parseBorderFromStyle(cellStyles['border-left'] || '');
    const borderRight = parseBorderFromStyle(cellStyles['border-right'] || '');
    const borderAll = parseBorderFromStyle(cellStyles['border'] || '');

    if (borderTop) td.borderBgTop = borderTop;
    else if (borderAll) td.borderBgTop = borderAll;
    if (borderBottom) td.borderBgBottom = borderBottom;
    else if (borderAll) td.borderBgBottom = borderAll;
    if (borderLeft) td.borderBgLeft = borderLeft;
    else if (borderAll) td.borderBgLeft = borderAll;
    if (borderRight) td.borderBgRight = borderRight;
    else if (borderAll) td.borderBgRight = borderAll;

    if (hasBorderAttr && !td.borderBgTop && !td.borderBgBottom && !td.borderBgLeft && !td.borderBgRight) {
      td.borderBgTop = '#000000';
      td.borderBgBottom = '#000000';
      td.borderBgLeft = '#000000';
      td.borderBgRight = '#000000';
    }

    if (td.borderBgTop || td.borderBgBottom || td.borderBgLeft || td.borderBgRight) {
      anyBorder = true;
    }

    tdList.push(td);
  }

  let estimatedHeight = rowHeight;
  for (let ci = 0; ci < tdList.length; ci++) {
    const td = tdList[ci];
    // Resolve column width for this cell (sum widths if colspan > 1)
    let cellWidthPx = 0;
    const colEnd = Math.min(ci + (td.colspan || 1), colgroup.length);
    for (let c = ci; c < colEnd; c++) {
      cellWidthPx += colgroup[c]?.width ?? 100;
    }
    // Subtract cell padding (canvas-editor default tdPadding = 4, both sides)
    const usableWidth = Math.max(cellWidthPx - 8, 40);

    // Use the shared estimateLineCount (handles multi-char elements)
    const lineCount = estimateLineCount(td.value, usableWidth);
    const cellHeight = Math.max(30, lineCount * LINE_HEIGHT_PX);
    if (cellHeight > estimatedHeight) estimatedHeight = cellHeight;
  }

  return { row: { height: estimatedHeight, tdList }, anyBorder, cellContents, cells };
}

function buildTableElement(
  trList: EditorTableRow[],
  colgroup: EditorColgroup[],
  anyBorder: boolean,
): EditorElement {
  return {
    value: '',
    type: 'table',
    colgroup: colgroup.length > 0 ? colgroup : [{ width: 200 }, { width: 200 }],
    trList,
    borderType: anyBorder ? 'all' : 'empty',
  };
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
  let lastGoodBreak = -1; // index of last \n where we could split

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el.value === '\n' && !el.type) {
      lineCount++;
      currentLineWidth = 0;

      if (lineCount <= maxLines) {
        lastGoodBreak = i; // remember this as a safe split point
      }

      if (lineCount > maxLines) {
        // Exceeded limit — split at the last good break point
        if (lastGoodBreak >= chunkStart) {
          chunks.push(elements.slice(chunkStart, lastGoodBreak + 1));
          chunkStart = lastGoodBreak + 1;
        } else {
          // No good break in this chunk — force split here
          chunks.push(elements.slice(chunkStart, i + 1));
          chunkStart = i + 1;
        }
        // Reset counters for new chunk
        lineCount = 1;
        currentLineWidth = 0;
        lastGoodBreak = -1;
      }
    } else {
      const charWidth = (el.size || 16) * 0.6;
      const elWidth = charWidth * (el.type === 'image' ? 1 : el.value.length);
      currentLineWidth += elWidth;
      while (currentLineWidth > usableWidth) {
        lineCount++;
        currentLineWidth -= usableWidth;
      }

      if (lineCount > maxLines) {
        // Exceeded limit mid-text — split at last \n or force here
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
        // Re-process current element in new chunk
        i--;
      }
    }
  }

  // Remaining elements
  if (chunkStart < elements.length) {
    chunks.push(elements.slice(chunkStart));
  }

  return chunks.length > 0 ? chunks : [elements];
}

/**
 * Split an oversized ParsedRow into multiple table rows, preserving the
 * table's column layout. The first split row keeps the original cell0 label;
 * subsequent rows get an empty cell0.
 */
function splitOversizedRow(
  parsed: ParsedRow,
  colgroup: EditorColgroup[],
): EditorTableRow[] {
  // Find the tallest cell (the one causing the overflow)
  const tdList = parsed.row.tdList;
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

  // Calculate usable width for the tallest cell
  let tallCellWidth = 0;
  const colEnd = Math.min(tallestIdx + (tdList[tallestIdx].colspan || 1), colgroup.length);
  for (let c = tallestIdx; c < colEnd; c++) tallCellWidth += colgroup[c]?.width ?? 100;
  const usableWidth = Math.max(tallCellWidth - 8, 40);

  const maxLinesPerRow = Math.floor(MAX_ROW_HEIGHT_FOR_TABLE / LINE_HEIGHT_PX);
  const chunks = splitCellContent(tdList[tallestIdx].value, usableWidth, maxLinesPerRow);

  if (chunks.length <= 1) {
    // Couldn't split — return original row as-is
    return [parsed.row];
  }

  const result: EditorTableRow[] = [];
  for (let ci = 0; ci < chunks.length; ci++) {
    const newTdList: EditorTableCell[] = [];

    for (let ti = 0; ti < tdList.length; ti++) {
      if (ti === tallestIdx) {
        // Split cell — use this chunk's content
        const chunkContent = chunks[ci];
        const lines = estimateLineCount(chunkContent, usableWidth);
        const td: EditorTableCell = {
          colspan: tdList[ti].colspan,
          rowspan: 1,
          value: chunkContent,
        };
        if (tdList[ti].backgroundColor) td.backgroundColor = tdList[ti].backgroundColor;
        if (tdList[ti].borderBgTop) td.borderBgTop = tdList[ti].borderBgTop;
        if (tdList[ti].borderBgBottom) td.borderBgBottom = tdList[ti].borderBgBottom;
        if (tdList[ti].borderBgLeft) td.borderBgLeft = tdList[ti].borderBgLeft;
        if (tdList[ti].borderBgRight) td.borderBgRight = tdList[ti].borderBgRight;
        newTdList.push(td);
      } else {
        // Non-split cells: first chunk gets original content, rest get empty placeholder
        if (ci === 0) {
          newTdList.push({ ...tdList[ti], rowspan: 1 });
        } else {
          const td: EditorTableCell = {
            colspan: tdList[ti].colspan,
            rowspan: 1,
            value: [{ value: '\u200B', size: 16 }],
          };
          if (tdList[ti].backgroundColor) td.backgroundColor = tdList[ti].backgroundColor;
          if (tdList[ti].borderBgLeft) td.borderBgLeft = tdList[ti].borderBgLeft;
          if (tdList[ti].borderBgRight) td.borderBgRight = tdList[ti].borderBgRight;
          newTdList.push(td);
        }
      }
    }

    // Estimate this split row's height
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

function processTableToElements(tableEl: Element): EditorElement[] {
  const colgroup = parseColgroup(tableEl);
  const borderAttr = tableEl.getAttribute('border');
  const hasBorderAttr = !!(borderAttr && borderAttr !== '0');
  const rows = getDirectRows(tableEl);

  // Group consecutive content rows, splitting at empty spacer rows
  const groups: Element[][] = [];
  let currentGroup: Element[] = [];

  for (const tr of rows) {
    const cells = directChildren(tr, 'td').concat(directChildren(tr, 'th'));
    if (cells.length === 0) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      currentGroup.push(tr);
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  const elements: EditorElement[] = [];

  for (const group of groups) {
    const tableRows: EditorTableRow[] = [];
    let anyBorder = false;

    for (const tr of group) {
      const parsed = processTableRow(tr, hasBorderAttr, colgroup);
      if (!parsed) continue;

      if (parsed.row.height > MAX_ROW_HEIGHT_FOR_TABLE) {
        // Split oversized row into multiple table rows, preserving column layout
        const splitRows = splitOversizedRow(parsed, colgroup);
        for (const sr of splitRows) {
          tableRows.push(sr);
        }
      } else {
        tableRows.push(parsed.row);
      }
      if (parsed.anyBorder) anyBorder = true;
    }

    if (tableRows.length > 0) {
      elements.push(buildTableElement(tableRows, colgroup, anyBorder));
    }
  }

  return elements;
}

/* ------------------------------------------------------------------ */
/*  Heading level detection                                            */
/* ------------------------------------------------------------------ */

function headingLevel(tag: string): string | undefined {
  switch (tag) {
    case 'h1': return 'first';
    case 'h2': return 'second';
    case 'h3': return 'third';
    case 'h4': return 'fourth';
    case 'h5': return 'fifth';
    case 'h6': return 'sixth';
    default: return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Process inline content                                             */
/* ------------------------------------------------------------------ */

const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'blockquote', 'pre']);

function processInlineContent(container: Element, parentCtx: FormatCtx): EditorElement[] {
  const elements: EditorElement[] = [];

  for (let i = 0; i < container.childNodes.length; i++) {
    const node = container.childNodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      pushText(text, parentCtx, elements);
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    // Skip empty named anchors (LibreOffice generates <a name="..."></a>)
    if (tag === 'a' && !el.getAttribute('href') && !el.textContent?.trim()) continue;

    if (tag === 'br') {
      elements.push({ value: '\n' });
      continue;
    }

    if (tag === 'img') {
      const imgEl = parseImage(el);
      if (imgEl) elements.push(imgEl);
      continue;
    }

    // Tables — split at spacer rows, flatten oversized rows
    if (tag === 'table') {
      const tableElements = processTableToElements(el);
      for (const tblEl of tableElements) {
        if (elements.length > 0 && elements[elements.length - 1].value !== '\n') {
          elements.push({ value: '\n' });
        }
        elements.push(tblEl);
        elements.push({ value: '\n' });
      }
      continue;
    }

    // Block elements (p, h1-h6, div)
    if (BLOCK_TAGS.has(tag)) {
      const blockCtx = mergeFormat(parentCtx, el);
      const align = parseAlignment(el);
      if (align) blockCtx.alignment = align;

      const level = headingLevel(tag);
      if (level) blockCtx.titleLevel = level;

      const paraElements = processInlineContent(el, blockCtx);

      // FIX BUG 3: Always push paragraph content — don't skip "empty" paragraphs.
      // The canvas editor handles blank lines via \n elements.
      // Only skip if the paragraph has literally zero parsed elements.
      if (paraElements.length > 0) {
        elements.push(...paraElements);
      }

      const paraBreak: EditorElement = { value: '\n' };
      if (blockCtx.alignment) paraBreak.rowFlex = blockCtx.alignment;
      if (blockCtx.titleLevel) paraBreak.titleLevel = blockCtx.titleLevel;
      elements.push(paraBreak);
      continue;
    }

    // Lists
    if (tag === 'ul' || tag === 'ol') {
      const listItems = directChildren(el, 'li');
      for (const li of listItems) {
        const liCtx: FormatCtx = {
          ...mergeFormat(parentCtx, li),
          listType: tag === 'ul' ? 'ul' : 'ol',
          listStyle: tag === 'ul' ? 'disc' : 'decimal',
        };
        const liElements = processInlineContent(li, liCtx);
        elements.push(...liElements);

        const paraBreak: EditorElement = { value: '\n' };
        paraBreak.listType = liCtx.listType;
        paraBreak.listStyle = liCtx.listStyle;
        if (liCtx.alignment) paraBreak.rowFlex = liCtx.alignment;
        elements.push(paraBreak);
      }
      continue;
    }

    // Inline elements: font, b, i, u, s, a, span, etc.
    const childCtx = mergeFormat(parentCtx, el);
    elements.push(...processInlineContent(el, childCtx));
  }

  return elements;
}

/* ------------------------------------------------------------------ */
/*  Clean up pass                                                      */
/* ------------------------------------------------------------------ */

function cleanElements(elements: EditorElement[]): EditorElement[] {
  const result: EditorElement[] = [];
  let consecutiveNewlines = 0;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Skip space after newline
    if (el.value === ' ' && !el.type && result.length > 0 && result[result.length - 1].value === '\n') {
      continue;
    }

    if (el.value === '\n' && !el.type) {
      consecutiveNewlines++;
      // FIX BUG 4: Allow up to 2 consecutive newlines (needed for table spacing).
      // Collapse only 3+ consecutive newlines.
      if (consecutiveNewlines > 2) continue;
      result.push(el);
    } else {
      consecutiveNewlines = 0;
      // Canvas editor requires \n before every table element
      if (el.type === 'table' && (result.length === 0 || result[result.length - 1].value !== '\n')) {
        result.push({ value: '\n' });
      }
      result.push(el);
      // Canvas editor requires \n after every table element
      if (el.type === 'table') {
        result.push({ value: '\n' });
        consecutiveNewlines = 1;
      }
    }
  }

  // Remove trailing newlines
  while (result.length > 0 && result[result.length - 1].value === '\n' && !result[result.length - 1].type) {
    result.pop();
  }

  // Remove leading whitespace
  while (result.length > 0 && result[0].value.trim() === '' && !result[0].type) {
    result.shift();
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function htmlToElements(html: string): EditorElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  if (!body) return [];

  const ctx = defaultCtx();
  const raw = processInlineContent(body, ctx);
  return cleanElements(raw);
}
