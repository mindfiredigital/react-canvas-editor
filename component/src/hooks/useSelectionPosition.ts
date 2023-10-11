import { Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { SelectionRect } from "../utils/types";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";

const useSelectionPosition = (
  setSelectedText: Dispatch<SetStateAction<string>>,
  setElementRects: Dispatch<SetStateAction<SelectionRect>>
) => {
  const handleSelection = useCallback(() => {
    
    const text = DOMEventHandlers.getSelectedText();
    const selectedText = text?.toString().trim();

    if (selectedText) {
      setSelectedText(selectedText);
      setElementRects((prevState) => ({ ...prevState, visiblity: true }));
    } else {
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

export default useSelectionPosition;
