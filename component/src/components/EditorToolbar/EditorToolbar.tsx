import React, { forwardRef, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import {
  DOMEventHandlers,
  ListStyle,
  ListType,
  RowFlex,
  IRangeStyle,
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
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ImageUploadButton from "../ImageUploadButton/ImageUploadButton";
import DocxImportButton from "../DocxImportButton/DocxImportButton";
import LineSpacingButton from "../LineSpacingButton/LineSpacingButton";
import ParagraphSpacingButton from "../ParagraphSpacingButton/ParagraphSpacingButton";
import Divider from "@mui/material/Divider";

interface content {
  toolbar: any;
  toolbarClass: any;
  apiBaseUrl?: string;
  onClientDocxImport?: (file: File) => Promise<unknown[]>;
}

const EditorToolbar = forwardRef<HTMLDivElement, content>(function Toolbar(
  _props,
  ref
) {
  const [contentStyles, setContentStyles] = useState<IRangeStyle | undefined>();

  const alignment = contentStyles?.rowFlex ?? RowFlex.LEFT;
  const listType = contentStyles?.listType ?? "";
  const isBold = !!contentStyles?.bold;
  const isItalic = !!contentStyles?.italic;
  const isUnderline = !!contentStyles?.underline;
  const isStrikeout = !!contentStyles?.strikeout;
  const isSubscript = (contentStyles as any)?.type === "subscript";
  const isSuperscript = (contentStyles as any)?.type === "superscript";

  const selectedItemStyle = {
    color:
      _props?.toolbarClass?.item?.selectedToolbarItemColor?.color !== undefined
        ? _props?.toolbarClass?.item?.selectedToolbarItemColor?.color
        : "#1a73e8",
    backgroundColor: "#e8f0fe",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let unsubscribe: (() => void) | undefined;

    const tryAttachListener = () => {
      try {
        const instance: any = (DOMEventHandlers as any).getEditorInstance?.();
        if (instance?.listener) {
          const prev = instance.listener.rangeStyleChange;
          instance.listener.rangeStyleChange = (style: IRangeStyle) => {
            setContentStyles(style);
            if (typeof prev === "function") prev(style);
          };
          unsubscribe = () => {
            if (instance.listener) instance.listener.rangeStyleChange = prev;
          };
          return true;
        }
      } catch (e) {}
      return false;
    };

    const timeout = setTimeout(() => {
      const attached = tryAttachListener();
      // poll as fallback / initial fetch (lower freq if listener attached)
      const freq = attached ? 500 : 100;
      interval = setInterval(() => {
        const editorDom = document.querySelector('.canvas-editor');
        if (!editorDom) return;
        try {
          const data = DOMEventHandlers.getContentStyles();
          if (data) setContentStyles(data);
        } catch (e) {}
      }, freq);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AppBar position='sticky' className="ce-editor-toolbar" sx={{ top: 0, zIndex: 10, ..._props?.toolbarClass?.container }}>
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
                isBold
                  ? { ..._props?.toolbarClass?.item?.bold, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.bold
              }
              title='Bold'
              handleClick={() => {
                DOMEventHandlers.handleBold();
              }}>
              <FormatBoldIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.italic) && (
            <ButtonWrapper
              sx={
                isItalic
                  ? { ..._props?.toolbarClass?.item?.italic, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.italic
              }
              title='Italic'
              handleClick={() => {
                DOMEventHandlers.handleItalic();
              }}>
              <FormatItalicIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.underline) && (
            <ButtonWrapper
              sx={
                isUnderline
                  ? { ..._props?.toolbarClass?.item?.underline, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.underline
              }
              title='Underline'
              handleClick={() => {
                DOMEventHandlers.handleUnderline();
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
              sx={
                isSubscript
                  ? { ..._props?.toolbarClass?.item?.subscript, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.subscript
              }
              title='Subscript'
              handleClick={DOMEventHandlers.handleSubscript}>
              <SubscriptIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.superscript) && (
            <ButtonWrapper
              sx={
                isSuperscript
                  ? { ..._props?.toolbarClass?.item?.superscript, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.superscript
              }
              title='Superscript'
              handleClick={DOMEventHandlers.handleSuperscript}>
              <SuperscriptIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.strikethrough) && (
            <ButtonWrapper
              sx={
                isStrikeout
                  ? { ..._props?.toolbarClass?.item?.strikethrough, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.strikethrough
              }
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
                alignment === RowFlex.LEFT
                  ? { ..._props?.toolbarClass?.item?.leftAlign, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.leftAlign
              }
              title='Left align'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.LEFT);
              }}>
              <FormatAlignLeftIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.centerAlign) && (
            <ButtonWrapper
              sx={
                alignment === RowFlex.CENTER
                  ? { ..._props?.toolbarClass?.item?.centerAlign, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.centerAlign
              }
              title='Center align'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.CENTER);
              }}>
              <FormatAlignCenterIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.rightAlign) && (
            <ButtonWrapper
              sx={
                alignment === RowFlex.RIGHT
                  ? { ..._props?.toolbarClass?.item?.rightAlign, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.rightAlign
              }
              title='Right align'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.RIGHT);
              }}>
              <FormatAlignRightIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.justify) && (
            <ButtonWrapper
              sx={
                alignment === RowFlex.ALIGNMENT
                  ? { ..._props?.toolbarClass?.item?.justify, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.justify
              }
              title='Justify'
              handleClick={() => {
                DOMEventHandlers.handleAlign(RowFlex.ALIGNMENT);
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
                listType === ListType.UL
                  ? { ..._props?.toolbarClass?.item?.bulletList, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.bulletList
              }
              title='Bullet list'
              handleClick={() => {
                DOMEventHandlers.handleList(ListType.UL, ListStyle.DECIMAL);
              }}>
              <FormatListBulletedIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.numberedList) && (
            <ButtonWrapper
              sx={
                listType === ListType.OL
                  ? { ..._props?.toolbarClass?.item?.numberedList, ...selectedItemStyle }
                  : _props?.toolbarClass?.item?.numberedList
              }
              title='Numbered list'
              handleClick={() => {
                DOMEventHandlers.handleList(ListType.OL, ListStyle.DECIMAL);
              }}>
              <FormatListNumberedIcon style={{ fontSize: "large" }} />
            </ButtonWrapper>
          )}
          {(!_props?.toolbar || _props?.toolbar?.lineSpacing) && (
            <LineSpacingButton style={_props?.toolbarClass?.item?.lineSpacing} />
          )}
          {(!_props?.toolbar || _props?.toolbar?.paragraphSpacing) && (   
            <ParagraphSpacingButton style={_props?.toolbarClass?.item?.paragraphSpacing} />
          )}
          <Divider
            flexItem
            orientation='vertical'
            sx={{ mx: 0.5, my: 1 }}
            style={{ marginLeft: -5, marginRight: 5 }}
          />

          {(!_props?.toolbar || _props?.toolbar?.fontType) && (
            <FontDropdown
              {...({
                style: _props?.toolbarClass?.item?.fontType,
                font: contentStyles?.font,
              } as any)}
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
          {(!_props?.toolbar || _props?.toolbar?.docxImport) && (
            <>
              <Divider
                flexItem
                orientation='vertical'
                sx={{ mx: 0.5, my: 1 }}
                style={{ marginLeft: -5, marginRight: 5 }}
              />
              <DocxImportButton
                {...({ style: _props?.toolbarClass?.item?.docxImport } as any)}
                apiBaseUrl={_props.apiBaseUrl}
                onClientImport={_props.onClientDocxImport}
              />
            </>
          )}
        </Stack>
    </AppBar>
  );
});

export default EditorToolbar;
