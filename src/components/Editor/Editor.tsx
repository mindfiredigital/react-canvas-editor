// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react';
// import { DefaultEventsMap } from '@socket.io/component-emitter';
// import Box from '@mui/material/Box';
// import JoditEditor, { Jodit } from 'jodit-react';
// import { useParams } from 'react-router-dom';
// import { Socket, io } from 'socket.io-client';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   MSGSEVERITY,
//   SOCKET_URL,
//   SocketEvents,
//   buttons,
// } from '../../utils/constant';
// import {
//   PDFExport,
//   exportToPdf,
//   saveAsTemplate,
//   saveDocument,
// } from '../../utils/custom-buttons';
// import useSelectionPosition from '../../hooks/useSelectionPosition';
// import { CustomSnackbarType, SelectionRect } from '../../utils/types';
// import { DocumentService } from '../../services/documentService';
// import { DocumentState, setDocumentTitle } from '../../redux/documentReducer';
// import type { RootState } from '../../redux/store';
// import { useHideElement } from '../../hooks/useHideElement';
// import { useDebounce } from '../../hooks/useDebounce';
// import FloatingBox from '../FloatingBox/FloatingBox';
// import CustomizedSnackbar from '../Snackbar/Snackbar';
// import './Editor.scss';
// import { useCreateVersion } from '../../hooks/useCreateVersion';
// import { useScreenshot } from 'use-react-screenshot';

// function Editor() {
//   const [data, setData] = useState<string>('');
//   const editorRef = useRef<Jodit>(null);
//   const ref = useRef(null);
//   const [selectedText, setSelectedText] = useState<string>('');
//   const [dropdown, setDropdown] = useState<SelectionRect>({
//     left: 0,
//     top: 0,
//     visiblity: false,
//   });
//   const [socket, setSocket] =
//     useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
//   const [openSnackbar, setOpenSnackbar] = useState<CustomSnackbarType>({
//     visibility: false,
//   });
//   const doc = useSelector(
//     (state: RootState) => state.document
//   ) as DocumentState;
//   const [image, takeScreenShot] = useScreenshot();
//   const [templateId, setTemplateId] = useState<string | null>(null);

//   useSelectionPosition(setSelectedText, setDropdown);
//   useHideElement(['jodit-status-bar-link']);

//   useCreateVersion();

//   const dispatch = useDispatch();

//   const { documentId } = useParams();
//   const debouncedContent = useDebounce(data, 500);

//   useEffect(() => {
//     // socket connection
//     const s = io(SOCKET_URL);
//     setSocket(s);

//     return () => {
//       s.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket) return;
//     socket.emit(SocketEvents.GET_DOC, documentId);
//     socket.once(SocketEvents.LOAD_DOC, (document) => {
//       dispatch(setDocumentTitle({ title: document.title }));
//       if (document.data) {
//         setData(document.data);
//       }
//     });
//   }, [socket, documentId, dispatch]);

//   // Multi User
//   // useEffect(() => {
//   //   if (!socket || !data) return;
//   //   // send
//   //   socket.emit(SocketEvents.SEND_CHANGES, data);
//   //   // receive
//   //   const handler = (data: string) => {
//   //     setData(data);
//   //   };
//   //   socket.on(SocketEvents.RECEIVE_CHANGES, handler);

//   //   return () => {
//   //     socket.off(SocketEvents.RECEIVE_CHANGES, handler);
//   //   };
//   // }, [socket, data]);

//   const saveContent = async () => {
//     const content = editorRef?.current?.value;
//     if (!socket || !content || !documentId) return;
//     socket.emit(SocketEvents.SAVE_DOC, {
//       id: documentId,
//       data: content,
//       title: doc.title,
//     });
//     try {
//       //create a new version each time user manually saves a document
//       await DocumentService.createVersion(documentId);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     const content = editorRef?.current?.value;
//     if (!socket || !content || !documentId || !debouncedContent) return;
//     socket.emit(SocketEvents.SAVE_DOC, {
//       id: documentId,
//       data: content,
//     });
//   }, [debouncedContent, documentId, socket]);

//   const generatePDFExportData = function () {
//     const editorData = editorRef?.current?.value;
//     if (editorData) exportToPdf(editorData);
//   };

//   const pdfButton = {
//     ...PDFExport,
//     exec: generatePDFExportData,
//   };

//   const saveBtn = {
//     ...saveDocument,
//     exec: saveContent,
//   };

//   useEffect(() => {
//     //save image
//     const formData = new FormData();
//     const uploadimage = async () => {
//       if (image) formData.append('image', image);
//       try {
//         if (templateId) await DocumentService.uploadImage(templateId, formData);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     if (templateId && image) uploadimage();
//   }, [image, templateId]);

//   const saveTemplate = async () => {
//     takeScreenShot(ref.current);
//     const content = editorRef?.current?.value;
//     try {
//       if (content) {
//         const response = await DocumentService.saveAsTemplate({
//           userId: 'user1',
//           title: doc.title,
//           data: content,
//         });
//         if (response.data.success) {
//           setTemplateId(response.data.data);
//           setOpenSnackbar({
//             visibility: true,
//             message: 'Template saved successfully',
//             severity: MSGSEVERITY.SUCCESS,
//           });
//         }
//       }
//     } catch (err) {
//       console.log(err);
//       setOpenSnackbar({
//         visibility: true,
//         message: 'Failed to save Template',
//         severity: MSGSEVERITY.ERROR,
//       });
//     }
//   };

//   const saveTemplateBtn = { ...saveAsTemplate, exec: saveTemplate };

//   const editorConfig = useMemo(
//     () => ({
//       readonly: false,
//       toolbarAdaptive: false,
//       showCharsCounter: true,
//       showWordsCounter: true,
//       showXPathInStatusbar: false,
//       askBeforePasteHTML: false,
//       askBeforePasteFromWord: false,
//       buttons: [...buttons, pdfButton, '|', saveBtn, saveTemplateBtn],
//       spellcheck: true,
//       uploader: {
//         insertImageAsBase64URI: true,
//       },
//       height: 1056,
//       width: 816,
//     }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [doc.title]
//   );

//   return (
//     <>
//       <Box className="editor__wrapper" ref={ref}>
//         <Box className="editor">
//           <GrammarlyEditorPlugin clientId="client_FfXqztwTnwhYFdprsGebRF">
//             <JoditEditor
//               ref={editorRef}
//               value={data}
//               config={editorConfig}
//               onChange={(value) => {
//                 setData(value);
//               }}
//             />
//           </GrammarlyEditorPlugin>
//           {dropdown.visiblity && (
//             <FloatingBox
//               left={dropdown.left}
//               top={dropdown.top}
//               selectedText={selectedText}
//             />
//           )}
//         </Box>
//       </Box>
//       <CustomizedSnackbar
//         openSnackbar={openSnackbar}
//         setOpenSnackbar={setOpenSnackbar}
//       />
//     </>
//   );
// }

// export default Editor;
