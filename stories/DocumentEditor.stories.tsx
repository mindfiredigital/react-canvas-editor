import { DocumentEditorComponent, DocumentEditor } from "../component";
import React from "react";
import {
  toolbarItem,
  canvasClass,
  handleChange,
  handleSelectedText,
  toolbarClass,
  value,
} from "../component/src/utils/document-editor-props";

export default {
  component: DocumentEditor,
  title: "DocumentEditor",
};

DocumentEditorComponent({
  // toolbar_Item: toolbarItem,
  text: value,
  toolbar_Class: toolbarClass,
  canvas_Class: canvasClass,
  handle_Change: handleChange,
  handle_SelectedText: handleSelectedText,
});

export const test = () => <div id='de'></div>;
