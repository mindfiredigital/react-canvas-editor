import React from 'react';
import { styled } from '@mui/material/styles';
import Slider, { SliderThumb } from '@mui/material/Slider';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomSliderVertical: any = styled(Slider)(() => ({
    width: 1,
    padding: '0',
    color: "#0000004d",
    borderRadius: 0,
    border: "none",
    pointerEvents: 'none',
    '& .MuiSlider-rail': {
        opacity: 1,
        backgroundColor: "#0000004d",
        left: "-2px",
        transform: 'translateX(0%)',
        pointerEvents: 'none',
    },
    '& .MuiSlider-track': {
        width: 1,
        left: -2,
        border: "none",
        backgroundColor: "white",
        pointerEvents: 'none',
    },
    '& .MuiSlider-mark': {
        backgroundColor: "#0000004d",
        height: 1,
        width: 11,
        left: -8,
        pointerEvents: 'none',
    },
    '& .MuiSlider-markLabel': {
        fontSize: 12,
        fontWeight: 'normal',
        left: -22,
    },
    '& .MuiSlider-thumb': {
        backgroundColor: 'transparent',
        pointerEvents: 'auto',
        overflow: 'visible',
        '& svg': {
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
        },
        '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: "none"
        },
        '&.Mui-active': {
            boxShadow: "none"
        },
        '&.Mui-focusVisible': {
            boxShadow: "none"
        },
    },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomSliderHorizontal: any = styled(Slider)(() => ({
    height: 1,
    padding: '0',
    color: "#0000004d",
    borderRadius: 0,
    border: "none",
    top: 0,
    pointerEvents: 'none',
    '& .MuiSlider-rail': {
        opacity: 1,
        backgroundColor: "#0000004d",
        transform: 'translateY(0%)',
        pointerEvents: 'none',
    },
    '& .MuiSlider-track': {
        height: 1,
        border: "none",
        backgroundColor: "white",
        pointerEvents: 'none',
    },
    '& .MuiSlider-mark': {
        backgroundColor: "#0000004d",
        height: 11,
        width: 1,
        top: -4,
        pointerEvents: 'none',
    },
    '& .MuiSlider-markLabel': {
        display: 'none',
    },
    '& .MuiSlider-thumb': {
        backgroundColor: 'transparent',
        top: 3,
        pointerEvents: 'auto',
        overflow: 'visible',
        '& svg': {
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
        },
        '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: "none"
        },
        '&.Mui-active': {
            boxShadow: "none"
        },
        '&.Mui-focusVisible': {
            boxShadow: "none"
        },
    },
}));

export const verticalMarks = new Array(12).fill(0).map((ob, i) => ({ value: -i * 96, label: i }));

export const horizontalMarks = new Array(9).fill(0).map((ob, i) => ({ value: i * 96, label: undefined }));

export function MarginRightArrow(props: any) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <ArrowRightIcon color="primary" fontSize="large" />
        </SliderThumb>
    );
}

export function MarginDownArrow(props: any) {
    const { children, ...other } = props;
    return (
        <SliderThumb {...other}>
            {children}
            <ArrowDropDownTwoToneIcon color="primary" fontSize="large" />
        </SliderThumb>
    );
}