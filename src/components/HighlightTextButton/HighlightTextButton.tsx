import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { Box } from "@mui/material";
import ColorPalettes from "../ColorPalettes/ColorPalettes";
import { Color } from "../../utils/constant";

const HighlightTextButton: React.FC<{ color: string | null | undefined }> = ({
  color,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "font-color-popover" : undefined;

  return (
    <Box>
      <Tooltip title="Highlight color">
        <IconButton
          aria-describedby={id}
          sx={{ mr: 1, borderRadius: 0 }}
          onClick={handleClick}
        >
          <ColorizeIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <ColorPalettes
        anchorEl={anchorEl}
        handleClose={handleClose}
        definedColor={color}
        feature={Color.HIGHLIGHT}
      />
    </Box>
  );
};

export default HighlightTextButton;
