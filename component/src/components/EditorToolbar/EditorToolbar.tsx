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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={_props?.toolbarClass?.container}
      >
        <Stack
          sx={_props?.toolbarClass?.primaryToolbar}
        >
          {(!_props?.toolbar || _props?.toolbar?.undo) && <ButtonWrapper sx={_props?.toolbarClass?.item?.undo} title="undo" handleClick={DOMEventHandlers.handleUndo}>
            <UndoIcon />
          </ButtonWrapper>}

          {(!_props?.toolbar || _props?.toolbar?.redo) && <ButtonWrapper sx={_props?.toolbarClass?.item?.redo} title="redo" handleClick={DOMEventHandlers.handleRedo}>
            <RedoIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.bold) && <ButtonWrapper sx={_props?.toolbarClass?.item?.bold} title="bold" handleClick={DOMEventHandlers.handleBold}>
            <FormatBoldIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.italic) && <ButtonWrapper
           sx={_props?.toolbarClass?.item?.italic} 
            title="italic"
            handleClick={DOMEventHandlers.handleItalic}
          >
            <FormatItalicIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.underline) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.underline} 
            title="underline"
            handleClick={DOMEventHandlers.handleUnderline}
          >
            <FormatUnderlinedIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.subscript) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.subscript} 
            title="subscript"
            handleClick={DOMEventHandlers.handleSubscript}
          >
            <SubscriptIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.superscript) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.superscript} 
            title="superscript"
            handleClick={DOMEventHandlers.handleSuperscript}
          >
            <SuperscriptIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.strikethrough) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.strikethrough} 
            title="strikethrough"
            handleClick={DOMEventHandlers.handleStrikeout}
          >
            <StrikethroughSIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.leftAlign) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.leftAlign} 
            title="left align"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.LEFT)}
          >
            <FormatAlignLeftIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.centerAlign) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.centerAlign} 
            title="center align"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.CENTER)}
          >
            <FormatAlignCenterIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.rightAlign) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.rightAlign} 
            title="right align"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.RIGHT)}
          >
            <FormatAlignRightIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.justify) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.justify} 
            title="justify"
            handleClick={() => DOMEventHandlers.handleAlign(RowFlex.ALIGNMENT)}
          >
            <FormatAlignJustifyIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.bulletList) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.bulletList} 
            title="bullet list"
            handleClick={() =>
              DOMEventHandlers.handleList(ListType.UL, ListStyle.DECIMAL)
            }
          >
            <FormatListBulletedIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.numberedList) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.numberedList} 
            title="numbered list"
            handleClick={() =>
              DOMEventHandlers.handleList(ListType.OL, ListStyle.DECIMAL)
            }
          >
            <FormatListNumberedIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.fontType) && <FontDropdown {...({style: _props?.toolbarClass?.item?.fontType} as any)} />}
          {(!_props?.toolbar || _props?.toolbar?.table) && <TableDropdown {...({style: _props?.toolbarClass?.item?.table} as any)} />}
          {(!_props?.toolbar || _props?.toolbar?.fontColor) && <FontColorButton style={_props?.toolbarClass?.item?.fontColor} textColor={contentStyles?.color} />}
          {(!_props?.toolbar || _props?.toolbar?.highlight) && <HighlightTextButton style={_props?.toolbarClass?.item?.highlight} color={contentStyles?.highlight} />}
          {(!_props?.toolbar || _props?.toolbar?.fontSize) && <FontSizeButton style={_props?.toolbarClass?.item?.fontSize} size={contentStyles?.size} />}
          {(!_props?.toolbar || _props?.toolbar?.heading) && <HeadingButton {...({style: _props?.toolbarClass?.item?.heading} as any)} />}
          {(!_props?.toolbar || _props?.toolbar?.hyperlink) && <ButtonWrapper
            sx={_props?.toolbarClass?.item?.hyperlink} 
            title="hyperlink"
            handleClick={() => DOMEventHandlers.createHyperLink()}
          >
            <InsertLinkIcon />
          </ButtonWrapper>}
          {(!_props?.toolbar || _props?.toolbar?.image) && <ImageUploadButton {...({style: _props?.toolbarClass?.item?.image} as any)} />}
        </Stack>
      </AppBar>
    </Box>
  );
});

export default EditorToolbar;
