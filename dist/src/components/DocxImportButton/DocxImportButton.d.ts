import React from "react";
interface DocxImportButtonProps {
    style?: React.CSSProperties;
    apiBaseUrl?: string;
    /**
     * Optional client-side import handler. When provided, the button will call
     * this function with the selected File instead of uploading to the backend.
     * The handler should return IElement[] to load into the editor.
     */
    onClientImport?: (file: File) => Promise<unknown[]>;
}
declare const DocxImportButton: React.FC<DocxImportButtonProps>;
export default DocxImportButton;
