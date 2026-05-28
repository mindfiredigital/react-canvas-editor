import { IElement } from '@mindfiredigital/canvas-editor';
/**
 * Sets the cursor/selection range by element index.
 * Uses the command.executeSetRange API which is publicly bound.
 */
export declare function setEditorRange(startIndex: number, endIndex: number): void;
/**
 * Returns the current editor content as IElement[].
 */
export declare function getEditorContent(): IElement[];
/**
 * Replaces the full editor content. This WILL reset the cursor position.
 * Call setEditorRange() afterwards to restore cursor placement.
 */
export declare function setEditorContent(elements: IElement[]): void;
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
export declare function estimateCursorFromDiff(oldElements: IElement[], newElements: IElement[]): number;
/**
 * Adjusts a cursor position based on a remote change.
 *
 * If the remote change inserted or deleted elements before the cursor,
 * the cursor index must shift accordingly.
 */
export declare function adjustCursorForRemoteChange(cursorIndex: number, oldElements: IElement[], newElements: IElement[]): number;
