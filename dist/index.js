function ___$insertStylesToHeader(css) {
  if (!css) {
    return
  }
  if (typeof window === 'undefined') {
    return
  }

  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css
}

import React, { useCallback, useEffect, useState, forwardRef, useRef } from 'react';
import { DOMEventHandlers, EditorMode, PageMode, RowFlex, ListType, ListStyle } from '@mindfiredigital/canvas-editor';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { styled } from '@mui/material/styles';
import Slider, { SliderThumb } from '@mui/material/Slider';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import { Box as Box$1, Popover, Grid, Typography as Typography$1, IconButton as IconButton$1, Tooltip as Tooltip$1, TextField, ClickAwayListener, Paper, Input, Stack as Stack$1 } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MenuItem$1 from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import CloseIcon from '@mui/icons-material/Close';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { PhotoshopPicker } from 'react-color';
import CheckIcon from '@mui/icons-material/Check';
import ColorizeIcon from '@mui/icons-material/Colorize';
import { Remove, Add } from '@mui/icons-material';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Toolbar from '@mui/material/Toolbar';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField$1 from '@mui/material/TextField';
import Grid$1 from '@mui/material/Grid';

___$insertStylesToHeader(".editor > div {\n  margin: auto;\n}\n\n.canvas-editor {\n  position: relative;\n  border-left: 1px solid rgba(0, 0, 0, 0.3);\n  border-top: 1px solid rgba(0, 0, 0, 0.3);\n  padding-top: 10px;\n}\n\n.canvas-editor-main {\n  padding: 70px 30px 80px;\n  margin: auto;\n}");

const useSelectionPosition = (setSelectedText, setElementRects) => {
    const handleSelection = useCallback(() => {
        const text = DOMEventHandlers.getSelectedText();
        const selectedText = text?.toString().trim();
        if (selectedText) {
            setSelectedText(selectedText);
            setElementRects((prevState) => ({ ...prevState, visiblity: true }));
        }
        else {
            setElementRects((prevState) => ({ ...prevState, visiblity: false }));
        }
    }, [setElementRects, setSelectedText]);
    useEffect(() => {
        document.addEventListener("mouseup", handleSelection);
        return () => {
            document.removeEventListener("mouseup", handleSelection);
        };
    }, [handleSelection]);
};

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debouncedValue;
};

const initialState = {
    documentId: "",
    title: "",
    reloadRecentDoc: false,
    margins: []
};
const docSlice = createSlice({
    name: "document",
    initialState,
    reducers: {
        setDocumentTitle: (state, action) => {
            state.title = action.payload.title;
        },
        reloadRecentDoc: (state, action) => {
            state.reloadRecentDoc = action.payload.reloadRecentDoc;
        },
        setDocumentMargins: (state, action) => {
            state.margins = action.payload.margins;
        },
        setDocumentId: (state, action) => {
            state.documentId = action.payload.documentId;
        },
    },
});
const { setDocumentTitle, reloadRecentDoc, setDocumentId, setDocumentMargins } = docSlice.actions;
var documentReducer = docSlice.reducer;

const CustomSliderVertical = styled(Slider)(() => ({
    width: 1,
    padding: '0',
    color: "#0000004d",
    borderRadius: 0,
    border: "none",
    '& .MuiSlider-rail': {
        opacity: 1,
        backgroundColor: "#0000004d",
        left: "-2px",
        transform: 'translateX(0%)'
    },
    '& .MuiSlider-track': {
        width: 1,
        left: -2,
        border: "none",
        backgroundColor: "white"
    },
    '& .MuiSlider-mark': {
        backgroundColor: "#0000004d",
        height: 1,
        width: 11,
        left: -8
    },
    '& .MuiSlider-markLabel': {
        fontSize: 12,
        fontWeight: 'normal',
        left: -22,
    },
    '& .MuiSlider-thumb': {
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: "none"
        },
    },
}));
const CustomSliderHorizontal = styled(Slider)(() => ({
    height: 1,
    padding: '0',
    color: "#0000004d",
    borderRadius: 0,
    border: "none",
    top: 0,
    '& .MuiSlider-rail': {
        opacity: 1,
        backgroundColor: "#0000004d",
        transform: 'translateY(0%)'
    },
    '& .MuiSlider-track': {
        height: 1,
        border: "none",
        backgroundColor: "white"
    },
    '& .MuiSlider-mark': {
        backgroundColor: "#0000004d",
        height: 11,
        width: 1,
        top: -4
    },
    '& .MuiSlider-markLabel': {
        fontSize: 12,
        fontWeight: 'normal',
        top: -27,
    },
    '& .MuiSlider-thumb': {
        backgroundColor: 'transparent',
        top: 3,
        '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: "none"
        },
    },
}));
const verticalMarks = new Array(12).fill(0).map((ob, i) => ({ value: -i * 96, label: i }));
const horizontalMarks = new Array(9).fill(0).map((ob, i) => ({ value: i * 96, label: i }));
function MarginRightArrow(props) {
    const { children, ...other } = props;
    return (React.createElement(SliderThumb, { ...other },
        children,
        React.createElement(ArrowRightIcon, { color: "primary", fontSize: "large" })));
}
function MarginDownArrow(props) {
    const { children, ...other } = props;
    return (React.createElement(SliderThumb, { ...other },
        children,
        React.createElement(ArrowDropDownTwoToneIcon, { color: "primary", fontSize: "large" })));
}

