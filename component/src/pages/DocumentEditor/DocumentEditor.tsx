import React, { FC, useRef } from "react";
import CanvasEditor from "../../components/Editor/CanvasEditor";
import EditorToolbar from "../../components/EditorToolbar/EditorToolbar";
import EditorFooter from "../../components/EditorFooter/EditorFooter";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

type DocumentEditorProps = {
  toolbar?: Record<string, any>;
  toolbar_class?: Record<string, any>;
  canvas_class?: Record<string, any>;
  on_change?: (data: string) => any;
  on_select?: (text: string) => any;
  value?: string;
};

const DocumentEditor: FC<DocumentEditorProps> = ({
  toolbar,
  toolbar_class,
  canvas_class,
  on_change,
  on_select,
  value,
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
      justifyContent: "left",
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
        />
        <CanvasEditor
          ref={canvasRef}
          style={canvas_class}
          onChange={on_change}
          onSelect={on_select}
          data={value}
        />
        <EditorFooter />
      </>
    </Provider>
  );
};

export default DocumentEditor;
