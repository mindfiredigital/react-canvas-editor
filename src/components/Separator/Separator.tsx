import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import SingleLine from "../../assets/images/line-single.svg";
import DotDotDashLine from "../../assets/images/line-dash-dot-dot.svg";
import DotDashLine from "../../assets/images/line-dash-dot.svg";
import LargeGapDashLine from "../../assets/images/line-dash-large-gap.svg";
import SmallDashGapLine from "../../assets/images/line-dash-small-gap.svg";
import DotLine from "../../assets/images/line-dot.svg";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import { DOMEventHandlers } from "@harshita/canvas-editor";

const Separator: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (lineType: number[]) => () => {
    setAnchorEl(null);
    DOMEventHandlers.setHorizontalLine(lineType);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const lineTypes = [
    { SVGIcon: <SingleLine />, value: [] },
    { SVGIcon: <DotLine />, value: [1, 1] },
    { SVGIcon: <SmallDashGapLine />, value: [3, 1] },
    { SVGIcon: <LargeGapDashLine />, value: [4, 4] },
    { SVGIcon: <DotDashLine />, value: [7, 3, 3, 3] },
    { SVGIcon: <DotDotDashLine />, value: [6, 2, 2, 2, 2, 2] },
  ];

  return (
    <>
      <IconButton onClick={handleButtonClick}>
        <Tooltip title="Dividing line">
          <HorizontalSplitIcon fontSize="inherit" />
        </Tooltip>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ marginTop: ".25rem" }}
      >
        {lineTypes.map((line, index) => (
          <MenuItem key={index} onClick={handleMenuItemClick(line.value)}>
            {line.SVGIcon}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Separator;
