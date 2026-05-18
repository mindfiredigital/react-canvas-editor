import React from "react";
interface content {
    toolbar: any;
    toolbarClass: any;
    apiBaseUrl?: string;
    onClientDocxImport?: (file: File) => Promise<unknown[]>;
}
declare const EditorToolbar: React.ForwardRefExoticComponent<content & React.RefAttributes<HTMLDivElement>>;
export default EditorToolbar;
