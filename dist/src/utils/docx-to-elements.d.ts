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
    valueList?: EditorElement[];
    width?: number;
    height?: number;
    rowMargin?: number;
    paragraphSpacingBefore?: number;
    paragraphSpacingAfter?: number;
    dashArray?: number[];
    trList?: EditorTableRow[];
    colgroup?: EditorColgroup[];
    borderType?: string;
    pageBreakBorderTop?: string;
    pageBreakBorderTopWidth?: number;
    pageBreakBorderBottom?: string;
    pageBreakBorderBottomWidth?: number;
}
export interface DocxImportResult {
    header: EditorElement[];
    main: EditorElement[];
    footer: EditorElement[];
}
/**
 * Parses a .docx ArrayBuffer directly into IElement[] for the canvas editor.
 * No HTML intermediate — reads OpenXML directly.
 */
export declare function docxToElements(arrayBuffer: ArrayBuffer): Promise<DocxImportResult>;
