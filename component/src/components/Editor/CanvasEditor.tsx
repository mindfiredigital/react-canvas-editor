import React, { forwardRef, useEffect, useState } from "react";
import {
  DOMEventHandlers,
  EditorMode,
  PageMode,
  IElement,
} from "@harshita/canvas-editor";
import "./CanvasEditor.scss";
// import { SOCKET_URL, SocketEvents } from "../../utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  DocumentState,
  setDocumentId,
  setDocumentTitle,
  setDocumentMargins,
} from "../../redux/documentReducer";
import MarginRuler from "../MarginRuler/MarginRuler";
import { SelectionRect } from "../../utils/types";
import useSelectionPosition from "../../hooks/useSelectionPosition";
import FloatingBox from "../FloatingBox/FloatingBox";

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
  const doc = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;
  const dispatch = useDispatch();

  useEffect(() => {
    const container = document.querySelector(
      ".canvas-editor"
    ) as HTMLDivElement;
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
      // console.log('SelectText',DOMEventHandlers.getSelectedText());
    })

    container.addEventListener('keydown', (e)=> {
      const content = DOMEventHandlers.getContent();
      setEditorContent(content.data.main);
      const text: any = content.data.main;
      _props?.onChange && _props?.onChange({text,editorContent});
      })

    DOMEventHandlers.register(container, editorContent, editorOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      if (_props?.data) {
        console.log(_props?.data);
        
        setEditorContent(_props?.data);
        
        DOMEventHandlers.setContent({ main: [{value:_props?.data}] });
      }
  }, [documentId, dispatch, _props?.data]);

  // Multi User
  // useEffect(() => {
  //   if (!socket || !editorContent) return;
  //   // send
  //   socket.emit(SocketEvents.SEND_CHANGES, editorContent);
  //   // receive
  //   const handler = (data: any) => {
  //     // console.log(`====>`, data);
      
  //     // setEditorContent(data);
  //     // data = {...data, type:"control"};
  //     DOMEventHandlers.setContent({ main: data });
  //   };
  //   socket.on(SocketEvents.RECEIVE_CHANGES, handler);

  //   // return () => {
  //   //   socket.off(SocketEvents.RECEIVE_CHANGES, handler);
  //   // };
  // }, [socket, editorContent]);

  return (
    <div className="canvas-editor-main" style={_props?.style?.editorMain}>
      <div className="canvas-editor editor" ref={ref} style={_props?.style?.margin}>
        <MarginRuler documentId={documentId} />
      </div>
      {dropdown.visiblity && (
        <FloatingBox
          left={dropdown.left}
          top={dropdown.top}
          selectedText={selectedText}
          setDropdown={setDropdown}
        />
      )}
    </div>
  );
});

export default CanvasEditor;
