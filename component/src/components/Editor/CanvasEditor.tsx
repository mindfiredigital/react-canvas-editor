import React, { forwardRef, useEffect, useState } from "react";
import {
  DOMEventHandlers,
  EditorMode,
  PageMode,
  IElement,
} from "@harshita/canvas-editor";
import "./CanvasEditor.scss";
// import { SOCKET_URL, SocketEvents } from "../../utils/constant";
// import { Socket, io } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter";
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

const CanvasEditor = forwardRef<HTMLDivElement, unknown>(function Editor(
  _props,
  ref
) {
  const [dropdown, setDropdown] = useState<SelectionRect>({
    left: 1180,
    top: 250,
    visiblity: false,
  });
  const [editorContent, setEditorContent] = useState<IElement[]>([]);
  // const [socket, setSocket] =
  //   useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [selectedText, setSelectedText] = useState<string>("");

  const { documentId } = useParams();
  useSelectionPosition(setSelectedText, setDropdown);
  const doc = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // socket connection
  //   // const s = io(SOCKET_URL);
  //   // setSocket(s);

  //   return () => {
  //     s.disconnect();
  //   };
  // }, []);

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

    DOMEventHandlers.register(container, editorContent, editorOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const content = DOMEventHandlers.getContent();
      setEditorContent(content.data.main);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [editorContent]);

  // useEffect(() => {
  //   // if (!socket) return;
  //   // dispatch(setDocumentId({ documentId }));
  //   // socket.emit(SocketEvents.GET_DOC, documentId);
  //   // socket.once(SocketEvents.LOAD_DOC, (document) => {
  //   //   dispatch(setDocumentTitle({ title: document.title }));
  //   //   dispatch(
  //   //     setDocumentMargins({
  //   //       margins: document?.margins?.length
  //   //         ? document.margins
  //   //         : [100, 100, 120, 120],
  //   //     })
  //   //   );
  //     // if (document.data) {
  //       // console.log(document.data);
        
  //       // setEditorContent(document.data);
  //       // DOMEventHandlers.setContent({ main: document.data });
  //     // }
  //   });
  // }, [documentId, dispatch]);

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

  // useEffect(() => {
  //   if (!socket || !documentId) return;
  //   socket.emit(SocketEvents.SAVE_DOC, {
  //     id: documentId,
  //     data: editorContent,
  //     title: doc.title,
  //   });
  // }, [editorContent, documentId, doc.title, socket]);

  return (
    <div className="canvas-editor-main">
      <div className="canvas-editor editor" ref={ref}>
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
