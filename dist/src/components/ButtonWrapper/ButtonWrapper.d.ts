import React, { ReactNode } from "react";
declare function ButtonWrapper(props: ButtonWrapperProps): React.JSX.Element;
type ButtonWrapperProps = {
    title: string;
    handleClick: (args?: unknown) => void;
    children?: ReactNode;
    sx?: {
        [key: string]: unknown;
    };
};
export default ButtonWrapper;