function MarginRuler({ documentId }) {
    const dispatch = useDispatch();
    const document = useSelector((state) => state.document);
    const [verticalSlider, setVerticalSlider] = useState([]);
    const [horizontalSlider, setHorizontalSlider] = useState([]);
    const margins = useDebounce(document.margins, 500);
    const handleChange = (e, value) => {
        let [bottom, top] = value;
        setVerticalSlider(value);
        let margin = [...margins];
        margin[0] = Math.abs(top);
        margin[1] = 1056 - Math.abs(bottom);
        DOMEventHandlers.setPaperMargins(margin);
        dispatch(setDocumentMargins({ margins: margin }));
    };
    const handleChangeHorizontal = (e, value) => {
        let [left, right] = value;
        setHorizontalSlider(value);
        let margin = [...margins];
        margin[2] = left;
        margin[3] = 816 - right;
        DOMEventHandlers.setPaperMargins(margin);
        dispatch(setDocumentMargins({ margins: margin }));
    };
    useEffect(() => {
        if (margins?.length && documentId) {
            setVerticalSlider([Math.abs(1056 - margins[1]) * -1, margins[0] * -1]);
            setHorizontalSlider([margins[2], 816 - margins[3]]);
            if (!verticalSlider.length && !horizontalSlider.length) {
                DOMEventHandlers.setPaperMargins(margins);
            }
        }
    }, [margins, documentId]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Stack, { sx: { height: "1056px", position: "absolute", left: "0px" }, direction: "row" },
            React.createElement(CustomSliderVertical, { orientation: "vertical", value: verticalSlider.length ? verticalSlider : [-956, -100], min: -1056, max: 0, marks: verticalMarks, onChange: event => handleChange, step: 24, track: "inverted", scale: x => -1056, size: "small", slots: { thumb: MarginRightArrow }, valueLabelDisplay: "off" })),
        React.createElement(Stack, { sx: { height: "1px", position: "absolute", top: "-1px", width: "816px", left: "calc((100% - 811px) / 2)" }, direction: "row" },
            React.createElement(CustomSliderHorizontal, { orientation: "horizontal", value: horizontalSlider.length ? horizontalSlider : [120, 696], min: 0, max: 816, marks: horizontalMarks, onChange: (event) => handleChangeHorizontal, step: 24, size: "small", scale: x => 816, slots: { thumb: MarginDownArrow }, valueLabelDisplay: "off" }))));
}

const CanvasEditor = forwardRef(function Editor(_props, ref) {
    const [dropdown, setDropdown] = useState({
        left: 1180,
        top: 250,
        visiblity: false,
    });
    const [editorContent, setEditorContent] = useState([]);
    const [selectedText, setSelectedText] = useState("");
    const { documentId } = useParams();
    useSelectionPosition(setSelectedText, setDropdown);
    const dispatch = useDispatch();
    useEffect(() => {
        const container = document.querySelector(".canvas-editor");
        if (container.querySelector('[editor-component="main"]')) {
            return;
        }
        const editorOptions = {
            height: 1056,
            width: 816,
            mode: EditorMode.EDIT,
            pageMode: PageMode.PAGING,
            pageNumber: {
                format: "{pageNo}/{pageCount}",
            },
            minSize: 1,
            maxSize: 72,
        };
        container.addEventListener('mouseup', (e) => {
            _props.onSelect && _props?.onSelect(DOMEventHandlers.getSelectedText());
        });
        container.addEventListener('keydown', (e) => {
            const text = DOMEventHandlers.getContent()?.data?.main;
            setEditorContent(text);
            _props?.onChange && _props?.onChange(text[0].value);
        });
        DOMEventHandlers.register(container, editorContent, editorOptions);
    }, []);
    useEffect(() => {
        if (_props?.data) {
            setEditorContent(_props?.data);
            DOMEventHandlers.setContent({ main: [{ value: _props?.data }] });
        }
    }, [documentId, dispatch, _props?.data]);
    return (React.createElement("div", { className: "canvas-editor-main", style: _props?.style?.editorMain },
        React.createElement("div", { className: "canvas-editor editor", ref: ref, style: _props?.style?.margin },
            React.createElement(MarginRuler, { documentId: documentId }))));
});

