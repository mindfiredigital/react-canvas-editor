import React, { ReactNode } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";


function ButtonWrapper(props: ButtonWrapperProps) {
  return (
    <Tooltip title={props.title}>
      <IconButton
        size="small"
        edge="start"
        aria-label={props.title}
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
