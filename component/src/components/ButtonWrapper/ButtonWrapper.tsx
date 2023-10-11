import React, { ReactNode } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
// import { DOMEventHandlers } from '@mindfire/canvas-editor';
// import { JsxElement } from 'typescript';

function ButtonWrapper(props: ButtonWrapperProps) {
  //const [bgColor, setBgColor] = useState('transparent');

  //   const toggleBg = () => {
  //     // Toggle the background color based on the current state
  //     const newBackgroundColor =
  //       bgColor === 'transparent' ? '#dee3fd' : 'transparent';
  //     setBgColor(newBackgroundColor);
  //   };
  return (
    <Tooltip title={props.title}>
      <IconButton
        size="small"
        edge="start"
        aria-label={props.title}
        // sx={{ mr: 1, backgroundColor: bgColor, borderRadius: 0 }}
        sx={{ mr: 1, borderRadius: 0, ...props.sx }}
        onClick={props.handleClick}
      >
        {props.children}
      </IconButton>
    </Tooltip>
  );
}

type ButtonWrapperProps = {
  title: string;
  handleClick: (args?: unknown) => void;
  children?: ReactNode;
  sx?: { [key: string]: unknown };
};

export default ButtonWrapper;
