declare global {
    interface Window {
        handleChange: any;
        handleSelectedText: any;
    }
}
declare const DocumentEditorWebComponent: (props: {
    toolbar?: object | undefined;
    toolbar_class?: object | undefined;
    canvas_class?: object | undefined;
    on_change?: Function | undefined;
    on_select?: Function | undefined;
    value?: string | undefined;
}) => void;
export default DocumentEditorWebComponent;
