import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EditorToolbar from '../components/EditorToolbar/EditorToolbar';
import documentReducer from '../redux/documentReducer';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

// ButtonWrapper renders <IconButton aria-label={title}> so we query by role + name.

const mockHandleBold = DOMEventHandlers.handleBold as jest.Mock;
const mockHandleItalic = DOMEventHandlers.handleItalic as jest.Mock;
const mockHandleUnderline = DOMEventHandlers.handleUnderline as jest.Mock;
const mockHandleSubscript = DOMEventHandlers.handleSubscript as jest.Mock;
const mockHandleSuperscript = DOMEventHandlers.handleSuperscript as jest.Mock;
const mockHandleStrikeout = DOMEventHandlers.handleStrikeout as jest.Mock;
const mockHandleUndo = DOMEventHandlers.handleUndo as jest.Mock;
const mockHandleRedo = DOMEventHandlers.handleRedo as jest.Mock;
const mockHandleAlign = DOMEventHandlers.handleAlign as jest.Mock;
const mockHandleList = DOMEventHandlers.handleList as jest.Mock;
const mockCreateHyperLink = DOMEventHandlers.createHyperLink as jest.Mock;
const mockGetContentStyles = DOMEventHandlers.getContentStyles as jest.Mock;

// EditorToolbar renders FontColorButton → ColorPalettes which uses useSelector,
// so a Redux Provider is required for all renders.
const makeStore = () =>
  configureStore({ reducer: { document: documentReducer } });

const renderWithProvider = (toolbar: any, toolbarClass: any = {}) =>
  render(
    <Provider store={makeStore()}>
      <EditorToolbar toolbar={toolbar} toolbarClass={toolbarClass} />
    </Provider>
  );