function ButtonWrapper(props) {
    return (React.createElement(Tooltip, { title: props.title },
        React.createElement(IconButton, { size: "small", edge: "start", "aria-label": props.title, sx: { mr: 1, borderRadius: 0, ...props.sx }, onClick: props.handleClick }, props.children)));
}

var AI_PROMPTS;
(function (AI_PROMPTS) {
    AI_PROMPTS["REPHRASE"] = "Improve Writing";
    AI_PROMPTS["CHANGE_TONE"] = "Change Tone";
    AI_PROMPTS["GRAMMAR"] = "Fix Grammar";
})(AI_PROMPTS || (AI_PROMPTS = {}));
var TONES;
(function (TONES) {
    TONES["PROFESSIONAL"] = "professional";
    TONES["CASUAL"] = "casual";
})(TONES || (TONES = {}));
[
    {
        label: AI_PROMPTS.REPHRASE,
        value: "rephrase",
    },
    {
        label: AI_PROMPTS.GRAMMAR,
        value: "grammar",
    },
    {
        label: AI_PROMPTS.CHANGE_TONE,
        value: "tone",
        options: [...Object.values(TONES)],
    },
];
var MSGSEVERITY;
(function (MSGSEVERITY) {
    MSGSEVERITY["SUCCESS"] = "success";
    MSGSEVERITY["ERROR"] = "error";
})(MSGSEVERITY || (MSGSEVERITY = {}));
var FONTS;
(function (FONTS) {
    FONTS["ARIAL"] = "Arial";
    FONTS["CALIBRI"] = "Calibri";
    FONTS["TIMES_NEW_ROMAN"] = "Times New Roman";
    FONTS["ROBOTO"] = "Roboto";
    FONTS["IMPACT"] = "IMPACT";
    FONTS["RALEWAY"] = "Raleway";
    FONTS["LATO"] = "Lato";
    FONTS["COURIER_NEW"] = "Courier New";
    FONTS["COMIC_SANS"] = "Comic Sans MS";
    FONTS["CONSTANTIA"] = "Constantia";
    FONTS["GEORGIA"] = "Georgia";
    FONTS["PACIFICO"] = "Pacifico";
})(FONTS || (FONTS = {}));
var HeadingLevel;
(function (HeadingLevel) {
    HeadingLevel["Normal"] = "normal";
    HeadingLevel["Heading 1"] = "first";
    HeadingLevel["Heading 2"] = "second";
    HeadingLevel["Heading 3"] = "third";
    HeadingLevel["Heading 4"] = "fourth";
    HeadingLevel["Heading 5"] = "fifth";
    HeadingLevel["Heading 6"] = "sixth";
})(HeadingLevel || (HeadingLevel = {}));
const fontSizes = [
    6, 7, 8, 10, 12, 14, 16, 18, 20, 21, 24, 29, 32, 34, 48, 56, 72,
];
const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",
    "#dd7e6b",
    "#ea9999",
    "#f9cb9c",
    "#ffe599",
    "#b6d7a8",
    "#a2c4c9",
    "#a4c2f4",
    "#9fc5e8",
    "#b4a7d6",
    "#d5a6bd",
    "#cc4125",
    "#e06666",
    "#f6b26b",
    "#ffd966",
    "#93c47d",
    "#76a5af",
    "#6d9eeb",
    "#6fa8dc",
    "#8e7cc3",
    "#c27ba0",
    "#a61c00",
    "#cc0000",
    "#e69138",
    "#f1c232",
    "#6aa84f",
    "#45818e",
    "#3c78d8",
    "#3d85c6",
    "#674ea7",
    "#a64d79",
    "#85200c",
    "#990000",
    "#b45f06",
    "#bf9000",
    "#38761d",
    "#134f5c",
    "#1155cc",
    "#0b5394",
    "#351c75",
    "#741b47",
    "#5b0f00",
    "#660000",
    "#783f04",
    "#7f6000",
    "#274e13",
    "#0c343d",
    "#1c4587",
    "#073763",
    "#20124d",
    "#4c1130",
];
var Color;
(function (Color) {
    Color["COLOR"] = "color";
    Color["HIGHLIGHT"] = "highlight";
})(Color || (Color = {}));

function FontDropdown(_props) {
    const [font, setFont] = useState("Arial");
    const handleChange = (event) => {
        setFont(event.target.value);
        DOMEventHandlers.handleFontFamily(event.target.value);
    };
    return (React.createElement("div", null,
        React.createElement(FormControl, { sx: { m: 1, minWidth: 80, width: 120 }, size: "small", variant: "standard" },
            React.createElement(Select, { sx: Object.assign({ fontSize: "0.9rem" }, _props.style), value: font, onChange: handleChange, inputProps: { "aria-label": "font family" } }, Object.values(FONTS).map((fontFamily) => {
                return (React.createElement(MenuItem$1, { key: fontFamily, value: fontFamily, sx: { fontSize: "0.9rem", fontFamily: fontFamily } }, fontFamily));
            })))));
}

