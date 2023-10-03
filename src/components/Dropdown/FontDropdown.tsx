import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DOMEventHandlers } from "@harshita/canvas-editor";
import { FONTS } from "../../utils/constant";

export default function FontDropdown() {
  const [font, setFont] = useState("Arial");

  const handleChange = (event: SelectChangeEvent) => {
    setFont(event.target.value);
    DOMEventHandlers.handleFontFamily(event.target.value);
  };

  return (
    <div>
      <FormControl
        sx={{ m: 1, minWidth: 80, width: 120 }}
        size="small"
        variant="standard"
      >
        <Select
          sx={{ fontSize: "0.9rem" }}
          value={font}
          onChange={handleChange}
          inputProps={{ "aria-label": "font family" }}
        >
          {Object.values(FONTS).map((fontFamily) => {
            return (
              <MenuItem
                key={fontFamily}
                value={fontFamily}
                sx={{ fontSize: "0.9rem", fontFamily: fontFamily }}
              >
                {fontFamily}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
