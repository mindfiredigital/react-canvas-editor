import React, { useState, useEffect } from 'react';

import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDebounce } from "../../hooks/useDebounce";
import { DocumentState, setDocumentMargins } from "../../redux/documentReducer";
import { useParams } from "react-router-dom";
import {
    DOMEventHandlers
} from "@mindfiredigital/canvas-editor";

const EditorMargin: React.FC = () => {
    const dispatch = useDispatch();
    const { documentId } = useParams();

    const document: any = useSelector(
        (state: RootState) => state.document
    ) as unknown as DocumentState;

    const marginState: any = useDebounce(document.margins, 500);

    const [open, setOpen] = useState<boolean>(false);
    const [margins, setMargins] = useState<Array<Number>>([]);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleMarginChange = (e: any, position: number) => {
        const { value } = e.target;
        let margin: any[] = [...margins];
        margin[position] = value ? parseInt(value) : "";
        setMargins(margin);
    }

    const updateMargins = () => {
        updateMarginsHandler();
    }

    const updateMarginsHandler = async () => {
        let margin: any[] = [...margins].map(ob => ob ? ob : 0);
    };

    useEffect(() => {
        if (marginState?.length) {
            setMargins(marginState);
        }
    }, [marginState])

    return (
        <React.Fragment>
            <ButtonWrapper title="Margin" handleClick={handleClickOpen}>
                <DocumentScannerOutlinedIcon sx={{ fontSize: 20 }}/>
            </ButtonWrapper>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xs"
            >
                <DialogTitle>
                    Margins
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid container item>
                                <Grid item xs={3}>
                                    Top :
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        type="number"
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]' }}
                                        size="small"
                                        variant="outlined"
                                        value={margins?.[0]}
                                        onChange={(e) => handleMarginChange(e, 0)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={1}>
                                <Grid item xs={3}>
                                    Bottom :
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        type="number"
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]' }}
                                        size="small"
                                        variant="outlined"
                                        value={margins?.[1]}
                                        onChange={(e) => handleMarginChange(e, 1)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={1}>
                                <Grid item xs={3}>
                                    Left :
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        type="number"
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]' }}
                                        size="small"
                                        variant="outlined"
                                        value={margins?.[2]}
                                        onChange={(e) => handleMarginChange(e, 2)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={1}>
                                <Grid item xs={3}>
                                    Right :
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        type="number"
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]' }}
                                        size="small"
                                        variant="outlined"
                                        value={margins?.[3]}
                                        onChange={(e) => handleMarginChange(e, 3)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button autoFocus onClick={updateMargins}>
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default EditorMargin;