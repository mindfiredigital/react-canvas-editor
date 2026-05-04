import React, { useState, useEffect } from "react";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";

interface ParagraphSpacingButtonProps {
  style?: any;
  marginTop?: number;
  marginBottom?: number;
}

const ParagraphSpacingButton: React.FC<ParagraphSpacingButtonProps> = ({
  style,
  marginTop = 0,
  marginBottom = 0,
}) => {
  const [open, setOpen] = useState(false);
  const [before, setBefore] = useState<string>(String(marginTop));
  const [after, setAfter] = useState<string>(String(marginBottom));

  // Sync displayed values from selection when popover is closed
  useEffect(() => {
    if (!open) {
      setBefore(String(marginTop));
      setAfter(String(marginBottom));
    }
  }, [marginTop, marginBottom, open]);

  const apply = () => {
    const b = parseFloat(before) || 0;
    const a = parseFloat(after) || 0;
    if (b < 0 || a < 0) return;
    const instance: any = (DOMEventHandlers as any).getEditorInstance?.();
    // pt → px (1pt = 4/3 px @ 96dpi)
    const ptToPx = (pt: number) => (pt * 4) / 3;
    instance?.command?.executeParagraphSpacing?.({
      before: ptToPx(b),
      after: ptToPx(a),
    });
    setOpen(false);
  };

  return (
    <Box sx={{ position: "relative", ...style }}>
      <Tooltip title="Paragraph spacing">
        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((prev) => !prev)}
          sx={{ borderRadius: 0, padding: "6px" }}>
          <FormatIndentIncreaseIcon style={{ fontSize: "large" }} />
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
              minWidth: 180,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ fontSize: 12, width: 70 }}>Before (pt)</Box>
              <TextField
                size="small"
                type="number"
                value={before}
                onChange={(e) => setBefore(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                inputProps={{ min: 0, step: 1, style: { padding: "4px 6px", width: 60 } }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ fontSize: 12, width: 70 }}>After (pt)</Box>
              <TextField
                size="small"
                type="number"
                value={after}
                onChange={(e) => setAfter(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                inputProps={{ min: 0, step: 1, style: { padding: "4px 6px", width: 60 } }}
              />
            </Box>
            <Box
              onClick={apply}
              sx={{
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 12,
                border: "1px solid #ccc",
                borderRadius: 1,
                textAlign: "center",
                "&:hover": { backgroundColor: "#f1f3f4" },
              }}>
              Apply
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default ParagraphSpacingButton;
