import {
  DOMEventHandlers,
  EditorMode, IElement, PageMode
} from "@mindfiredigital/canvas-editor";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { VerticalRuler } from "../VerticalRuler/VerticalRuler";
import "./CanvasEditor.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useSelectionPosition from "../../hooks/useSelectionPosition";
import {
  DocumentState
} from "../../redux/documentReducer";
import { RootState } from "../../redux/store";
import { SelectionRect } from "../../utils/types";

interface content {
  style?: any,
  onChange?: any,
  onSelect?: any,
  data?: any
}

const CanvasEditor = forwardRef<HTMLDivElement, content>(function Editor(
  _props,
  ref
) {
  const [dropdown, setDropdown] = useState<SelectionRect>({
    left: 1180,
    top: 250,
    visiblity: false,
  });
  const [editorContent, setEditorContent] = useState<IElement[]>([]);

  const [selectedText, setSelectedText] = useState<string>("");

  const { documentId } = useParams();
  useSelectionPosition(setSelectedText, setDropdown);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Resolve container from forwarded ref (component owns its own node) so
    // StrictMode double-mounts and concurrent editor instances stay isolated —
    // a global querySelector picks the wrong/stale `.canvas-editor` on remount.
    const container =
      (typeof ref === "object" && ref?.current) ||
      containerRef.current ||
      (document.querySelector(".canvas-editor") as HTMLDivElement | null);

    if (!container) return;

    // Wipe any stale markup left over from a previous mount whose destroy()
    // didn't clean the DOM. Without this, the editor renders into a half-torn
    // tree and the page goes blank under StrictMode.
    container.innerHTML = "";

    const editorOptions = {
      height: 1056,
      width: 816,
      mode: EditorMode.EDIT,
      pageMode: PageMode.PAGING,
      pageNumber: {
        format: "{pageNo}/{pageCount}",
      },
      minSize: 1,
      maxSize: 72,
    };

    const handleMouseUp = () => {
      _props.onSelect && _props?.onSelect(DOMEventHandlers.getSelectedText());
    };

    // Blur any focused slider thumb when clicking in the editor area so the
    // canvas-editor regains keyboard focus after a ruler drag.
    const handleMouseDown = () => {
      const active = document.activeElement as HTMLElement | null;
      if (active && container.contains(active) && active.closest('.MuiSlider-root')) {
        active.blur();
      }
    };

    container.addEventListener('mousedown', handleMouseDown, true);
    container.addEventListener('mouseup', handleMouseUp);

    // canvas-editor renders nothing when given an empty array, so seed a single
    // empty paragraph element for blank documents so the page is visible.
    const initialContent = editorContent.length ? editorContent : [{ value: "\n" }] as IElement[];
    const instance = DOMEventHandlers.register(container, initialContent, editorOptions);

    // contentChange fires after every draw.render() — covers typing, toolbar actions
    // (bold, font, size, table insert, align, undo/redo, etc.)
    instance.listener.contentChange = () => {
      const text = DOMEventHandlers.getContent()?.data?.main;
      if (text?.length) {
        setEditorContent(text);
        _props?.onChange && _props?.onChange(JSON.stringify(text));
      }
    };

    return () => {
      instance.listener.contentChange = undefined;
      container.removeEventListener('mousedown', handleMouseDown, true);
      container.removeEventListener('mouseup', handleMouseUp);
      if (instance && instance.destroy) {
        instance.destroy();
      }
      // Force DOM clean — canvas-editor's destroy doesn't always remove its
      // `[editor-component="main"]` subtree, leaving a stale shell that breaks
      // the next mount under StrictMode.
      container.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    if (_props?.data) {
      try {
        const main = JSON.parse(_props?.data);
        if (Array.isArray(main) && main.length > 0) {
          // Deep clone to prevent internal computeRowList from mutating shared refs
          const cloned = JSON.parse(JSON.stringify(main));
          setEditorContent(main);
          DOMEventHandlers.setContent({ main: cloned });

          // setContent → draw.setValue → render({ isSetCursor: false }) which
          // defaults to isLazy: true. The lazy IntersectionObserver uses
          // root=null (viewport) but pages live inside an overflow:auto wrapper,
          // so page 2+ are never detected as visible and stay blank.
          //
          // canvas-editor v1.2.7 has no public executeRender API, so we access
          // draw directly via command.draw to force an immediate re-render.
          try {
            const instance = (DOMEventHandlers as any).getEditorInstance();
            const draw = instance?.command?.draw;
            if (draw) {
              draw.render({ isSetCursor: false, isCompute: true, isLazy: false, isSubmitHistory: false });
            }
          } catch { /* editor not ready */ }
        } else if (!Array.isArray(main)) {
          // Fallback: legacy plain-text format
          DOMEventHandlers.setContent({ main: [{ value: _props?.data }] });
        }
      } catch {
        // Fallback: legacy plain-text format
        DOMEventHandlers.setContent({ main: [{ value: _props?.data }] });
      }
    }
  }, [documentId, dispatch, _props?.data]);

  return (
    <div className="canvas-editor-main" style={_props?.style?.editorMain}>
      <VerticalRuler />
      <div id="canvas" className="canvas-editor editor" ref={ref} style={_props?.style?.margin}>
      </div>
    </div>
  );
});

export default CanvasEditor;
