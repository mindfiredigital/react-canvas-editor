import { DOMEventHandlers, IElement } from '@mindfiredigital/canvas-editor';

/**
 * Low-level editor API wrapper that exposes cursor/range operations
 * not available through the standard DOMEventHandlers static methods.
 *
 * Uses runtime access to the singleton editor instance stored on DOMEventHandlers.
 * This is coupled to the canvas-editor internal structure — pin the version.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditor = any;

/**
 * Returns the singleton editor instance, or null if not yet registered.
 */
function getInstance(): AnyEditor | null {
  try {
    return DOMEventHandlers.getEditorInstance();
  } catch {
    return null;
  }
}

/**
 * Sets the cursor/selection range by element index.
 * Uses the command.executeSetRange API which is publicly bound.
 */
export function setEditorRange(startIndex: number, endIndex: number): void {
  const instance = getInstance();
  if (!instance) return;
  instance.command.executeSetRange(startIndex, endIndex);
}

/**
 * Returns the current editor content as IElement[].
 */
export function getEditorContent(): IElement[] {
  try {
    const result = DOMEventHandlers.getContent();
    return result?.data?.main ?? [];
  } catch {
    return [];
  }
}

/**
 * Replaces the full editor content. This WILL reset the cursor position.
 * Call setEditorRange() afterwards to restore cursor placement.
 */
export function setEditorContent(elements: IElement[]): void {
  // Deep clone to prevent internal computeRowList from mutating shared refs
  const cloned = JSON.parse(JSON.stringify(elements));
  DOMEventHandlers.setContent({ main: cloned });

  // setContent → draw.setValue → render() defaults to isLazy: true.
  // The lazy IntersectionObserver uses root=null (viewport) but pages live
  // inside an overflow:auto wrapper → page 2+ stay blank.
  // v1.2.7 has no executeRender API, so access draw directly.
  try {
    const instance = (DOMEventHandlers as any).getEditorInstance();
    const draw = instance?.command?.draw;
    if (draw) {
      draw.render({ isSetCursor: false, isCompute: true, isLazy: false, isSubmitHistory: false });
    }
  } catch { /* editor not ready */ }
}

/**
 * Estimates the cursor position from a content diff.
 *
 * Given the old content (before local edit) and new content (after local edit),
 * returns the estimated cursor index in the new content. The cursor is assumed
 * to be immediately after the first region of change.
 *
 * This works for the common case: typing inserts characters at the cursor,
 * backspace deletes behind it.
 */
export function estimateCursorFromDiff(
  oldElements: IElement[],
  newElements: IElement[],
): number {
  const oldLen = oldElements.length;
  const newLen = newElements.length;

  // Find common prefix length
  let prefixLen = 0;
  const minLen = Math.min(oldLen, newLen);
  while (prefixLen < minLen) {
    if (oldElements[prefixLen]?.value !== newElements[prefixLen]?.value) break;
    prefixLen++;
  }

  if (newLen > oldLen) {
    // Insertion — cursor is after the inserted region
    const inserted = newLen - oldLen;
    return prefixLen + inserted;
  } else if (newLen < oldLen) {
    // Deletion — cursor is at the deletion point
    return prefixLen;
  } else {
    // Same length — formatting change, cursor stays at prefix boundary
    return prefixLen;
  }
}

/**
 * Adjusts a cursor position based on a remote change.
 *
 * If the remote change inserted or deleted elements before the cursor,
 * the cursor index must shift accordingly.
 */
export function adjustCursorForRemoteChange(
  cursorIndex: number,
  oldElements: IElement[],
  newElements: IElement[],
): number {
  const oldLen = oldElements.length;
  const newLen = newElements.length;

  // Find where the change starts
  let changeStart = 0;
  const minLen = Math.min(oldLen, newLen);
  while (changeStart < minLen) {
    if (oldElements[changeStart]?.value !== newElements[changeStart]?.value) break;
    changeStart++;
  }

  // If the change is entirely after the cursor, no adjustment needed
  if (changeStart >= cursorIndex) return cursorIndex;

  // Find common suffix
  let suffixLen = 0;
  while (
    suffixLen < (minLen - changeStart) &&
    oldElements[oldLen - 1 - suffixLen]?.value === newElements[newLen - 1 - suffixLen]?.value
  ) {
    suffixLen++;
  }

  const oldMiddleLen = oldLen - changeStart - suffixLen;
  const newMiddleLen = newLen - changeStart - suffixLen;
  const delta = newMiddleLen - oldMiddleLen;

  // Shift cursor by the net change in elements before it
  return Math.max(0, Math.min(cursorIndex + delta, newLen - 1));
}
