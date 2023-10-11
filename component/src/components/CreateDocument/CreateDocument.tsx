import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

function CreateDocument() {
  const navigate = useNavigate();
  const handleClick = async () => {
  };

  return (
    <Box>
      <Paper
        sx={{
          width: "10rem",
          height: "12rem",
          margin: "0.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <AddIcon fontSize="large" color="primary" />
      </Paper>
      <Typography
        sx={{
          fontWeight: "500",
          color: "#202124",
          fontSize: "0.9rem",
          paddingLeft: "0.5rem",
        }}
      >
        Blank
      </Typography>
    </Box>
  );
}

export default CreateDocument;
