import { renderHook } from '@testing-library/react';
import useSelectionPosition from '../hooks/useSelectionPosition';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';
import { SelectionRect } from '../utils/types';

const mockGetSelectedText = DOMEventHandlers.getSelectedText as jest.Mock;

describe('useSelectionPosition', () => {
  let setSelectedText: jest.Mock;
  let setElementRects: jest.Mock;

  beforeEach(() => {
    setSelectedText = jest.fn();
    setElementRects = jest.fn();
    mockGetSelectedText.mockReturnValue('');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('adds a mouseup event listener to document on mount', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    addSpy.mockRestore();
  });

  it('removes the mouseup event listener from document on unmount', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() =>
      useSelectionPosition(setSelectedText, setElementRects)
    );
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('calls getSelectedText when mouseup fires', () => {
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(mockGetSelectedText).toHaveBeenCalledTimes(1);
  });

  it('calls setSelectedText with trimmed text when selection is non-empty', () => {
    mockGetSelectedText.mockReturnValue('  hello world  ');
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(setSelectedText).toHaveBeenCalledWith('hello world');
  });

  it('sets visibility to true when text is selected', () => {
    mockGetSelectedText.mockReturnValue('selected text');
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(setElementRects).toHaveBeenCalled();
    const updater = setElementRects.mock.calls[0][0] as (
      prev: SelectionRect
    ) => SelectionRect;
    const prev: SelectionRect = { left: 100, top: 200, visiblity: false };
    expect(updater(prev)).toEqual({ left: 100, top: 200, visiblity: true });
  });

  it('does not call setSelectedText when selection is empty', () => {
    mockGetSelectedText.mockReturnValue('');
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(setSelectedText).not.toHaveBeenCalled();
  });

  it('sets visibility to false when selection is whitespace-only', () => {
    mockGetSelectedText.mockReturnValue('   ');
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(setElementRects).toHaveBeenCalled();
    const updater = setElementRects.mock.calls[0][0] as (
      prev: SelectionRect
    ) => SelectionRect;
    const prev: SelectionRect = { left: 0, top: 0, visiblity: true };
    expect(updater(prev)).toEqual({ left: 0, top: 0, visiblity: false });
  });

  it('preserves existing rect position values when updating visibility', () => {
    mockGetSelectedText.mockReturnValue('text');
    renderHook(() => useSelectionPosition(setSelectedText, setElementRects));
    document.dispatchEvent(new MouseEvent('mouseup'));
    const updater = setElementRects.mock.calls[0][0] as (
      prev: SelectionRect
    ) => SelectionRect;
    const prev: SelectionRect = { left: 450, top: 300, visiblity: false };
    const next = updater(prev);
    expect(next.left).toBe(450);
    expect(next.top).toBe(300);
  });
});
