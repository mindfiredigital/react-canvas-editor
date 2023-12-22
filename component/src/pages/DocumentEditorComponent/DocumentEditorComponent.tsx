import React from "react";
import r2wc from "@r2wc/react-to-web-component";
import DocumentEditor from "../DocumentEditor";
import {
  value,
  toolbarClass,
  canvasClass,
  handleChange,
  handleSelectedText,
} from "../../utils/document-editor-props";

const WebApp = r2wc(DocumentEditor, {
  props: {
    value: "string",
    toolbar: "json",
    toolbar_class: "json",
    canvas_class: "json",
    on_change: "function",
    on_select: "function",
  },
});

customElements.define("web-doc", WebApp);

const DocumentEditorComponent = (props: {
  text?: string | undefined;
  toolbar_Item?: object | undefined;
  toolbar_Class?: object | undefined;
  canvas_Class?: object | undefined;
  handle_Change?: Function | undefined;
  handle_SelectedText?: Function | undefined;
}) => {
  window.handleChange = props
    ? props.handle_Change
      ? props.handle_Change
      : handleChange
    : handleChange;
  window.handleSelectedText = props
    ? props.handle_SelectedText
      ? props.handle_SelectedText
      : handleSelectedText
    : handleChange;

  setTimeout(() => {
    document.getElementById("de").innerHTML = `<web-doc 
      value='${props ? (props.text ? props.text : value) : value}'
      toolbar_class='${
        props
          ? props.toolbar_Class
            ? JSON.stringify(props.toolbar_Class)
            : JSON.stringify(toolbarClass)
          : JSON.stringify(toolbarClass)
      }' 
      canvas_class='${
        props
          ? props.canvas_Class
            ? JSON.stringify(props.canvas_Class)
            : JSON.stringify(canvasClass)
          : JSON.stringify(canvasClass)
      }'
      on_change='handleChange'
      on_select='handleSelectedText'
    />`;
    // toolbar='${props && props.toolbar_Item && JSON.stringify(props.toolbar_Item)}'
  }, 1000);

  return <></>;
};
export default DocumentEditorComponent;
