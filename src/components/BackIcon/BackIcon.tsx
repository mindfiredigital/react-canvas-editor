import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function BackIcon({ color }: { color?: string }) {
  const navigate = useNavigate();
  return (
    <Tooltip title="go back">
      <IconButton
        size="medium"
        edge="start"
        color="inherit"
        aria-label="home"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon sx={{ color: color }} />
      </IconButton>
    </Tooltip>
  );
}

export default BackIcon;