___$insertStylesToHeader(".activeCell {\n  border: 1px solid rgba(73, 145, 242, 0.2) !important;\n  background: rgba(73, 145, 242, 0.15) !important;\n}\n\n.tableCollapse {\n  width: 17.25rem;\n  height: 19.375;\n  background: #fff;\n  box-shadow: 0 0.125rem 0.75rem 0 rgba(56, 56, 56, 0.2);\n  border: 0.063rem solid #e2e6ed;\n  box-sizing: border-box;\n  border-radius: 0.125rem;\n  position: absolute;\n  z-index: 99;\n  padding: 0.875rem 1.688rem;\n  cursor: auto;\n}\n\n.tableTitle {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-bottom: 5px;\n  border-bottom: 1px solid #e2e6ed;\n  color: black;\n}\n\n.tableContainer {\n  position: relative;\n}");

const TableComponent = (_props) => {
    const [colIndex, setColIndex] = useState(-1);
    const [rowIndex, setRowIndex] = useState(-1);
    const [tablePanelVisible, setTablePanelVisible] = useState(false);
    const [tableTitle, setTableTitle] = useState("Insert table");
    const handleTableClick = () => {
        setTablePanelVisible(true);
    };
    const handleTableCellHover = (evt) => {
        const celSize = 16;
        const rowMarginTop = 4;
        const celMarginRight = 6;
        const { offsetX, offsetY } = evt.nativeEvent;
        setColIndex(Math.ceil(offsetX / (celSize + celMarginRight)) || 1);
        setRowIndex(Math.ceil(offsetY / (celSize + rowMarginTop)) || 1);
    };
    useEffect(() => {
        if (rowIndex > -1 && colIndex > -1)
            setTableTitle(`${rowIndex}×${colIndex}`);
    }, [rowIndex, colIndex]);
    const handleCloseTable = () => {
        setTablePanelVisible(false);
        setColIndex(-1);
        setRowIndex(-1);
        setTableTitle("Insert table");
    };
    const handleApplyTable = () => {
        DOMEventHandlers.createTable({ rowIndex, colIndex });
        handleCloseTable();
    };
    return (React.createElement(Box, { className: "tableContainer" },
        React.createElement(ButtonWrapper, { title: "Insert Table", handleClick: handleTableClick, sx: Object.assign({ height: "100%" }, _props.style) },
            React.createElement(BackupTableIcon, null)),
        tablePanelVisible && (React.createElement(Box, { className: "tableCollapse" },
            React.createElement(Box, { className: "ableTitle" },
                React.createElement(Typography, { sx: { fontSize: "0.8rem" } }, tableTitle),
                React.createElement(ButtonWrapper, { title: "Close table", sx: {
                        cursor: "pointer",
                    }, handleClick: handleCloseTable },
                    React.createElement(CloseIcon, { sx: { width: "0.8rem", height: "0.8rem" } }))),
            React.createElement(Table, { onMouseMove: handleTableCellHover, onClick: handleApplyTable, sx: {
                    borderCollapse: "separate",
                    borderSpacing: "0.25rem",
                } },
                React.createElement(TableBody, null, [...Array(10)].map((_, trIndex) => (React.createElement(TableRow, { key: trIndex }, [...Array(10)].map((_, tdIndex) => {
                    return (React.createElement(TableCell, { className: trIndex < rowIndex && tdIndex < colIndex
                            ? "activeCell"
                            : "", key: tdIndex, sx: {
                            padding: "6px",
                            width: "16px",
                            height: "16px",
                            boxSizing: "border-box",
                            border: "1px solid #e2e6ed",
                            background: "#fff",
                            marginRight: "6px",
                            pointerEvents: "none",
                        } }));
                }))))))))));
};

const ColorPicker = ({ colorPickerHandleClose, colorPickerAnchor, color, feature, }) => {
    useSelector((state) => state.document);
    const [fontColor, setFontColor] = useState(color === null || color === undefined ? undefined : color);
    const handleChangeColor = (color) => {
        setFontColor(color.hex);
    };
    const open = Boolean(colorPickerAnchor);
    const id = open ? "font-color-popover" : undefined;
    const handleOnAccept = async () => {
        // if (fontColor && doc.documentId) {
        //   try {
        //     const response = await DocumentService.saveColorPalette({
        //       documentId: doc.documentId,
        //       color: fontColor,
        //       feature: feature,
        //     });
        //     if (!response.data.success) {
        //       console.log(`Failed in saveColorPalette`, response.data);
        //     }
        //   } catch (error) {
        //     console.log(`Error in saveColorPalette`, error);
        //   }
        // }
        colorPickerHandleClose();
    };
    const handleOnCancel = () => {
        colorPickerHandleClose();
    };
    return (React.createElement(Box$1, null,
        React.createElement(Popover, { id: id, open: open, anchorEl: colorPickerAnchor, onClose: colorPickerHandleClose, anchorOrigin: {
                vertical: "center",
                horizontal: "center",
            }, transformOrigin: {
                vertical: "center",
                horizontal: "center",
            }, className: "custom-popover-paper" },
            React.createElement(PhotoshopPicker, { color: fontColor, onChangeComplete: handleChangeColor, onAccept: handleOnAccept, onCancel: handleOnCancel, header: "Pick Your Color" }))));
};

