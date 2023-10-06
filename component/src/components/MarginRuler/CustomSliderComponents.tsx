import React from 'react';
import { styled } from '@mui/material/styles';
import Slider, { SliderThumb } from '@mui/material/Slider';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';

export const CustomSliderVertical = styled(Slider)(() => ({
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

export const CustomSliderHorizontal = styled(Slider)(() => ({
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

export const verticalMarks = new Array(12).fill(0).map((ob, i) => ({ value: -i * 96, label: i }));

export const horizontalMarks = new Array(9).fill(0).map((ob, i) => ({ value: i * 96, label: i }));

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