import React, { useRef } from "react";
// import Toolbar from "@mui/material/Toolbar";
// import Editor from '../../components/Editor/Editor';
// import EditorHeader from "../../components/EditorHeader/EditorHeader";
import CanvasEditor from "../../components/Editor/CanvasEditor";
import EditorToolbar from "../../components/EditorToolbar/EditorToolbar";
// import EditorFooter from "../../components/EditorFooter/EditorFooter";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
const DocumentEditor = () => {
  // const [a, seta] = React.useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <Provider store={store}>
    <>
    {/* Hello world Document Editor */}
      {/* <EditorHeader /> */}
      {/* <Toolbar /> */}
      <EditorToolbar ref={canvasRef} />
      {/* <CanvasEditor ref={canvasRef} /> */}
      {/* I am in the Lib */}
      {/* <EditorFooter /> */}
      {/* Hello world */}
    </>
     </Provider>
  );
}

export default DocumentEditor;