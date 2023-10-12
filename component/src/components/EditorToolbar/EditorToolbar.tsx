import React, { forwardRef, useEffect, useState } from "react";

import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";
import { IRangeStyle } from "@mindfiredigital/canvas-editor/dist/src/editor/interface/Listener";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
import { Emphasis } from "../Emphasis/Emphasis";
import ImageUploadButton from "../ImageUploadButton/ImageUploadButton";

interface content {
  toolbar: any,
  toolbarClass: any
}
const EditorToolbar = forwardRef<HTMLDivElement,content>(function Toolbar(_props, ref) {
  const [contentStyles, setContentStyles] = useState<IRangeStyle | undefined>();
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        const data = DOMEventHandlers.getContentStyles();
        setContentStyles(data);
      }, 100);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const imageButtonStyle: any = {
    style: _props?.toolbarClass?.item?.image
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={_props?.toolbarClass?.container}
      >
        <Stack
          sx={_props?.toolbarClass?.primaryToolbar}
        >
          {_props?.toolbar?.undo && <ButtonWrapper sx={_props?.toolbarClass?.item?.undo} title="undo" handleClick={DOMEventHandlers.handleUndo}>
            <UndoIcon />
          </ButtonWrapper>}

          {_props?.toolbar?.redo && <ButtonWrapper sx={_props?.toolbarClass?.item?.redo} title="redo" handleClick={DOMEventHandlers.handleRedo}>
            <RedoIcon />
          </ButtonWrapper>}
          <Emphasis {..._props}></Emphasis>
          {_props?.toolbar?.image && <ImageUploadButton {...imageButtonStyle} />}
        </Stack>
      </AppBar>
    </Box>
  );
});

export default EditorToolbar;
