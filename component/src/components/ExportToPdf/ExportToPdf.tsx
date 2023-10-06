import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ButtonWrapper from "../ButtonWrapper/ButtonWrapper";
import jsPDF from "jspdf";

const ExportToPdf = () => {
  const exportToPdf = () => {
    const canvasList = document.querySelectorAll("canvas");
    const pdf = new jsPDF({ orientation: "p" });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    console.log(canvasList.length);
    canvasList.forEach((canvas, index) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage({
        imageData: imgData,
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
      if (index + 1 < canvasList.length) pdf.addPage();
    });
    pdf.save("document.pdf");
  };
  return (
    <ButtonWrapper title="Export to pdf" handleClick={exportToPdf}>
      <PictureAsPdfIcon />
    </ButtonWrapper>
  );
};

export default ExportToPdf;
