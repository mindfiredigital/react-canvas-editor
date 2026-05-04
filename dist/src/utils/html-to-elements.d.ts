/**
 * HTML → IElement[] converter for LibreOffice HTML output.
 *
 * Parses the high-fidelity HTML produced by LibreOffice headless conversion
 * and converts it to the canvas-editor's per-character IElement[] format.
 */
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
export declare function htmlToElements(html: string): EditorElement[];
