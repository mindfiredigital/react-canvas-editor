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
import { IRangeStyle } from "@mindfiredigital/canvas-editor/dist/canvas-editor.es";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ImageUploadButton from "../ImageUploadButton/ImageUploadButton";
import Divider from "@mui/material/Divider";

interface content {
  toolbar: any;
  toolbarClass: any;
}

const EditorToolbar = forwardRef<HTMLDivElement, content>(function Toolbar(
  _props,
  ref
) {
  const [contentStyles, setContentStyles] = useState<IRangeStyle | undefined>();
  const [alignment, setAlignment] = useState<string>(RowFlex.LEFT);
  const [listType, setListType] = useState<string>("");
  const [formats, setFormats] = useState<string[]>([]);

  const selectedItemStyle = {
    color:
      _props?.toolbarClass?.item?.selectedToolbarItemColor?.color !== undefined
        ? _props?.toolbarClass?.item?.selectedToolbarItemColor?.color
        : "#1a73e8",
  };

  const addFormat = (format) => {
    let selectedFormats;
    if (formats.indexOf(format) === -1) {
      selectedFormats = [...formats, format];
    } else {
      selectedFormats = formats.filter((item) => item !== format);
    }
    setFormats(selectedFormats);
  };

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
      <AppBar position='fixed' sx={_props?.toolbarClass?.container}>
        <Stack sx={_props?.toolbarClass?.primaryToolbar}>
          {(!_props?.toolbar || _props?.toolbar?.undo) && (
            <ButtonWrapper
              sx={_props?.toolbarClass?.item?.undo}
              title='Undo'
              handleClick={DOMEventHandlers.handleUndo}>
              <UndoIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.redo) && (
            <ButtonWrapper
              sx={_props?.toolbarClass?.item?.redo}
              title='Redo'
              handleClick={DOMEventHandlers.handleRedo}>
              <RedoIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.bold) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.bold,
                  formats.indexOf("Bold") > -1 && selectedItemStyle)
              }
              title='Bold'
              handleClick={() => {
                DOMEventHandlers.handleBold();
                addFormat("Bold");
              }}>
              <FormatBoldIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.italic) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.italic,
                  formats.indexOf("Italic") > -1 && selectedItemStyle)
              }
              title='Italic'
              handleClick={() => {
                DOMEventHandlers.handleItalic();
                addFormat("Italic");
              }}>
              <FormatItalicIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.underline) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.underline,
                  formats.indexOf("Underline") > -1 && selectedItemStyle)
              }
              title='Underline'
              handleClick={() => {
                DOMEventHandlers.handleUnderline();
                addFormat("Underline");
              }}>
              <FormatUnderlinedIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.subscript) && (
            <ButtonWrapper
              sx={_props?.toolbarClass?.item?.subscript}
              title='Subscript'
              handleClick={DOMEventHandlers.handleSubscript}>
              <SubscriptIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.superscript) && (
            <ButtonWrapper
              sx={_props?.toolbarClass?.item?.superscript}
              title='Superscript'
              handleClick={DOMEventHandlers.handleSuperscript}>
              <SuperscriptIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.strikethrough) && (
            <ButtonWrapper
              sx={_props?.toolbarClass?.item?.strikethrough}
              title='Strikethrough'
              handleClick={DOMEventHandlers.handleStrikeout}>
              <StrikethroughSIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.leftAlign) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.leftAlign,
                  alignment === RowFlex.LEFT && selectedItemStyle)
              }
              title='Left align'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.LEFT);
                setAlignment(RowFlex.LEFT);
              }}>
              <FormatAlignLeftIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.centerAlign) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.centerAlign,
                  alignment === RowFlex.CENTER && selectedItemStyle)
              }
              title='Center align'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.CENTER);
                setAlignment(RowFlex.CENTER);
              }}>
              <FormatAlignCenterIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.rightAlign) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.rightAlign,
                  alignment === RowFlex.RIGHT && selectedItemStyle)
              }
              title='Right align'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.RIGHT);
                setAlignment(RowFlex.RIGHT);
              }}>
              <FormatAlignRightIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.justify) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.justify,
                  alignment === RowFlex.ALIGNMENT && selectedItemStyle)
              }
              title='Justify'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.ALIGNMENT);
                setAlignment(RowFlex.ALIGNMENT);
              }}>
              <FormatAlignJustifyIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.bulletList) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.bulletList,
                  listType === ListType.UL && selectedItemStyle)
              }
              title='Bullet list'
              handleClick={() => {
                DOMEventHandlers.handleList(ListType.UL, ListStyle.DECIMAL);
                listType === ListType.UL
                  ? setListType("")
                  : setListType(ListType.UL);
              }}>
              <FormatListBulletedIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.numberedList) && (
            <ButtonWrapper
              sx={
                (_props?.toolbarClass?.item?.numberedList,
                  listType === ListType.OL && selectedItemStyle)
              }
              title='Numbered list'
              handleClick={() => {
                DOMEventHandlers.handleList(ListType.OL, ListStyle.DECIMAL);
                listType === ListType.OL
                  ? setListType("")
                  : setListType(ListType.OL);
              }}>
              <FormatListNumberedIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.fontType) && (
            <FontDropdown
              {...({ style: _props?.toolbarClass?.item?.fontType } as any)}
            />
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: 5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.table) && (
            <TableDropdown
              {...({ style: _props?.toolbarClass?.item?.table } as any)}
            />
          )}
          {(!_props?.toolbar || _props?.toolbar?.fontColor) && (
            <FontColorButton
              style={_props?.toolbarClass?.item?.fontColor}
              textColor={contentStyles?.color}
            />
          )}
          {(!_props?.toolbar || _props?.toolbar?.highlight) && (
            <HighlightTextButton
              style={_props?.toolbarClass?.item?.highlight}
              color={contentStyles?.highlight}
            />
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.fontSize) && (
            <FontSizeButton
              style={_props?.toolbarClass?.item?.fontSize}
              size={contentStyles?.size}
            />
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: 5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.heading) && (
            <HeadingButton
              {...({ style: _props?.toolbarClass?.item?.heading } as any)}
            />
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.hyperlink) && (
            <ButtonWrapper
              sx={_props?.toolbarClass?.item?.hyperlink}
              title='Hyperlink'
              handleClick={() => DOMEventHandlers.createHyperLink()}>
              <InsertLinkIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.image) && (
            <ImageUploadButton
              {...({ style: _props?.toolbarClass?.item?.image } as any)}
            />
          )}
        </Stack>
      </AppBar>
    </Box>
  );
});

export default EditorToolbar;
