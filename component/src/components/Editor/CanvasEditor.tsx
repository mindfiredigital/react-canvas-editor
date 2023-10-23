import {
  DOMEventHandlers,
  EditorMode, IElement, PageMode
} from "@mindfiredigital/canvas-editor";
import React, { forwardRef, useEffect, useState } from "react";
import "./CanvasEditor.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useSelectionPosition from "../../hooks/useSelectionPosition";
import {
  DocumentState
} from "../../redux/documentReducer";
import { RootState } from "../../redux/store";
import { SelectionRect } from "../../utils/types";
import MarginRuler from "../MarginRuler/MarginRuler";

interface content {
  style?: any,
  onChange?: any,
  onSelect?: any,
  data?: any
}

const CanvasEditor = forwardRef<HTMLDivElement, content>(function Editor(
  _props,
  ref
) {
  const [dropdown, setDropdown] = useState<SelectionRect>({
    left: 1180,
    top: 250,
    visiblity: false,
  });
  const [editorContent, setEditorContent] = useState<IElement[]>([]);

  const [selectedText, setSelectedText] = useState<string>("");

  const { documentId } = useParams();
  useSelectionPosition(setSelectedText, setDropdown);
  const dispatch = useDispatch();

  useEffect(() => {
    const container = document.querySelector(
      ".canvas-editor"
    ) as HTMLDivElement;

    if(container.querySelector('[editor-component="main"]')) {
      return 
    }
    
    const editorOptions = {
      height: 1056,
      width: 816,
      mode: EditorMode.EDIT,
      pageMode: PageMode.PAGING,
      pageNumber: {
        format: "{pageNo}/{pageCount}",
      },
      minSize: 1,
      maxSize: 72,
    };

    container.addEventListener('mouseup', (e) => {
      _props.onSelect && _props?.onSelect(DOMEventHandlers.getSelectedText());
    })

    container.addEventListener('keydown', (e) => {
      const text = DOMEventHandlers.getContent()?.data?.main;
      setEditorContent(text);
      _props?.onChange && _props?.onChange(text[0].value);
    })

    DOMEventHandlers.register(container, editorContent, editorOptions);
  }, []);

  useEffect(() => {
    if (_props?.data) {

      setEditorContent(_props?.data);

      DOMEventHandlers.setContent({ main: [{ value: _props?.data }] });
    }
  }, [documentId, dispatch, _props?.data]);

  return (
    <div className="canvas-editor-main" style={_props?.style?.editorMain}>
      <div className="canvas-editor editor" ref={ref} style={_props?.style?.margin}>
        <MarginRuler documentId={documentId} />
      </div>
    </div>
  );
});

export default CanvasEditor;
