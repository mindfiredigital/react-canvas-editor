import React from "react";
interface content {
    toolbar: any;
    toolbarClass: any;
}
declare const EditorToolbar: React.ForwardRefExoticComponent<content & React.RefAttributes<HTMLDivElement>>;
export default EditorToolbar;
