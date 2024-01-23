import React from "react";
import r2wc from "@r2wc/react-to-web-component";
import DocumentEditor from "../DocumentEditor";
import {
  defaultText,
  toolbarClass,
  canvasClass,
  handleChange,
  handleSelectedText,
} from "../../utils/document-editor-props";
declare global {
  interface Window {
    handleChange: any;
    handleSelectedText: any;
  }
}
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

const DocumentEditorWebComponent = (props: {
  toolbar?: object | undefined;
  toolbar_class?: object | undefined;
  canvas_class?: object | undefined;
  on_change?: Function | undefined;
  on_select?: Function | undefined;
  value?: string | undefined;
}) => {

  window.handleChange = !props || (props && !props.on_change) ? props.on_change : handleChange;
  window.handleSelectedText = !props || (props && !props.on_select) ? props.on_select : handleSelectedText;

  setTimeout(() => {
    document.getElementById("document-editor").innerHTML = `<web-doc 
      value='${props ? (props.value ? props.value : defaultText) : defaultText}'
      toolbar_class='${props
        ? props.toolbar_class
          ? JSON.stringify(props.toolbar_class)
          : JSON.stringify(toolbarClass)
        : JSON.stringify(toolbarClass)
      }' 
      canvas_class='${props
        ? props.canvas_class
          ? JSON.stringify(props.canvas_class)
          : JSON.stringify(canvasClass)
        : JSON.stringify(canvasClass)
      }'
      on_change='handleChange'
      on_select='handleSelectedText'
    />`;
    // toolbar='${props && props.toolbar_Item && JSON.stringify(props.toolbar_Item)}'
  }, 1000);
};
export default DocumentEditorWebComponent;
