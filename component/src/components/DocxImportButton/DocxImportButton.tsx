import React, { useRef, useState } from "react";
import { IconButton, Input, Tooltip, CircularProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DOMEventHandlers } from "@mindfiredigital/canvas-editor";
import { htmlToElements } from "../../utils/html-to-elements";
import { docxToElements } from "../../utils/docx-to-elements";

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

  const readArrayBuffer = async (file: File) => {
    try {
      return await file.arrayBuffer();
    } catch {
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
      // `elements` may either be a flat IElement[] (legacy / HTML path)
      // or the structured { header, main, footer } shape from docxToElements.
      let elements: unknown;
      const rawBuffer = await readArrayBuffer(file);

      if (_props.onClientImport) {
        elements = await _props.onClientImport(file);
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
            const arrayBuffer = rawBuffer ?? (await file.arrayBuffer());
            elements = await docxToElements(arrayBuffer);
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
        }
      } else {
        const arrayBuffer = rawBuffer ?? (await file.arrayBuffer());
        elements = await docxToElements(arrayBuffer);
      }

      // Normalize to { header, main, footer }. Array-shaped results (legacy / HTML) → main only.
      const payload = Array.isArray(elements)
        ? { main: elements }
        : (elements as { header?: unknown[]; main?: unknown[]; footer?: unknown[] });

      const hasContent =
        (payload.main?.length ?? 0) > 0 ||
        (payload.header?.length ?? 0) > 0 ||
        (payload.footer?.length ?? 0) > 0;

      if (hasContent) {
        // Deep clone to prevent internal computeRowList from mutating our objects
        const cloned =
          typeof structuredClone === "function"
            ? structuredClone(payload)
            : JSON.parse(JSON.stringify(payload));
        DOMEventHandlers.setContent(cloned);

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
