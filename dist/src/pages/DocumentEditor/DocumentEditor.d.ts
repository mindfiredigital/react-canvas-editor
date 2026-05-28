import { FC } from "react";
type DocumentEditorProps = {
    toolbar?: Record<string, any>;
    toolbar_class?: Record<string, any>;
    canvas_class?: Record<string, any>;
    on_change?: (data: string) => any;
    on_select?: (text: string) => any;
    value?: string;
    apiBaseUrl?: string;
    onClientDocxImport?: (file: File) => Promise<unknown[]>;
};
declare const DocumentEditor: FC<DocumentEditorProps>;
export default DocumentEditor;