const ColorPalette = ({ anchorEl, handleClose, definedColor, feature, }) => {
    const [customColors, setCustomColors] = useState([]);
    const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
    useSelector((state) => state.document);
    const handleClick = (event) => {
        setColorPickerAnchor(event.currentTarget);
    };
    const colorPickerHandleClose = () => {
        setColorPickerAnchor(null);
    };
    const handleColor = (hexColor) => {
        if (feature === Color.HIGHLIGHT) {
            DOMEventHandlers.highlightText(hexColor);
        }
        else if (feature === Color.COLOR) {
            DOMEventHandlers.setFontColor(hexColor);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Box$1, null,
            React.createElement(Popover, { open: Boolean(anchorEl), anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                }, transformOrigin: {
                    vertical: "top",
                    horizontal: "center",
                } },
                React.createElement(Grid, { container: true, sx: {
                        width: "14.1rem",
                        height: "auto",
                        display: "flex",
                        margin: "10px 10px 4px 10px",
                        justifyContent: "flex-start",
                    } }, colors?.map((color, index) => (React.createElement(Grid, { item: true, key: index, sx: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "1.4rem",
                        width: "1.4rem",
                    } },
                    React.createElement(Box$1, { sx: {
                            width: ".7rem",
                            height: ".7rem",
                            backgroundColor: color,
                            borderRadius: "50%",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: color === definedColor
                                ? "0px 2px 4px rgba(0, 0, 0, 0.5)"
                                : "",
                        }, onClick: () => {
                            handleColor(color);
                        } }, color === definedColor ? (React.createElement(CheckIcon, { fontSize: "inherit" })) : ("")))))),
                React.createElement(Box$1, { sx: { margin: "0 10px 0 17px" } },
                    React.createElement(Typography$1, { variant: "body2", sx: { fontSize: "12px", fontWeight: "bold" } }, "CUSTOM")),
                React.createElement(Box$1, { sx: { margin: "8px 10px 10px 10px", display: "flex" } },
                    customColors?.map((color, index) => (React.createElement(Box$1, { key: index, sx: {
                            width: ".7rem",
                            height: ".7rem",
                            backgroundColor: color,
                            borderRadius: "50%",
                            cursor: "pointer",
                            padding: "4px",
                            margin: "2px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: color === definedColor
                                ? "0px 2px 4px rgba(0, 0, 0, 0.5)"
                                : "",
                        }, onClick: () => handleColor(color) }, color === definedColor ? React.createElement(CheckIcon, { fontSize: "inherit" }) : ""))),
                    React.createElement(IconButton$1, { onClick: handleClick, sx: { padding: "1px", marginBottom: "2px" } },
                        React.createElement(Tooltip$1, { title: "Add a custom color" },
                            React.createElement(ColorLensIcon, { fontSize: "small" })))))),
        colorPickerAnchor ? (React.createElement(ColorPicker, { colorPickerHandleClose: colorPickerHandleClose, colorPickerAnchor: colorPickerAnchor, color: definedColor, feature: feature })) : null));
};

const FontColorButton = ({ textColor, style }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "font-color-popover" : undefined;
    return (React.createElement(Box$1, null,
        React.createElement(Tooltip$1, { title: "Text color" },
            React.createElement(IconButton, { "aria-describedby": id, sx: Object.assign({ mr: 1, borderRadius: 0 }, style), onClick: handleClick },
                React.createElement(FormatColorTextIcon, { fontSize: "medium" }))),
        React.createElement(ColorPalette, { anchorEl: anchorEl, handleClose: handleClose, definedColor: textColor, feature: Color.COLOR })));
};

const HighlightTextButton = ({ color, style }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "font-color-popover" : undefined;
    return (React.createElement(Box$1, null,
        React.createElement(Tooltip, { title: "Highlight color" },
            React.createElement(IconButton, { "aria-describedby": id, sx: Object.assign({ mr: 1, borderRadius: 0 }, style), onClick: handleClick },
                React.createElement(ColorizeIcon, { fontSize: "medium" }))),
        React.createElement(ColorPalette, { anchorEl: anchorEl, handleClose: handleClose, definedColor: color, feature: Color.HIGHLIGHT })));
};

