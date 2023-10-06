import html2pdf from "html2pdf.js";
import pdfExport from "../assets/images/pdf-export.png";
import save from "../assets/images/save.png";
import template from "../assets/images/template.png";

const saveDocument = {
  name: "Save",
  iconURL: save,
  tooltip: "Save Document",
};

const PDFExport = {
  name: "PDF export",
  iconURL: pdfExport,
  tooltip: "PDF export",
};

const saveAsTemplate = {
  name: "Save as Template",
  iconURL: template,
  tooltip: "Save as Template",
};

function exportToPdf(htmlContent: string) {
  html2pdf()
    .set({
      margin: 10,
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(htmlContent)
    .save();
}

export { exportToPdf, PDFExport, saveDocument, saveAsTemplate };
