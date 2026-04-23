import React, { useRef, useState } from "react";
import { IconButton, Input, Tooltip, CircularProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";
import { htmlToElements } from "../../utils/html-to-elements";
import { docxToElements } from "../../utils/docx-to-elements";
import JSZip from "jszip";

interface DocxImportButtonProps {
  style?: React.CSSProperties;
  apiBaseUrl?: string;
  /**
   * Optional client-side import handler. When provided, the button will call
   * this function with the selected File instead of uploading to the backend.
   * The handler should return IElement[] to load into the editor.
   */
  onClientImport?: (file: File) => Promise<unknown[]>;
}

const DocxImportButton: React.FC<DocxImportButtonProps> = (_props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const logRawDocx = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log("[DocxImport] Raw ArrayBuffer byteLength:", arrayBuffer.byteLength);
      const preview = Array.from(new Uint8Array(arrayBuffer).slice(0, 64));
      console.log("[DocxImport] Raw bytes preview (first 64):", preview);
      try {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const entries = Object.keys(zip.files);
        console.log("[DocxImport] ZIP entries:", entries);

        const docXml = await zip.file("word/document.xml")?.async("text");
        if (docXml) {
          console.log("[DocxImport] word/document.xml (first 2000 chars):");
          console.log(docXml.slice(0, 2000));
        }

        const numberingXml = await zip.file("word/numbering.xml")?.async("text");
        if (numberingXml) {
          console.log("[DocxImport] word/numbering.xml (first 2000 chars):");
          console.log(numberingXml.slice(0, 2000));
        }

        const stylesXml = await zip.file("word/styles.xml")?.async("text");
        if (stylesXml) {
          console.log("[DocxImport] word/styles.xml (first 2000 chars):");
          console.log(stylesXml.slice(0, 2000));
        }
      } catch (zipErr) {
        console.warn("[DocxImport] Failed to unzip DOCX for readable XML:", zipErr);
      }
      return arrayBuffer;
    } catch (err) {
      console.warn("[DocxImport] Failed to read raw ArrayBuffer:", err);
      return null;
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".docx")) {
      alert("Please upload a .docx file.");
      return;
    }

    setLoading(true);

    try {
      let elements: unknown[];
      const rawBuffer = await logRawDocx(file);

      if (_props.onClientImport) {
        // Client-side import path — parse DOCX directly in the browser
        elements = await _props.onClientImport(file);
        console.log("[DocxImport] Client-side parsed", elements.length, "elements");
      } else if (_props.apiBaseUrl) {
        // Legacy fallback: upload to backend for LibreOffice conversion
        const baseUrl = _props.apiBaseUrl || "";
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${baseUrl}/api/v1/import/docx`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(
              "[DocxImport] Server endpoint not found (404). Falling back to client-side import."
            );
            const arrayBuffer = rawBuffer ?? (await file.arrayBuffer());
            elements = await docxToElements(arrayBuffer);
            console.log(
              "[DocxImport] Client-side fallback parsed",
              elements.length,
              "elements"
            );
          } else {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              errorData?.error?.message || `Server error: ${response.status}`
            );
          }
        } else {
          const result = await response.json();
          const html: string = result.data.html;
          elements = htmlToElements(html);
          console.log("[DocxImport] Server-side parsed", elements.length, "elements from HTML");
        }
      } else {
        // Default client-side import when no backend is configured
        const arrayBuffer = rawBuffer ?? (await file.arrayBuffer());
        elements = await docxToElements(arrayBuffer);
        console.log("[DocxImport] Client-side default parsed", elements.length, "elements");
      }

      if (elements.length > 0) {
        console.log("[DocxImport] Full IElement[] data:", JSON.stringify(elements, null, 2));
        console.log("[DocxImport] Raw elements object (expandable):", elements);
        // Deep clone to prevent internal computeRowList from mutating our objects
        const cloned =
          typeof structuredClone === "function"
            ? structuredClone(elements)
            : JSON.parse(JSON.stringify(elements));
        console.log("[DocxImport] Cloned elements object (expandable):", cloned);
        DOMEventHandlers.setContent({ main: cloned });

        // Force non-lazy render for overflow:auto containers.
        // Use requestAnimationFrame to ensure setContent's internal render
        // completes before we trigger the non-lazy re-render.
        requestAnimationFrame(() => {
          try {
            const instance = (DOMEventHandlers as any).getEditorInstance();
            const draw = instance?.command?.draw;
            if (draw) {
              draw.render({ isSetCursor: false, isCompute: true, isLazy: false, isSubmitHistory: false });
            }
          } catch { /* editor not ready */ }
        });
      }
    } catch (error) {
      console.error("[DocxImport] Failed to import DOCX:", error);
      alert(
        error instanceof Error
          ? `Import failed: ${error.message}`
          : "Failed to import the DOCX file. Please try again."
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current && !loading) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Input
        type="file"
        inputRef={fileInputRef}
        style={{ display: "none" }}
        inputProps={{
          accept:
            ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }}
        onChange={handleFileInputChange}
      />
      <IconButton
        size="small"
        sx={Object.assign({ mr: 1, borderRadius: 0 }, _props.style)}
        onClick={handleButtonClick}
        disabled={loading}
      >
        <Tooltip title="Import DOCX" style={_props.style}>
          {loading ? (
            <CircularProgress size={18} />
          ) : (
            <UploadFileIcon style={{ fontSize: "large" }} />
          )}
        </Tooltip>
      </IconButton>
    </>
  );
};

export default DocxImportButton;