const FontSizeDropdown = ({ onChange, onClose, }) => {
    return (React.createElement(ClickAwayListener, { onClickAway: onClose },
        React.createElement(Paper, { sx: {
                position: "absolute",
                zIndex: 9999,
                margin: "0 37px",
            } }, fontSizes.map((size, index) => (React.createElement(MenuItem, { key: index, onClick: () => onChange(size) }, size))))));
};
const MenuItem = ({ onClick, children, }) => {
    return (React.createElement("div", { onClick: onClick, style: { cursor: "pointer", padding: "8px" } }, children));
};
const FontSizeButton = ({ size = 16, style }) => {
    const [fontSize, setFontSize] = useState(size);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    useEffect(() => {
        setFontSize(size);
    }, [size]);
    const handleDecreaseFont = () => {
        if (fontSize > 1) {
            setFontSize((prevSize) => prevSize - 2);
            DOMEventHandlers.decreaseFontSize();
        }
    };
    const handleIncreaseFont = () => {
        if (fontSize < 72) {
            setFontSize((prevSize) => prevSize + 2);
            DOMEventHandlers.increaseFontSize();
        }
    };
    const handleTextFieldClick = () => {
        setDropdownOpen(true);
    };
    const handleDropdownClose = () => {
        setDropdownOpen(false);
    };
    const handleFontSizeChange = (size) => {
        setFontSize(size);
        handleDropdownClose();
        DOMEventHandlers.setSize(Number(size));
    };
    const handleOnChange = (event) => {
        const newFontSize = Number(event.target.value);
        setFontSize(newFontSize);
        DOMEventHandlers.setSize(Number(newFontSize));
    };
    return (React.createElement(Box$1, { sx: style },
        React.createElement(IconButton, { onClick: handleDecreaseFont, sx: style },
            React.createElement(Tooltip$1, { title: "Increase font size" },
                React.createElement(Remove, null))),
        React.createElement(Tooltip$1, { title: "Font size" },
            React.createElement(TextField, { type: "text", value: fontSize, onClick: handleTextFieldClick, onChange: handleOnChange, style: { width: "50px", margin: "8px 0", cursor: "pointer" }, inputProps: {
                    style: { textAlign: "center", padding: "1px 1px" },
                } })),
        dropdownOpen && (React.createElement(FontSizeDropdown, { onChange: handleFontSizeChange, onClose: handleDropdownClose })),
        React.createElement(IconButton, { onClick: handleIncreaseFont, sx: { padding: "1px", margin: "8px 0" } },
            React.createElement(Tooltip$1, { title: "Decrease font size" },
                React.createElement(Add, null)))));
};

const HeadingDropdownButton = (_props) => {
    const [selectedHeading, setSelectedHeading] = useState(null);
    const handleHeadingSelect = (headingLevel) => {
        setSelectedHeading(headingLevel);
        const level = headingLevel
            ? HeadingLevel[headingLevel]
            : null;
        DOMEventHandlers.setTitle(level);
    };
    return (React.createElement(Box$1, { sx: Object.assign({
            display: "flex",
            justifyContentt: "center",
            alignItems: "center",
            margin: "0 0.5rem"
        }, _props.style) },
        React.createElement(FormControl, { sx: { m: 1, minWidth: 80, width: 120 }, size: "small", variant: "standard" },
            React.createElement(Select, { labelId: "heading-label", sx: { fontSize: "0.9rem" }, value: selectedHeading ? selectedHeading : "Normal" }, Object.keys(HeadingLevel).map((level) => (React.createElement(MenuItem$1, { key: level, value: level, sx: {
                    fontSize: `${level === "Normal"
                        ? 16
                        : 26 - Number(level.charAt(level.length - 1)) * 2}px`,
                    fontWeight: `${level === "Normal" ? "" : "bold"}`,
                }, onClick: () => handleHeadingSelect(level === "Normal" ? null : level) }, level)))))));
};

const ImageUploadButton = (_props) => {
    const fileInputRef = useRef(null);
    const [imageData, setImageData] = useState("");
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const handleFileInputChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result;
                setImageData(base64Data);
                const img = new Image();
                img.onload = () => {
                    setHeight(img.height);
                    setWidth(img.width);
                };
                img.src = base64Data;
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    useEffect(() => {
        if (imageData) {
            DOMEventHandlers.setImage({
                value: imageData,
                height,
                width,
            });
        }
    }, [imageData, height, width]);
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Input, { type: "file", inputRef: fileInputRef, style: { display: "none", }, inputProps: { accept: "image/*" }, onChange: handleFileInputChange }),
        React.createElement(IconButton$1, { onClick: handleButtonClick },
            React.createElement(Tooltip$1, { title: "Image", style: _props.style },
                React.createElement(InsertPhotoIcon, null)))));
};

