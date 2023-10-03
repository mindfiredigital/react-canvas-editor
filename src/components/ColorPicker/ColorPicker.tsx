import { Box, Popover } from "@mui/material";
import React, { useState } from "react";
import { Color, PhotoshopPicker } from "react-color";
import { DocumentService } from "../../services/documentService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DocumentState } from "../../redux/documentReducer";
import { IColorPicker } from "../../utils/interface";

const ColorPicker: React.FC<IColorPicker> = ({
  colorPickerHandleClose,
  colorPickerAnchor,
  color,
  feature,
}) => {
  const doc = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;

  const [fontColor, setFontColor] = useState<Color | undefined>(
    color === null || color === undefined ? undefined : color
  );

  const handleChangeColor = (color: { hex: string }) => {
    setFontColor(color.hex);
  };

  const open = Boolean(colorPickerAnchor);
  const id = open ? "font-color-popover" : undefined;

  const handleOnAccept = async () => {
    if (fontColor && doc.documentId) {
      try {
        const response = await DocumentService.saveColorPalette({
          documentId: doc.documentId,
          color: fontColor,
          feature: feature,
        });
        if (!response.data.success) {
          console.log(`Failed in saveColorPalette`, response.data);
        }
      } catch (error) {
        console.log(`Error in saveColorPalette`, error);
      }
    }
    colorPickerHandleClose();
  };

  const handleOnCancel = () => {
    colorPickerHandleClose();
  };

  return (
    <Box>
      <Popover
        id={id}
        open={open}
        anchorEl={colorPickerAnchor}
        onClose={colorPickerHandleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        className="custom-popover-paper"
      >
        <PhotoshopPicker
          color={fontColor}
          onChangeComplete={handleChangeColor}
          onAccept={handleOnAccept}
          onCancel={handleOnCancel}
          header="Pick Your Color"
        />
      </Popover>
    </Box>
  );
};

export default ColorPicker;
