import React, { forwardRef, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import {
  DOMEventHandlers,
  ListStyle,
  ListType,
  RowFlex,
} from "@harshita/canvas-editor";
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
import ExportToPdf from "../ExportToPdf/ExportToPdf";
import FontColorButton from "../FontColorButton/FontColorButton";
import HighlightTextButton from "../HighlightTextButton/HighlightTextButton";
import FontSizeButton from "../FontSizeButton/FontSizeButton";
import HeadingButton from "../HeadingButton/HeadingButton";
import { IRangeStyle } from "@harshita/canvas-editor/dist/src/editor/interface/Listener";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ImageUploadButton from "../ImageUploadButton/ImageUploadButton";
import Separator from "../Separator/Separator";
import SaveAsTemplateButton from "../SaveAsTemplateButton/SaveAsTemplateButton";
import { AnyMap } from "immer/dist/internal";

const EditorToolbar = forwardRef<HTMLDivElement>(function Toolbar(_props:any, ref) {
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          top: 65,
          backgroundColor: "#edf2fa",
          border: "none",
          minHeight: "40px",
          boxShadow: "none",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            minHeight: "40px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ButtonWrapper title="undo" handleClick={DOMEventHandlers.handleUndo}>
            <UndoIcon />
          </ButtonWrapper>
          <ButtonWrapper title="redo" handleClick={DOMEventHandlers.handleRedo}>
            <RedoIcon />
          </ButtonWrapper>
          <ButtonWrapper title="bold" handleClick={() => {
            DOMEventHandlers.handleBold()
            // DOMEventHandlers.handleBold()
            }}>
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
          {/*<ButtonWrapper
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
          <ExportToPdf />
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
          <Separator /> */}
          <SaveAsTemplateButton ref={ref}/>
        </Stack>
      </AppBar>
    </Box>
  );
});

export default EditorToolbar;
