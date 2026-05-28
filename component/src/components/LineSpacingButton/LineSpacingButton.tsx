import React, { useRef, useState } from "react";
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";

const PRESETS = [1, 1.15, 1.5, 2, 2.5, 3];
const DEFAULT_SPACING = 1.15;

interface LineSpacingButtonProps {
  style?: any;
  lineSpacing?: number;
}

const LineSpacingButton: React.FC<LineSpacingButtonProps> = ({
  style,
  lineSpacing = DEFAULT_SPACING,
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(lineSpacing);
  const [customValue, setCustomValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const apply = (value: number) => {
    if (isNaN(value) || value < 0.5 || value > 10) return;
    const instance: any = (DOMEventHandlers as any).getEditorInstance?.();
    instance?.command?.executeRowMargin?.(value);
    setActive(value);
    setOpen(false);
  };

  return (
    <Box sx={{ position: "relative", ...style }}>
      <Tooltip title="Line spacing">
        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((prev) => !prev)}
          sx={{ borderRadius: 0, padding: "6px" }}>
          <FormatLineSpacingIcon style={{ fontSize: "large" }} />
        </IconButton>
      </Tooltip>
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 9999,
              minWidth: 120,
            }}>
            {PRESETS.map((preset) => (
              <Box
                key={preset}
                onClick={() => apply(preset)}
                sx={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: active === preset ? 700 : 400,
                  backgroundColor:
                    active === preset ? "#e8f0fe" : "transparent",
                  "&:hover": { backgroundColor: "#f1f3f4" },
                }}>
                {preset}
              </Box>
            ))}
            <Divider />
            <Box sx={{ display: "flex", alignItems: "center", padding: "6px 8px", gap: 1 }}>
              <TextField
                inputRef={inputRef}
                size="small"
                type="number"
                placeholder="Custom"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                inputProps={{ min: 0.5, max: 10, step: 0.01, style: { padding: "4px 6px", width: 60 } }}
              />
              <Box
                onClick={() => {
                  const val = parseFloat(customValue);
                  apply(val);
                }}
                sx={{
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: 12,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#f1f3f4" },
                }}>
                Apply
              </Box>
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default LineSpacingButton;
