import React, { Dispatch, SetStateAction } from "react";
import "./FloatingBox.scss";
import AskAI from "./AskAI";
import { SelectionRect } from "../../utils/types";

function FloatingBox({
  left,
  top,
  selectedText,
  setDropdown,
}: {
  left: number;
  top: number;
  selectedText: string;
  setDropdown: Dispatch<SetStateAction<SelectionRect>>;
}) {
  return (
    <div
      className="floating-dropdown"
      style={{
        left: left,
        top: top,
      }}
    >
      <AskAI selectedText={selectedText} setDropdown={setDropdown} />
    </div>
  );
}

export default FloatingBox;
