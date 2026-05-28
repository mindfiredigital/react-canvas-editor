import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CanvasEditor from '../components/Editor/CanvasEditor';
import documentReducer from '../redux/documentReducer';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

const mockRegister = DOMEventHandlers.register as jest.Mock;
const mockGetContent = DOMEventHandlers.getContent as jest.Mock;
const mockGetSelectedText = DOMEventHandlers.getSelectedText as jest.Mock;
const mockSetContent = DOMEventHandlers.setContent as jest.Mock;

const makeStore = () =>
  configureStore({
    reducer: { document: documentReducer },
    preloadedState: { document: { documentId: '', title: '', reloadRecentDoc: false, margins: [] } },
  });

const renderWithStore = (ui: React.ReactElement) => {
  const store = makeStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('CanvasEditor', () => {
  let mockInstance: { destroy: jest.Mock; listener: { contentChange?: () => void } };

  beforeEach(() => {
    mockInstance = { destroy: jest.fn(), listener: {} };
    mockRegister.mockReturnValue(mockInstance);
    mockGetContent.mockReturnValue({ data: { main: [{ value: 'hello' }] } });
    mockGetSelectedText.mockReturnValue('');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── DOM structure ────────────────────────────────────────────────────────

  it('renders the canvas-editor-main wrapper', () => {
    const { container } = renderWithStore(<CanvasEditor />);
    expect(container.querySelector('.canvas-editor-main')).toBeInTheDocument();
  });

  it('renders the .canvas-editor element', () => {
    const { container } = renderWithStore(<CanvasEditor />);
    expect(container.querySelector('.canvas-editor')).toBeInTheDocument();
  });

  // ── DOMEventHandlers registration ────────────────────────────────────────

  it('calls DOMEventHandlers.register on mount', () => {
    renderWithStore(<CanvasEditor />);
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });

  it('registers with correct editor dimensions', () => {
    renderWithStore(<CanvasEditor />);
    expect(mockRegister).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.any(Array),
      expect.objectContaining({ height: 1056, width: 816 })
    );
  });

  it('passes the canvas-editor element as the container', () => {
    const { container } = renderWithStore(<CanvasEditor />);
    const editorEl = container.querySelector('.canvas-editor');
    expect(mockRegister).toHaveBeenCalledWith(editorEl, expect.any(Array), expect.any(Object));
  });

  // ── contentChange listener (covers toolbar, typing, undo/redo, etc.) ─────
  // onChange is now triggered via instance.listener.contentChange, not keydown.

  it('assigns listener.contentChange on mount', () => {
    renderWithStore(<CanvasEditor onChange={jest.fn()} />);
    expect(typeof mockInstance.listener.contentChange).toBe('function');
  });

  it('calls onChange with JSON-stringified content when contentChange fires', () => {
    const onChange = jest.fn();
    renderWithStore(<CanvasEditor onChange={onChange} />);
    mockInstance.listener.contentChange!();
    expect(onChange).toHaveBeenCalledWith(JSON.stringify([{ value: 'hello' }]));
  });

  it('does not call onChange when getContent returns empty main array', () => {
    mockGetContent.mockReturnValue({ data: { main: [] } });
    const onChange = jest.fn();
    renderWithStore(<CanvasEditor onChange={onChange} />);
    mockInstance.listener.contentChange!();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when getContent returns undefined', () => {
    mockGetContent.mockReturnValue(undefined);
    const onChange = jest.fn();
    renderWithStore(<CanvasEditor onChange={onChange} />);
    mockInstance.listener.contentChange!();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onSelect with selected text on mouseup', () => {
    mockGetSelectedText.mockReturnValue('selected text');
    const onSelect = jest.fn();
    const { container } = renderWithStore(<CanvasEditor onSelect={onSelect} />);
    const editorEl = container.querySelector('.canvas-editor') as HTMLElement;
    fireEvent.mouseUp(editorEl);
    expect(onSelect).toHaveBeenCalledWith('selected text');
  });

  it('does not throw when onSelect is not provided on mouseup', () => {
    const { container } = renderWithStore(<CanvasEditor />);
    const editorEl = container.querySelector('.canvas-editor') as HTMLElement;
    expect(() => fireEvent.mouseUp(editorEl)).not.toThrow();
  });

  // ── Cleanup on unmount ───────────────────────────────────────────────────

  it('calls instance.destroy on unmount', () => {
    const destroy = jest.fn();
    mockRegister.mockReturnValue({ destroy, listener: {} });
    const { unmount } = renderWithStore(<CanvasEditor />);
    unmount();
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('clears listener.contentChange on unmount', () => {
    const onChange = jest.fn();
    const { unmount } = renderWithStore(<CanvasEditor onChange={onChange} />);
    expect(mockInstance.listener.contentChange).toBeDefined();
    unmount();
    expect(mockInstance.listener.contentChange).toBeUndefined();
  });

  // ── data prop (setContent) ───────────────────────────────────────────────

  it('calls DOMEventHandlers.setContent when data prop is provided', () => {
    renderWithStore(<CanvasEditor data="initial content" />);
    expect(mockSetContent).toHaveBeenCalledWith({
      main: [{ value: 'initial content' }],
    });
  });

  it('does not call DOMEventHandlers.setContent when data is undefined', () => {
    renderWithStore(<CanvasEditor />);
    expect(mockSetContent).not.toHaveBeenCalled();
  });

  // ── Double-init guard (line 50) ──────────────────────────────────────────

  it('skips registration when [editor-component="main"] already exists in DOM', () => {
    // Pre-add a .canvas-editor that already has [editor-component="main"]
    // so querySelector finds it first and the guard fires before register is called
    const existing = document.createElement('div');
    existing.className = 'canvas-editor';
    const mainEl = document.createElement('div');
    mainEl.setAttribute('editor-component', 'main');
    existing.appendChild(mainEl);
    document.body.appendChild(existing);

    renderWithStore(<CanvasEditor />);
    expect(mockRegister).not.toHaveBeenCalled();

    document.body.removeChild(existing);
  });

  // ── Style prop ───────────────────────────────────────────────────────────

  it('applies custom editorMain style to wrapper div', () => {
    const { container } = renderWithStore(
      <CanvasEditor style={{ editorMain: { backgroundColor: 'red' } }} />
    );
    const wrapper = container.querySelector('.canvas-editor-main') as HTMLElement;
    expect(wrapper.style.backgroundColor).toBe('red');
  });
});
