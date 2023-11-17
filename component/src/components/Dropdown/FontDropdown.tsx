import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";
import { FONTS } from "../../utils/constant";
import { Tooltip } from "@mui/material";

export default function FontDropdown(_props: any) {
  const [font, setFont] = useState("Arial");

  const handleChange = (event: SelectChangeEvent) => {
    setFont(event.target.value);
    DOMEventHandlers.handleFontFamily(event.target.value);
  };

  return (
    <div>
      <Tooltip title='Font'>
        <FormControl
          sx={{ m: 1, minWidth: 80, width: 120 }}
          size='small'
          variant='standard'>
          <Select
            sx={Object.assign({ fontSize: "0.8rem" }, _props.style)}
            value={font}
            onChange={handleChange}
            inputProps={{ "aria-label": "font family" }}>
            {Object.values(FONTS).map((fontFamily) => {
              return (
                <MenuItem
                  key={fontFamily}
                  value={fontFamily}
                  sx={{ fontSize: "0.8rem", fontFamily: fontFamily }}>
                  {fontFamily}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Tooltip>
    </div>
  );
}
