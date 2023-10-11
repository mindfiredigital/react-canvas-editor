import React, { useEffect, useState } from "react";
import {
  Popover,
  Grid,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Color, colors } from "../../utils/constant";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ColorPicker from "../ColorPicker/ColorPicker";
import { DOMEventHandlers } from "@mindfire/canvas-editor";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DocumentState } from "../../redux/documentReducer";
// import { DocumentService } from "../../services/documentService";
import { IColor, IColorPalette } from "../../utils/interface";

const ColorPalette: React.FC<IColorPalette> = ({
  anchorEl,
  handleClose,
  definedColor,
  feature,
}) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<null | HTMLElement>(null);
  const doc: any = useSelector(
    (state: RootState) => state.document
  ) as DocumentState;

  useEffect(() => {
    const getColorList = async () => {
      // try {
      //   if (doc.documentId) {
      //     const response = await DocumentService.getColor(doc.documentId);
      //     if (response.data.success) {
      //       response.data.data.forEach((item: IColor) => {
      //         if (item.feature === feature) {
      //           setCustomColors(item.colors);
      //         }
      //       });
      //     } else {
      //       console.log(`Get color list api failed`, response.data);
      //     }
      //   }
      // } catch (err) {
      //   console.log(`Error in getColorList`, err);
      // }
    };
    getColorList();
  }, [doc.documentId, colorPickerAnchor, anchorEl, feature]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const colorPickerHandleClose = () => {
    setColorPickerAnchor(null);
  };

  const handleColor = (hexColor: string) => {
    if (feature === Color.HIGHLIGHT) {
      DOMEventHandlers.highlightText(hexColor);
    } else if (feature === Color.COLOR) {
      DOMEventHandlers.setFontColor(hexColor);
    }
  };

  return (
    <>
      <Box>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Grid
            container
            sx={{
              width: "14.1rem",
              height: "auto",
              display: "flex",
              margin: "10px 10px 4px 10px",
              justifyContent: "flex-start",
            }}
          >
            {colors?.map((color, index) => (
              <Grid
                item
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "1.4rem",
                  width: "1.4rem",
                }}
              >
                <Box
                  sx={{
                    width: ".7rem",
                    height: ".7rem",
                    backgroundColor: color,
                    borderRadius: "50%",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      color === definedColor
                        ? "0px 2px 4px rgba(0, 0, 0, 0.5)"
                        : "",
                  }}
                  onClick={() => {
                    handleColor(color);
                  }}
                >
                  {color === definedColor ? (
                    <CheckIcon fontSize="inherit" />
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ margin: "0 10px 0 17px" }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", fontWeight: "bold" }}
            >
              CUSTOM
            </Typography>
          </Box>
          <Box sx={{ margin: "8px 10px 10px 10px", display: "flex" }}>
            {customColors?.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: ".7rem",
                  height: ".7rem",
                  backgroundColor: color,
                  borderRadius: "50%",
                  cursor: "pointer",
                  padding: "4px",
                  margin: "2px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow:
                    color === definedColor
                      ? "0px 2px 4px rgba(0, 0, 0, 0.5)"
                      : "",
                }}
                onClick={() => handleColor(color)}
              >
                {color === definedColor ? <CheckIcon fontSize="inherit" /> : ""}
              </Box>
            ))}

            <IconButton
              onClick={handleClick}
              sx={{ padding: "1px", marginBottom: "2px" }}
            >
              <Tooltip title="Add a custom color">
                <ColorLensIcon fontSize="small" />
              </Tooltip>
            </IconButton>
          </Box>
        </Popover>
      </Box>
      {colorPickerAnchor ? (
        <ColorPicker
          colorPickerHandleClose={colorPickerHandleClose}
          colorPickerAnchor={colorPickerAnchor}
          color={definedColor}
          feature={feature}
        />
      ) : null}
    </>
  );
};

export default ColorPalette;
