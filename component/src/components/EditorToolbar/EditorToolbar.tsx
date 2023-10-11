import React, { forwardRef, useEffect, useState } from "react";

import { DOMEventHandlers } from "@mindfire/canvas-editor";
import { IRangeStyle } from "@mindfire/canvas-editor/dist/src/editor/interface/Listener";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
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
          {_props?.toolbar?.bold && <ButtonWrapper sx={_props?.toolbarClass?.item?.bold} title="bold" handleClick={DOMEventHandlers.handleBold}>
            <FormatBoldIcon />
          </ButtonWrapper>}
          {_props?.toolbar?.italic && <ButtonWrapper sx={_props?.toolbarClass?.item?.italic} title="italic" handleClick={DOMEventHandlers.handleItalic}>
            <FormatItalicIcon />
          </ButtonWrapper>}
          {_props?.toolbar?.underline && <ButtonWrapper sx={_props?.toolbarClass?.item?.underline} title="underline" handleClick={DOMEventHandlers.handleUnderline} >
            <FormatUnderlinedIcon />
           </ButtonWrapper>}
          {_props?.toolbar?.image && <ImageUploadButton {...imageButtonStyle} />}
        </Stack>
      </AppBar>
    </Box>
  );
});

export default EditorToolbar;