const EditorToolbar = forwardRef(function Toolbar(_props, ref) {
    const [contentStyles, setContentStyles] = useState();
    useEffect(() => {
        let interval;
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
    return (React.createElement(Box, { sx: { flexGrow: 1 } },
        React.createElement(AppBar, { position: "fixed", sx: _props?.toolbarClass?.container },
            React.createElement(Stack$1, { sx: _props?.toolbarClass?.primaryToolbar },
                (!_props?.toolbar || _props?.toolbar?.undo) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.undo, title: "undo", handleClick: DOMEventHandlers.handleUndo },
                    React.createElement(UndoIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.redo) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.redo, title: "redo", handleClick: DOMEventHandlers.handleRedo },
                    React.createElement(RedoIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.bold) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.bold, title: "bold", handleClick: DOMEventHandlers.handleBold },
                    React.createElement(FormatBoldIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.italic) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.italic, title: "italic", handleClick: DOMEventHandlers.handleItalic },
                    React.createElement(FormatItalicIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.underline) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.underline, title: "underline", handleClick: DOMEventHandlers.handleUnderline },
                    React.createElement(FormatUnderlinedIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.subscript) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.subscript, title: "subscript", handleClick: DOMEventHandlers.handleSubscript },
                    React.createElement(SubscriptIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.superscript) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.superscript, title: "superscript", handleClick: DOMEventHandlers.handleSuperscript },
                    React.createElement(SuperscriptIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.strikethrough) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.strikethrough, title: "strikethrough", handleClick: DOMEventHandlers.handleStrikeout },
                    React.createElement(StrikethroughSIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.leftAlign) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.leftAlign, title: "left align", handleClick: () => DOMEventHandlers.handleAlign(RowFlex.LEFT) },
                    React.createElement(FormatAlignLeftIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.centerAlign) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.centerAlign, title: "center align", handleClick: () => DOMEventHandlers.handleAlign(RowFlex.CENTER) },
                    React.createElement(FormatAlignCenterIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.rightAlign) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.rightAlign, title: "right align", handleClick: () => DOMEventHandlers.handleAlign(RowFlex.RIGHT) },
                    React.createElement(FormatAlignRightIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.justify) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.justify, title: "justify", handleClick: () => DOMEventHandlers.handleAlign(RowFlex.ALIGNMENT) },
                    React.createElement(FormatAlignJustifyIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.bulletList) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.bulletList, title: "bullet list", handleClick: () => DOMEventHandlers.handleList(ListType.UL, ListStyle.DECIMAL) },
                    React.createElement(FormatListBulletedIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.numberedList) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.numberedList, title: "numbered list", handleClick: () => DOMEventHandlers.handleList(ListType.OL, ListStyle.DECIMAL) },
                    React.createElement(FormatListNumberedIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.fontType) && React.createElement(FontDropdown, { ...{ style: _props?.toolbarClass?.item?.fontType } }),
                (!_props?.toolbar || _props?.toolbar?.table) && React.createElement(TableComponent, { ...{ style: _props?.toolbarClass?.item?.table } }),
                (!_props?.toolbar || _props?.toolbar?.fontColor) && React.createElement(FontColorButton, { style: _props?.toolbarClass?.item?.fontColor, textColor: contentStyles?.color }),
                (!_props?.toolbar || _props?.toolbar?.highlight) && React.createElement(HighlightTextButton, { style: _props?.toolbarClass?.item?.highlight, color: contentStyles?.highlight }),
                (!_props?.toolbar || _props?.toolbar?.fontSize) && React.createElement(FontSizeButton, { style: _props?.toolbarClass?.item?.fontSize, size: contentStyles?.size }),
                (!_props?.toolbar || _props?.toolbar?.heading) && React.createElement(HeadingDropdownButton, { ...{ style: _props?.toolbarClass?.item?.heading } }),
                (!_props?.toolbar || _props?.toolbar?.hyperlink) && React.createElement(ButtonWrapper, { sx: _props?.toolbarClass?.item?.hyperlink, title: "hyperlink", handleClick: () => DOMEventHandlers.createHyperLink() },
                    React.createElement(InsertLinkIcon, null)),
                (!_props?.toolbar || _props?.toolbar?.image) && React.createElement(ImageUploadButton, { ...{ style: _props?.toolbarClass?.item?.image } })))));
});

