import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { Box } from "@mui/material";
import ColorPalettes from "../ColorPalettes/ColorPalettes";
import { Color } from "../../utils/constant";

const HighlightTextButton: React.FC<{
  color: string | null | undefined;
  style: any;
}> = ({ color, style }) => {
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
      <Tooltip title='Highlight color'>
        <IconButton
          size='small'
          aria-describedby={id}
          sx={Object.assign({ mr: 1, borderRadius: 0 }, style)}
          onClick={handleClick}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <ColorizeIcon style={{ fontSize: "large" }} />
            <Box
              sx={{
                width: "1rem",
                height: "3px",
                marginTop: "1px",
                backgroundColor: color || "transparent",
              }}
            />
          </Box>
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
