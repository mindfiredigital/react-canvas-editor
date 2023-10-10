import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Tooltip from "@mui/material/Tooltip";
import { Input } from "@mui/material";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { DocumentState, setDocumentTitle } from "../../redux/documentReducer";
// import { DocumentService } from "../../services/documentService";
import { useDebounce } from "../../hooks/useDebounce";
import "./EditorHeader.scss";

export default function EditorHeader() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { documentId } = useParams();
  const document = useSelector(
    (state: RootState) => state.document
  ) as unknown as DocumentState;

  const title = useDebounce(document.title, 500);

  useEffect(() => {
    const updateTitle = async () => {
      // try {
      //   if (documentId && title) {
      //     console.log('editor header ln 33', documentId, title);
          
      //     await DocumentService.updateTitle({
      //       documentId,
      //       title,
      //     });
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
    };
    if (title) updateTitle();
  }, [title, documentId]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   dispatch(setDocumentTitle({ title: e.target.value }));
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ top: 0 }}>
          <Typography
              variant="body2"
              component="div"
              sx={{ flexGrow: 1, marginTop: "0.32rem" }}
            >
            </Typography>
      </AppBar>
    </Box>
  );
}
