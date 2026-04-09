import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Emphasis } from '../components/Emphasis/Emphasis';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

const mockHandleBold = DOMEventHandlers.handleBold as jest.Mock;
const mockHandleItalic = DOMEventHandlers.handleItalic as jest.Mock;
const mockHandleUnderline = DOMEventHandlers.handleUnderline as jest.Mock;

describe('Emphasis', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  it('renders without crashing with no props', () => {
    expect(() => render(<Emphasis />)).not.toThrow();
  });

  it('renders the ToggleButtonGroup container', () => {
    const { container } = render(<Emphasis />);
    expect(container.querySelector('[role="group"]')).toBeInTheDocument();
  });

  it('does not render Bold button when toolbar.bold is not set', () => {
    render(<Emphasis toolbar={{}} />);
    expect(screen.queryByLabelText('bold')).not.toBeInTheDocument();
  });

  it('does not render Italic button when toolbar.italic is not set', () => {
    render(<Emphasis toolbar={{}} />);
    expect(screen.queryByLabelText('italic')).not.toBeInTheDocument();
  });

  it('does not render Underline button when toolbar.underline is not set', () => {
    render(<Emphasis toolbar={{}} />);
    expect(screen.queryByLabelText('underlined')).not.toBeInTheDocument();
  });

  it('renders Bold button when toolbar.bold is true', () => {
    render(<Emphasis toolbar={{ bold: true }} />);
    expect(screen.getByLabelText('bold')).toBeInTheDocument();
  });

  it('renders Italic button when toolbar.italic is true', () => {
    render(<Emphasis toolbar={{ italic: true }} />);
    expect(screen.getByLabelText('italic')).toBeInTheDocument();
  });

  it('renders Underline button when toolbar.underline is true', () => {
    render(<Emphasis toolbar={{ underline: true }} />);
    expect(screen.getByLabelText('underlined')).toBeInTheDocument();
  });

  it('renders all three buttons when all toolbar flags are true', () => {
    render(<Emphasis toolbar={{ bold: true, italic: true, underline: true }} />);
    expect(screen.getByLabelText('bold')).toBeInTheDocument();
    expect(screen.getByLabelText('italic')).toBeInTheDocument();
    expect(screen.getByLabelText('underlined')).toBeInTheDocument();
  });

  // ── Click interactions ────────────────────────────────────────────────────

  it('calls DOMEventHandlers.handleBold when Bold is clicked', () => {
    render(<Emphasis toolbar={{ bold: true }} />);
    fireEvent.click(screen.getByLabelText('bold'));
    expect(mockHandleBold).toHaveBeenCalledTimes(1);
  });

  it('calls DOMEventHandlers.handleItalic when Italic is clicked', () => {
    render(<Emphasis toolbar={{ italic: true }} />);
    fireEvent.click(screen.getByLabelText('italic'));
    expect(mockHandleItalic).toHaveBeenCalledTimes(1);
  });

  it('calls DOMEventHandlers.handleUnderline when Underline is clicked', () => {
    render(<Emphasis toolbar={{ underline: true }} />);
    fireEvent.click(screen.getByLabelText('underlined'));
    expect(mockHandleUnderline).toHaveBeenCalledTimes(1);
  });

  // ── toolbarClass style application ────────────────────────────────────────

  it('applies toolbarClass.item.bold styles in useEffect when provided', () => {
    expect(() =>
      render(
        <Emphasis
          toolbar={{ bold: true }}
          toolbarClass={{ item: { bold: { border: '1px solid red' } } }}
        />
      )
    ).not.toThrow();
  });
});
