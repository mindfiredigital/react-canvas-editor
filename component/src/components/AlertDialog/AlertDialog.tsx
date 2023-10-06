import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { AlertDialogType } from '../../utils/types';

export default function AlertDialog({ toggle, onClose, onClick, message }: AlertDialogType) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog
        open={toggle}
        onClose={() => onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => onClose()}>No</Button>
          <Button onClick={() => onClick()} autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
