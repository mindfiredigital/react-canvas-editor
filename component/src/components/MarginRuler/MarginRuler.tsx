import React, { useState, useEffect, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDebounce } from "../../hooks/useDebounce";
import { DocumentState, setDocumentMargins } from "../../redux/documentReducer";
import { CustomSliderVertical, CustomSliderHorizontal, MarginRightArrow, MarginDownArrow, verticalMarks, horizontalMarks } from "./CustomSliderComponents";
import {
    DOMEventHandlers
} from "@mindfiredigital/canvas-editor";

// Default margins as actual margin values [top, bottom, left, right]:
// vertical default [-956, -100] → top=100, bottom=1056-956=100
// horizontal default [120, 696]  → left=120, right=816-696=120
const DEFAULT_MARGINS = [100, 100, 120, 120];

/** After a slider interaction, refocus the canvas so keyboard input works. */
function refocusCanvas() {
    const canvasArea = window.document.querySelector<HTMLDivElement>('[editor-component="main"]');
    if (canvasArea) {
        canvasArea.focus({ preventScroll: true });
    }
}

export default function MarginRuler({ documentId }: { documentId: string | undefined }) {
    const dispatch = useDispatch();

    const document: any = useSelector(
        (state: RootState) => state.document
    ) as unknown as DocumentState;

    const [verticalSlider, setVerticalSlider]: any[] = useState<Array<Number>>([]);
    const [horizontalSlider, setHorizontalSlider]: any[] = useState<Array<Number>>([]);

    const margins: any = useDebounce(document.margins, 500);

    // Track slider values during drag, apply margins only on commit
    const handleChange = useCallback((e: any, value: Array<Number>) => {
        setVerticalSlider(value);
    }, []);

    const handleChangeCommitted = useCallback((e: any, value: Array<Number>) => {
        let [bottom, top]: any[] = value;
        setVerticalSlider(value);
        const base = document.margins?.length === 4 ? [...document.margins] : [...DEFAULT_MARGINS];
        base[0] = Math.abs(top);
        base[1] = 1056 - Math.abs(bottom);
        DOMEventHandlers.setPaperMargins(base);
        dispatch(setDocumentMargins({ margins: base }));
        refocusCanvas();
    }, [document.margins, dispatch]);

    const handleChangeHorizontal = useCallback((e: any, value: Array<Number>) => {
        setHorizontalSlider(value);
    }, []);

    const handleChangeHorizontalCommitted = useCallback((e: any, value: Array<Number>) => {
        let [left, right]: any[] = value;
        setHorizontalSlider(value);
        const base = document.margins?.length === 4 ? [...document.margins] : [...DEFAULT_MARGINS];
        base[2] = left;
        base[3] = 816 - right;
        DOMEventHandlers.setPaperMargins(base);
        dispatch(setDocumentMargins({ margins: base }));
        refocusCanvas();
    }, [document.margins, dispatch]);

    useEffect(() => {
        if (margins?.length && documentId) {
            setVerticalSlider([Math.abs(1056 - margins[1]) * -1, margins[0] * -1]);
            setHorizontalSlider([margins[2], 816 - margins[3]]);
            if (!verticalSlider.length && !horizontalSlider.length) {
                DOMEventHandlers.setPaperMargins(margins);
            }
        }
    }, [margins, documentId]);

    return (
        <React.Fragment>
            <Stack sx={{ height: "1056px", position: "absolute", left: "0px", zIndex: 1 }} direction="row">
                <CustomSliderVertical
                    orientation="vertical"
                    value={verticalSlider.length ? verticalSlider : [-956, -100]}
                    min={-1056}
                    max={0}
                    marks={verticalMarks}
                    onChange={handleChange}
                    onChangeCommitted={handleChangeCommitted}
                    step={24}
                    track="inverted"
                    scale={x => -1056}
                    size="small"
                    slots={{ thumb: MarginRightArrow }}
                    valueLabelDisplay="off"
                />
            </Stack>
            <Stack sx={{ height: "1px", position: "absolute", top: "-1px", width: "816px", left: "calc((100% - 811px) / 2)", zIndex: 1 }} direction="row">
                <CustomSliderHorizontal
                    orientation="horizontal"
                    value={horizontalSlider.length ? horizontalSlider : [120, 696]}
                    min={0}
                    max={816}
                    marks={horizontalMarks}
                    onChange={handleChangeHorizontal}
                    onChangeCommitted={handleChangeHorizontalCommitted}
                    step={24}
                    size="small"
                    scale={x => 816}
                    slots={{ thumb: MarginDownArrow }}
                    valueLabelDisplay="off"
                />
            </Stack>
        </React.Fragment>
    )
}