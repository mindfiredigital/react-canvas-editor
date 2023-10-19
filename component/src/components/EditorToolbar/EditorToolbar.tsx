import React, { forwardRef, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import {
  DOMEventHandlers,
  ListStyle,
  ListType,
  RowFlex,
} from "@mindfiredigital/canvas-editor";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import { Stack } from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FontDropdown from "../Dropdown/FontDropdown";
import TableDropdown from "../Table/TableDropdown";
import FontColorButton from "../FontColorButton/FontColorButton";
import HighlightTextButton from "../HighlightTextButton/HighlightTextButton";
import FontSizeButton from "../FontSizeButton/FontSizeButton";
import HeadingButton from "../HeadingButton/HeadingButton";
import { IRangeStyle } from "@mindfiredigital/canvas-editor/dist/src/editor/interface/Listener";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
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
          <ButtonWrapper title="bold" handleClick={DOMEventHandlers.handleBold}>
            <FormatBoldIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="italic"
            handleClick={DOMEventHandlers.handleItalic}
          >
            <FormatItalicIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="underline"
            handleClick={DOMEventHandlers.handleUnderline}
          >
            <FormatUnderlinedIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="subscript"
            handleClick={DOMEventHandlers.handleSubscript}
          >
            <SubscriptIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="superscript"
            handleClick={DOMEventHandlers.handleSuperscript}
          >
            <SuperscriptIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="strikethrough"
            handleClick={DOMEventHandlers.handleStrikeout}
          >
            <StrikethroughSIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="left align"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.LEFT)}
          >
            <FormatAlignLeftIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="center align"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.CENTER)}
          >
            <FormatAlignCenterIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="right align"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.RIGHT)}
          >
            <FormatAlignRightIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="justify"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.ALIGNMENT)}
          >
            <FormatAlignJustifyIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="bullet list"
            handleClick={() =>
              DOMEventHandlers.handleList(ListType.UL, ListStyle.DECIMAL)
            }
          >
            <FormatListBulletedIcon />
          </ButtonWrapper>
          <ButtonWrapper
            title="numbered list"
            handleClick={() =>
              DOMEventHandlers.handleList(ListType.OL, ListStyle.DECIMAL)
            }
          >
            <FormatListNumberedIcon />
          </ButtonWrapper>
          <FontDropdown />
          <TableDropdown />
          <FontColorButton textColor={contentStyles?.color} />
          <HighlightTextButton color={contentStyles?.highlight} />
          <FontSizeButton size={contentStyles?.size} />
          <HeadingButton />
          <ButtonWrapper
            title="hyperlink"
            handleClick={() => DOMEventHandlers.createHyperLink()}
          >
            <InsertLinkIcon />
          </ButtonWrapper>
          <ImageUploadButton />
        </Stack>
      </AppBar>
    </Box>
  );
});

export default EditorToolbar;
