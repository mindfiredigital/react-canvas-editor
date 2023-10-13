import React, { useState, useEffect } from 'react'
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";

const buttonStyle = { border: '0px', marginRight: '1px' };
export const Emphasis = (_props: any) => {
    const [formats, setFormats] = useState(() => []);
    const [emphasis, setEmphasis] = useState({});
    const [boldButtonStyle, setBoldButtonStyle] = useState(buttonStyle);
    const [italicButtonStyle, setItalicButtonStyle] = useState(buttonStyle);
    const [underlinedButtonStyle, setUnderlinedButtonStyle] = useState(buttonStyle);

    useEffect(() => {

        _props?.toolbarClass?.item?.bold && setBoldButtonStyle(Object.assign(buttonStyle, _props?.toolbarClass?.item?.bold));
        _props?.toolbarClass?.item?.italic && setItalicButtonStyle(Object.assign(buttonStyle, _props?.toolbarClass?.item?.italic));
        _props?.toolbarClass?.item?.underlined && setUnderlinedButtonStyle(Object.assign(buttonStyle, _props?.toolbarClass?.item?.underline));

    },[])

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        setFormats(newFormats);
    };

    return (
        <ToggleButtonGroup
            size='small'
            value={formats}
            onChange={handleFormat}
            aria-label="text formatting"
        >
            {_props?.toolbar?.bold &&
                <ToggleButton sx={boldButtonStyle} value="bold" aria-label="bold" onClick={DOMEventHandlers.handleBold}>
                    <FormatBoldIcon />
                </ToggleButton>
            }
            {_props?.toolbar?.italic &&
                <ToggleButton sx={italicButtonStyle} value="italic" aria-label="italic" onClick={DOMEventHandlers.handleItalic}>
                    <FormatItalicIcon />
                </ToggleButton>}
            {_props?.toolbar?.underline &&
                <ToggleButton sx={underlinedButtonStyle} value="underlined" aria-label="underlined" onClick={DOMEventHandlers.handleUnderline}>
                    <FormatUnderlinedIcon />
                </ToggleButton>}
        </ToggleButtonGroup>
    );
}