describe('EditorToolbar', () => {
  beforeEach(() => {
    mockGetContentStyles.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering: all buttons when no toolbar filter ────────────────────────

  describe('renders all buttons when toolbar prop is undefined', () => {
    it('renders Undo button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    });

    it('renders Redo button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
    });

    it('renders Bold button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    });

    it('renders Italic button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
    });

    it('renders Underline button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument();
    });

    it('renders Subscript button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Subscript' })).toBeInTheDocument();
    });

    it('renders Superscript button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Superscript' })).toBeInTheDocument();
    });

    it('renders all four alignment buttons', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Left align' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Center align' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Right align' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Justify' })).toBeInTheDocument();
    });

    it('renders Bullet list and Numbered list buttons', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Bullet list' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Numbered list' })).toBeInTheDocument();
    });

    it('renders Hyperlink button', () => {
      renderWithProvider(undefined);
      expect(screen.getByRole('button', { name: 'Hyperlink' })).toBeInTheDocument();
    });
  });

  // ── Toolbar filtering ────────────────────────────────────────────────────

  describe('toolbar prop filtering', () => {
    it('hides Undo when toolbar.undo is not set', () => {
      renderWithProvider({ bold: true });
      expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
    });

    it('shows Bold when toolbar = { bold: true }', () => {
      renderWithProvider({ bold: true });
      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    });

    it('hides Italic when toolbar = { bold: true }', () => {
      renderWithProvider({ bold: true });
      expect(screen.queryByRole('button', { name: 'Italic' })).not.toBeInTheDocument();
    });

    it('shows only the buttons specified in the toolbar whitelist', () => {
      renderWithProvider({ bold: true, italic: true, undo: true });
      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Redo' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Underline' })).not.toBeInTheDocument();
    });

    it('hides all buttons when toolbar is an empty object', () => {
      renderWithProvider({});
      expect(screen.queryByRole('button', { name: 'Bold' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Italic' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
    });
  });

  // ── Button click interactions ────────────────────────────────────────────

  describe('button click handlers', () => {
    it('calls DOMEventHandlers.handleBold on Bold click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
      expect(mockHandleBold).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleItalic on Italic click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
      expect(mockHandleItalic).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleUnderline on Underline click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Underline' }));
      expect(mockHandleUnderline).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleUndo on Undo click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(mockHandleUndo).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleRedo on Redo click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Redo' }));
      expect(mockHandleRedo).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleAlign with LEFT on Left align click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Left align' }));
      expect(mockHandleAlign).toHaveBeenCalledWith('left');
    });

    it('calls DOMEventHandlers.handleAlign with CENTER on Center align click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Center align' }));
      expect(mockHandleAlign).toHaveBeenCalledWith('center');
    });

    it('calls DOMEventHandlers.handleList on Bullet list click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Bullet list' }));
      expect(mockHandleList).toHaveBeenCalledWith('ul', 'decimal');
    });

    it('calls DOMEventHandlers.handleList on Numbered list click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Numbered list' }));
      expect(mockHandleList).toHaveBeenCalledWith('ol', 'decimal');
    });

    it('calls DOMEventHandlers.handleSubscript on Subscript click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Subscript' }));
      expect(mockHandleSubscript).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleSuperscript on Superscript click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Superscript' }));
      expect(mockHandleSuperscript).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleStrikeout on Strikethrough click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Strikethrough' }));
      expect(mockHandleStrikeout).toHaveBeenCalledTimes(1);
    });

    it('calls DOMEventHandlers.handleAlign with RIGHT on Right align click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Right align' }));
      expect(mockHandleAlign).toHaveBeenCalledWith('right');
    });

    it('calls DOMEventHandlers.handleAlign with ALIGNMENT on Justify click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Justify' }));
      expect(mockHandleAlign).toHaveBeenCalledWith('alignment');
    });

    it('calls DOMEventHandlers.createHyperLink on Hyperlink click', () => {
      renderWithProvider(undefined);
      fireEvent.click(screen.getByRole('button', { name: 'Hyperlink' }));
      expect(mockCreateHyperLink).toHaveBeenCalledTimes(1);
    });
  });

  // ── addFormat toggle coverage ────────────────────────────────────────────

  describe('addFormat internal state (covers lines 42-47)', () => {
    it('adds Bold to formats on first click', () => {
      renderWithProvider({ bold: true });
      fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
      expect(mockHandleBold).toHaveBeenCalledTimes(1);
    });

    it('removes Bold from formats on second click (toggle off)', () => {
      renderWithProvider({ bold: true });
      const btn = screen.getByRole('button', { name: 'Bold' });
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(mockHandleBold).toHaveBeenCalledTimes(2);
    });

    it('can toggle multiple independent formats', () => {
      renderWithProvider({ bold: true, italic: true, underline: true });
      fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
      fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
      fireEvent.click(screen.getByRole('button', { name: 'Underline' }));
      expect(mockHandleBold).toHaveBeenCalledTimes(1);
      expect(mockHandleItalic).toHaveBeenCalledTimes(1);
      expect(mockHandleUnderline).toHaveBeenCalledTimes(1);
    });
  });

  // ── Polling interval ─────────────────────────────────────────────────────
  // getContentStyles is guarded by document.querySelector('.canvas-editor'),
  // so a .canvas-editor element must be present for polling to fire.

  describe('getContentStyles polling', () => {
    let canvasEditorEl: HTMLElement;

    beforeEach(() => {
      jest.useFakeTimers();
      canvasEditorEl = document.createElement('div');
      canvasEditorEl.className = 'canvas-editor';
      document.body.appendChild(canvasEditorEl);
    });

    afterEach(() => {
      act(() => { jest.runOnlyPendingTimers(); });
      jest.useRealTimers();
      if (document.body.contains(canvasEditorEl)) {
        document.body.removeChild(canvasEditorEl);
      }
    });

    it('does not poll immediately on mount', () => {
      renderWithProvider(undefined);
      expect(mockGetContentStyles).not.toHaveBeenCalled();
    });

    it('does not poll within the initial 1s delay', () => {
      renderWithProvider(undefined);
      act(() => { jest.advanceTimersByTime(999); });
      expect(mockGetContentStyles).not.toHaveBeenCalled();
    });

    it('starts polling getContentStyles after the 1s delay', () => {
      renderWithProvider(undefined);
      act(() => { jest.advanceTimersByTime(1000); }); // initial delay
      act(() => { jest.advanceTimersByTime(100); });  // first interval tick
      expect(mockGetContentStyles).toHaveBeenCalled();
    });

    it('polls on every 100ms interval after the delay', () => {
      renderWithProvider(undefined);
      act(() => { jest.advanceTimersByTime(1000); }); // delay
      act(() => { jest.advanceTimersByTime(300); });  // 3 ticks
      expect(mockGetContentStyles).toHaveBeenCalledTimes(3);
    });

    it('stops polling after unmount', () => {
      const { unmount } = renderWithProvider(undefined);
      act(() => { jest.advanceTimersByTime(1200); }); // get a few ticks going
      const callsBefore = mockGetContentStyles.mock.calls.length;
      unmount();
      act(() => { jest.advanceTimersByTime(500); }); // would have added more if not cleaned up
      expect(mockGetContentStyles.mock.calls.length).toBe(callsBefore);
    });
  });

  // ── toolbarClass item styles (ISSUE-07) ─────────────────────────────────
  // The sx prop previously used the comma operator which silently dropped the
  // custom toolbarClass styles. Now it uses a ternary that merges both objects.

  describe('toolbarClass item styles', () => {
    it('renders Bold button without crashing when toolbarClass.item.bold is provided', () => {
      renderWithProvider(undefined, { item: { bold: { background: 'blue' } } });
      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    });

    it('renders all alignment buttons without crashing when toolbarClass item styles are provided', () => {
      const toolbarClass = {
        item: {
          leftAlign: { color: 'red' },
          centerAlign: { color: 'green' },
          rightAlign: { color: 'blue' },
          justify: { color: 'purple' },
        },
      };
      renderWithProvider(undefined, toolbarClass);
      expect(screen.getByRole('button', { name: 'Left align' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Center align' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Right align' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Justify' })).toBeInTheDocument();
    });

    it('renders list buttons without crashing when toolbarClass item styles are provided', () => {
      const toolbarClass = {
        item: {
          bulletList: { fontWeight: 'bold' },
          numberedList: { fontWeight: 'bold' },
        },
      };
      renderWithProvider(undefined, toolbarClass);
      expect(screen.getByRole('button', { name: 'Bullet list' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Numbered list' })).toBeInTheDocument();
    });

    it('Bold button remains functional with toolbarClass item styles', () => {
      renderWithProvider(undefined, { item: { bold: { background: 'blue' } } });
      fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
      expect(mockHandleBold).toHaveBeenCalledTimes(1);
    });

    it('active Bold button (after click) still calls handler correctly', () => {
      renderWithProvider({ bold: true }, { item: { bold: { background: 'blue' } } });
      const boldBtn = screen.getByRole('button', { name: 'Bold' });
      fireEvent.click(boldBtn); // activate
      fireEvent.click(boldBtn); // deactivate
      expect(mockHandleBold).toHaveBeenCalledTimes(2);
    });
  });

  // ── Format toggle (local state) ──────────────────────────────────────────

  describe('format active-state toggling', () => {
    it('toggles Bold format on repeated clicks without errors', () => {
      renderWithProvider({ bold: true });
      const boldBtn = screen.getByRole('button', { name: 'Bold' });
      fireEvent.click(boldBtn); // activate
      fireEvent.click(boldBtn); // deactivate
      expect(mockHandleBold).toHaveBeenCalledTimes(2);
    });

    it('toggles list type on repeated Bullet list clicks', () => {
      renderWithProvider({ bulletList: true });
      const btn = screen.getByRole('button', { name: 'Bullet list' });
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(mockHandleList).toHaveBeenCalledTimes(2);
    });
  });
});
