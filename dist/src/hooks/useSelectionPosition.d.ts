import { Dispatch, SetStateAction } from "react";
import { SelectionRect } from "../utils/types";
declare const useSelectionPosition: (setSelectedText: Dispatch<SetStateAction<string>>, setElementRects: Dispatch<SetStateAction<SelectionRect>>) => void;
export default useSelectionPosition;
