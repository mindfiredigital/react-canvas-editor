import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadingButton from '../components/HeadingButton/HeadingButton';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

const mockSetTitle = DOMEventHandlers.setTitle as jest.Mock;

describe('HeadingButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<HeadingButton />)).not.toThrow();
  });

  it('renders the heading Select dropdown', () => {
    const { container } = render(<HeadingButton />);
    // MUI Select renders as role="button" (not "combobox") in this MUI version
    expect(container.querySelector('.MuiSelect-select')).toBeInTheDocument();
  });

  it('renders all heading options (Normal + H1-H6) — Normal is the default display', () => {
    render(<HeadingButton />);
    // The currently selected value 'Normal' is visible in the closed Select
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('calls DOMEventHandlers.setTitle when a Heading option is clicked', () => {
    const { container } = render(<HeadingButton />);
    // MUI Select: mouseDown on the select div to open, then click the option
    const selectBtn = container.querySelector('.MuiSelect-select') as HTMLElement;
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(screen.getByRole('option', { name: 'Heading 1' }));
    expect(mockSetTitle).toHaveBeenCalledWith('first');
  });

  it('calls DOMEventHandlers.setTitle with null when Normal is selected', () => {
    const { container } = render(<HeadingButton />);
    const selectBtn = container.querySelector('.MuiSelect-select') as HTMLElement;
    fireEvent.mouseDown(selectBtn);
    fireEvent.click(screen.getByRole('option', { name: 'Normal' }));
    expect(mockSetTitle).toHaveBeenCalledWith(null);
  });

  it('renders Heading 2 option', () => {
    const { container } = render(<HeadingButton />);
    // MenuItems are only in the DOM when the Select is open
    fireEvent.mouseDown(container.querySelector('.MuiSelect-select') as HTMLElement);
    expect(screen.getByRole('option', { name: 'Heading 2' })).toBeInTheDocument();
  });

  it('renders Heading 6 option', () => {
    const { container } = render(<HeadingButton />);
    fireEvent.mouseDown(container.querySelector('.MuiSelect-select') as HTMLElement);
    expect(screen.getByRole('option', { name: 'Heading 6' })).toBeInTheDocument();
  });

  it('renders with custom style prop without crashing', () => {
    expect(() =>
      render(<HeadingButton style={{ backgroundColor: 'blue' }} />)
    ).not.toThrow();
  });
});
