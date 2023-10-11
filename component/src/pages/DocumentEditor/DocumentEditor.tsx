import React, { useRef } from "react";
import CanvasEditor from "../../components/Editor/CanvasEditor";
import EditorToolbar from "../../components/EditorToolbar/EditorToolbar";
import EditorFooter from "../../components/EditorFooter/EditorFooter";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

const DocumentEditor = (
  { toolbar,
    toolbarClass,
    canvasClass,
    onChange,
    onSelect,
    data }: any
) => {

  const defaultToolbarItem = {
    bold: true,
    italic: true,
    underline: true,
    undo: true,
    redo: true,
    image: true
  }

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
      alignItems: "center"
    }
  }

  toolbar = toolbar && Object.keys(toolbar).length ? toolbar : defaultToolbarItem;

  toolbarClass = toolbarClass && Object.keys(toolbarClass).length ? {
    container: { ...defaultToolbarClass.container, ...toolbarClass?.container },
    primaryToolbar: { ...defaultToolbarClass.primaryToolbar, ...toolbarClass?.primaryToolbar },
    item: { ...toolbarClass?.item }
  } : defaultToolbarClass;

  const canvasRef = useRef(null);
  return (
    <Provider store={store}>
      <>
        <EditorToolbar ref={canvasRef} toolbar={toolbar} toolbarClass={toolbarClass} />
        <CanvasEditor ref={canvasRef} style={canvasClass} onChange={onChange} onSelect={onSelect} data={data} />
        <EditorFooter />
      </>
    </Provider>
  );
}

export default DocumentEditor;