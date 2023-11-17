import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Remove, Add } from "@mui/icons-material";
import {
  Box,
  TextField,
  Paper,
  ClickAwayListener,
  Tooltip,
} from "@mui/material";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";
import { fontSizes } from "../../utils/constant";
import { FontSizeDropdownProps } from "../../utils/interface";

const FontSizeDropdown: React.FC<FontSizeDropdownProps> = ({
  onChange,
  onClose,
}) => {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Paper
        sx={{
          position: "absolute",
          zIndex: 9999,
          margin: "0 37px",
        }}>
        {fontSizes.map((size, index) => (
          <MenuItem key={index} onClick={() => onChange(size)}>
            {size}
          </MenuItem>
        ))}
      </Paper>
    </ClickAwayListener>
  );
};

const MenuItem: React.FC<{ onClick: () => void; children: number }> = ({
  onClick,
  children,
}) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", padding: "8px" }}>
      {children}
    </div>
  );
};

const FontSizeButton: React.FC<{ size: number | undefined; style: any }> = ({
  size = 16,
  style,
}) => {
  const [fontSize, setFontSize] = useState<number>(size);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  useEffect(() => {
    setFontSize(size);
  }, [size]);
  const handleDecreaseFont = () => {
    if (fontSize > 1) {
      setFontSize((prevSize) => prevSize - 2);
      DOMEventHandlers.decreaseFontSize();
    }
  };

  const handleIncreaseFont = () => {
    if (fontSize < 72) {
      setFontSize((prevSize) => prevSize + 2);
      DOMEventHandlers.increaseFontSize();
    }
  };

  const handleTextFieldClick = () => {
    setDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    handleDropdownClose();
    DOMEventHandlers.setSize(Number(size));
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = Number(event.target.value);
    setFontSize(newFontSize);
    DOMEventHandlers.setSize(Number(newFontSize));
  };

  return (
    <Box sx={style}>
      <IconButton
        onClick={handleDecreaseFont}
        sx={[
          Object.assign({ mr: 1, borderRadius: 0 }, style),
          { padding: "1px", margin: "8px 0" },
        ]}>
        <Tooltip title='Decrease font size'>
          <Remove style={{ fontSize: "large" }} />
        </Tooltip>
      </IconButton>
      <Tooltip title='Font size'>
        <TextField
          type='text'
          value={fontSize}
          onClick={handleTextFieldClick}
          onChange={handleOnChange}
          style={{ width: "50px", margin: "7px 0", cursor: "pointer" }}
          inputProps={{
            style: { textAlign: "center", padding: "1px 1px", fontSize: 14 },
          }}
        />
      </Tooltip>
      {dropdownOpen && (
        <FontSizeDropdown
          onChange={handleFontSizeChange}
          onClose={handleDropdownClose}
        />
      )}
      <IconButton
        onClick={handleIncreaseFont}
        sx={[
          Object.assign({ mr: 1, borderRadius: 0 }, style),
          { padding: "1px", margin: "8px 0" },
        ]}>
        <Tooltip title='Increase font size'>
          <Add style={{ fontSize: "large" }} />
        </Tooltip>
      </IconButton>
    </Box>
  );
};

export default FontSizeButton;
