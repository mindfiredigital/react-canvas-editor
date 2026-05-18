import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FontSizeButton from '../components/FontSizeButton/FontSizeButton';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

const mockIncreaseFontSize = DOMEventHandlers.increaseFontSize as jest.Mock;
const mockDecreaseFontSize = DOMEventHandlers.decreaseFontSize as jest.Mock;
const mockSetSize = DOMEventHandlers.setSize as jest.Mock;

describe('FontSizeButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<FontSizeButton size={16} style={undefined} />)).not.toThrow();
  });

  it('displays the current font size in the text field', () => {
    render(<FontSizeButton size={14} style={undefined} />);
    const input = screen.getByDisplayValue('14');
    expect(input).toBeInTheDocument();
  });

  it('renders the decrease font size button', () => {
    render(<FontSizeButton size={16} style={undefined} />);
    // The Remove icon button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // decrease + increase
  });

  it('calls DOMEventHandlers.decreaseFontSize when decrease button is clicked', () => {
    render(<FontSizeButton size={16} style={undefined} />);
    const [decreaseBtn] = screen.getAllByRole('button');
    fireEvent.click(decreaseBtn);
    expect(mockDecreaseFontSize).toHaveBeenCalledTimes(1);
  });

  it('calls DOMEventHandlers.increaseFontSize when increase button is clicked', () => {
    render(<FontSizeButton size={16} style={undefined} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]); // last button is increase
    expect(mockIncreaseFontSize).toHaveBeenCalledTimes(1);
  });

  it('does not call decreaseFontSize when font size is already 1', () => {
    render(<FontSizeButton size={1} style={undefined} />);
    const [decreaseBtn] = screen.getAllByRole('button');
    fireEvent.click(decreaseBtn);
    expect(mockDecreaseFontSize).not.toHaveBeenCalled();
  });

  it('does not call increaseFontSize when font size is already 72', () => {
    render(<FontSizeButton size={72} style={undefined} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(mockIncreaseFontSize).not.toHaveBeenCalled();
  });

  it('calls DOMEventHandlers.setSize when the text field value changes', () => {
    render(<FontSizeButton size={16} style={undefined} />);
    const input = screen.getByDisplayValue('16');
    fireEvent.change(input, { target: { value: '24' } });
    expect(mockSetSize).toHaveBeenCalledWith(24);
  });

  it('opens font size dropdown when text field is clicked', () => {
    render(<FontSizeButton size={16} style={undefined} />);
    const input = screen.getByDisplayValue('16');
    fireEvent.click(input);
    // Dropdown should be visible — contains common font sizes
    expect(screen.getByText('16')).toBeInTheDocument();
  });

  it('selects a font size from the dropdown and calls setSize', () => {
    render(<FontSizeButton size={16} style={undefined} />);
    const input = screen.getByDisplayValue('16');
    fireEvent.click(input); // open dropdown
    // Click on a size option (e.g., 24)
    const option = screen.getAllByText('24')[0];
    fireEvent.click(option);
    expect(mockSetSize).toHaveBeenCalledWith(24);
  });

  it('syncs font size with size prop when prop changes', () => {
    const { rerender } = render(<FontSizeButton size={16} style={undefined} />);
    rerender(<FontSizeButton size={24} style={undefined} />);
    expect(screen.getByDisplayValue('24')).toBeInTheDocument();
  });

  it('renders with undefined size and defaults to 16', () => {
    render(<FontSizeButton size={undefined} style={undefined} />);
    expect(screen.getByDisplayValue('16')).toBeInTheDocument();
  });
});
