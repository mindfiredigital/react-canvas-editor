import React, { useRef } from "react";
import Toolbar from "@mui/material/Toolbar";
// import Editor from '../../components/Editor/Editor';
import EditorHeader from "../../components/EditorHeader/EditorHeader";
import CanvasEditor from "../../components/Editor/CanvasEditor";
import EditorToolbar from "../../components/EditorToolbar/EditorToolbar";
import EditorFooter from "../../components/EditorFooter/EditorFooter";

function DocumentEditor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <EditorHeader />
      <Toolbar />
      <EditorToolbar ref={canvasRef} />
      <CanvasEditor ref={canvasRef} />
      <EditorFooter />
    </>
  );
}

export default DocumentEditor;
