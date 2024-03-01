import React from "react";
import "./CanvasEditor.scss";
interface content {
    style?: any;
    onChange?: any;
    onSelect?: any;
    data?: any;
}
declare const CanvasEditor: React.ForwardRefExoticComponent<content & React.RefAttributes<HTMLDivElement>>;
export default CanvasEditor;