const EditorMargin = () => {
    useDispatch();
    useParams();
    const document = useSelector((state) => state.document);
    const marginState = useDebounce(document.margins, 500);
    const [open, setOpen] = useState(false);
    const [margins, setMargins] = useState([]);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleMarginChange = (e, position) => {
        const { value } = e.target;
        let margin = [...margins];
        margin[position] = value ? parseInt(value) : "";
        setMargins(margin);
    };
    const updateMargins = () => {
        updateMarginsHandler();
    };
    const updateMarginsHandler = async () => {
        [...margins].map(ob => ob ? ob : 0);
    };
    useEffect(() => {
        if (marginState?.length) {
            setMargins(marginState);
        }
    }, [marginState]);
    return (React.createElement(React.Fragment, null,
        React.createElement(ButtonWrapper, { title: "Margin", handleClick: handleClickOpen },
            React.createElement(DocumentScannerOutlinedIcon, { sx: { fontSize: 20 } })),
        React.createElement(Dialog, { open: open, onClose: handleClose, maxWidth: "xs" },
            React.createElement(DialogTitle, null,
                "Margins",
                React.createElement(IconButton, { "aria-label": "close", onClick: handleClose, sx: {
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    } },
                    React.createElement(CloseIcon, null))),
            React.createElement(DialogContent, null,
                React.createElement(Box, { sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    } },
                    React.createElement(Grid$1, { container: true, spacing: 2 },
                        React.createElement(Grid$1, { container: true, item: true },
                            React.createElement(Grid$1, { item: true, xs: 3 }, "Top :"),
                            React.createElement(Grid$1, { item: true, xs: 9 },
                                React.createElement(TextField$1, { type: "number", inputProps: { inputMode: 'numeric', pattern: '[0-9]' }, size: "small", variant: "outlined", value: margins?.[0], onChange: (e) => handleMarginChange(e, 0) }))),
                        React.createElement(Grid$1, { container: true, item: true, spacing: 1 },
                            React.createElement(Grid$1, { item: true, xs: 3 }, "Bottom :"),
                            React.createElement(Grid$1, { item: true, xs: 9 },
                                React.createElement(TextField$1, { type: "number", inputProps: { inputMode: 'numeric', pattern: '[0-9]' }, size: "small", variant: "outlined", value: margins?.[1], onChange: (e) => handleMarginChange(e, 1) }))),
                        React.createElement(Grid$1, { container: true, item: true, spacing: 1 },
                            React.createElement(Grid$1, { item: true, xs: 3 }, "Left :"),
                            React.createElement(Grid$1, { item: true, xs: 9 },
                                React.createElement(TextField$1, { type: "number", inputProps: { inputMode: 'numeric', pattern: '[0-9]' }, size: "small", variant: "outlined", value: margins?.[2], onChange: (e) => handleMarginChange(e, 2) }))),
                        React.createElement(Grid$1, { container: true, item: true, spacing: 1 },
                            React.createElement(Grid$1, { item: true, xs: 3 }, "Right :"),
                            React.createElement(Grid$1, { item: true, xs: 9 },
                                React.createElement(TextField$1, { type: "number", inputProps: { inputMode: 'numeric', pattern: '[0-9]' }, size: "small", variant: "outlined", value: margins?.[3], onChange: (e) => handleMarginChange(e, 3) })))))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleClose }, "Close"),
                React.createElement(Button, { autoFocus: true, onClick: updateMargins }, "Save changes")))));
};

function EditorFooter() {
    return (React.createElement(Box, { sx: { flexGrow: 1 } },
        React.createElement(AppBar, { position: "fixed", sx: { top: 'auto', bottom: 0, backgroundColor: "#edf2fa" } },
            React.createElement(Toolbar, { variant: "dense", sx: { height: "30px", minHeight: "30px" } },
                React.createElement(Box, { sx: { flexGrow: 1 } }),
                React.createElement(Box, { sx: { display: { xs: 'none', md: 'flex' } } },
                    React.createElement(EditorMargin, null))))));
}

const store = configureStore({
    reducer: {
        document: documentReducer,
    },
});

const DocumentEditor = ({ toolbar, toolbarClass, canvasClass, onChange, onSelect, value }) => {
    // const defaultToolbarItem = {
    //   bold: true,
    //   italic: true,
    //   underline: true,
    //   undo: true,
    //   redo: true,
    //   image: true
    // }
    const defaultToolbarClass = {
        container: {
            backgroundColor: "#edf2fa",
            border: "none",
            minHeight: "40px",
            boxShadow: "none",
        },
        primaryToolbar: {
            display: "flex",
            flexDirection: "row",
            minHeight: "40px",
            justifyContent: "left",
            alignItems: "center"
        }
    };
    // toolbar = toolbar && Object.keys(toolbar).length ? toolbar : defaultToolbarItem;
    toolbarClass = toolbarClass && Object.keys(toolbarClass).length ? {
        container: { ...defaultToolbarClass.container, ...toolbarClass?.container },
        primaryToolbar: { ...defaultToolbarClass.primaryToolbar, ...toolbarClass?.primaryToolbar },
        item: { ...toolbarClass?.item }
    } : defaultToolbarClass;
    const canvasRef = useRef(null);
    return (React.createElement(Provider, { store: store },
        React.createElement(React.Fragment, null,
            React.createElement(EditorToolbar, { ref: canvasRef, toolbar: toolbar, toolbarClass: toolbarClass }),
            React.createElement(CanvasEditor, { ref: canvasRef, style: canvasClass, onChange: onChange, onSelect: onSelect, data: value }),
            React.createElement(EditorFooter, null))));
};

export { CanvasEditor, DocumentEditor };
//# sourceMappingURL=index.js.map
