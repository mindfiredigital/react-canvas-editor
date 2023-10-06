import React, { useEffect, useRef, useState } from "react";
import { IconButton, Input, Tooltip } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { DOMEventHandlers } from "@harshita/canvas-editor";

const ImageUploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageData, setImageData] = useState<string>("");
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setImageData(base64Data);

        const img = new Image();
        img.onload = () => {
          setHeight(img.height);
          setWidth(img.width);
        };
        img.src = base64Data;
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (imageData) {
      DOMEventHandlers.setImage({
        value: imageData,
        height,
        width,
      });
    }
  }, [imageData, height, width]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Input
        type="file"
        inputRef={fileInputRef}
        style={{ display: "none" }}
        inputProps={{ accept: "image/*" }}
        onChange={handleFileInputChange}
      />
      <IconButton onClick={handleButtonClick}>
        <Tooltip title="Image">
          <InsertPhotoIcon />
        </Tooltip>
      </IconButton>
    </>
  );
};

export default ImageUploadButton;
