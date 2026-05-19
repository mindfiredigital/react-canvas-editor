import React, { FC, useRef } from "react";
import CanvasEditor from "../../components/Editor/CanvasEditor";
import EditorToolbar from "../../components/EditorToolbar/EditorToolbar";
import { HorizontalRuler } from "../../components/HorizontalRuler/HorizontalRuler";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import {
  // toolbarItem
  toolbarClass,
  canvasClass,
  handleChange,
  handleSelectedText,
  defaultText,
} from "../../utils/document-editor-props";

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

const DocumentEditor: FC<DocumentEditorProps> = ({
  toolbar /*= toolbarItem*/,
  toolbar_class = toolbarClass,
  canvas_class = canvasClass,
  on_change = handleChange,
  on_select = handleSelectedText,
  value = defaultText,
  apiBaseUrl,
  onClientDocxImport,
}) => {
  // const defaultToolbarItem = {
  //   bold: true,
  //   italic: true,
  //   underline: true,
  //   undo: true,
  //   redo: true,
  //   image: true
  // }

  const defaultToolbarClass = {
    container: {
      backgroundColor: "#edf2fa",
      border: "none",
      minHeight: "40px",
      boxShadow: "none",
    },
    primaryToolbar: {
      display: "flex",
      flexDirection: "row",
      minHeight: "40px",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  // toolbar = toolbar && Object.keys(toolbar).length ? toolbar : defaultToolbarItem;

  const toolbarClass =
    toolbar_class && Object.keys(toolbar_class).length
      ? {
          container: {
            ...defaultToolbarClass.container,
            ...toolbar_class?.container,
          },
          primaryToolbar: {
            ...defaultToolbarClass.primaryToolbar,
            ...toolbar_class?.primaryToolbar,
          },
          item: { ...toolbar_class?.item },
        }
      : defaultToolbarClass;

  const canvasRef = useRef(null);

  return (
    <Provider store={store}>
      <>
        <EditorToolbar
          ref={canvasRef}
          toolbar={toolbar}
          toolbarClass={toolbarClass}
          apiBaseUrl={apiBaseUrl}
          onClientDocxImport={onClientDocxImport}
        />
        <HorizontalRuler />
        <CanvasEditor
          ref={canvasRef}
          style={canvas_class}
          onChange={on_change}
          onSelect={on_select}
          data={value}
        />
      </>
    </Provider>
  );
};

export default DocumentEditor;
