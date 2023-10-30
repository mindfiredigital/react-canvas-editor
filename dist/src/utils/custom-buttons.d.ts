declare const saveDocument: {
    name: string;
    iconURL: any;
    tooltip: string;
};
declare const PDFExport: {
    name: string;
    iconURL: any;
    tooltip: string;
};
declare const saveAsTemplate: {
    name: string;
    iconURL: any;
    tooltip: string;
};
declare function exportToPdf(htmlContent: string): void;
export { exportToPdf, PDFExport, saveDocument, saveAsTemplate };
