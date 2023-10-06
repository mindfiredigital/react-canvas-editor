import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CreateDocument from "../../components/CreateDocument/CreateDocument";
import RecentDocsList from "../../components/RecentDocsList/RecentDocsList";
import EditorHeader from "../../components/EditorHeader/EditorHeader";
import { useDispatch } from "react-redux";
import { setDocumentTitle, setDocumentMargins } from "../../redux/documentReducer";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDocumentTitle({ title: "" }));
    dispatch(setDocumentMargins({ setDocumentMargins: [] }));
  }, [dispatch]);
  return (
    <>
      <EditorHeader />
      <Toolbar />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", backgroundColor: "#f1f3f4" }}>
          <Stack
            sx={{
              width: "80%",
              margin: "0 auto",
              padding: "0.5rem 0.5rem 1.5rem 0.5rem",
            }}
          >
            <Button
              sx={{ textTransform: "none" }}
              onClick={() => navigate("/templates")}
            >
              View Template Gallery
            </Button>

            <CreateDocument />
          </Stack>
        </Box>
        <RecentDocsList />
      </Box>
    </>
  );
}

export default Home;
