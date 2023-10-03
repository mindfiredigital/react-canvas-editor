import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormDialogType } from "../../utils/types";

export default function FormDialog({
  toggle,
  title,
  content,
  onClose,
  onClick,
}: FormDialogType) {
  const [docTitle, setDocTitle] = React.useState<string>("");

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={toggle} onClose={() => onClose()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            type="text"
            fullWidth
            variant="standard"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose(), setDocTitle("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClick(docTitle), setDocTitle("");
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
