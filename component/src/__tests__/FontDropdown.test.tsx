import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FontDropdown from '../components/Dropdown/FontDropdown';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';
import { FONTS } from '../utils/constant';

const mockHandleFontFamily = DOMEventHandlers.handleFontFamily as jest.Mock;

describe('FontDropdown', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<FontDropdown />)).not.toThrow();
  });

  it('renders a select button (MUI Select uses role="button" with aria-label)', () => {
    render(<FontDropdown />);
    // FontDropdown uses inputProps={{ "aria-label": "font family" }}
    expect(screen.getByRole('button', { name: 'font family' })).toBeInTheDocument();
  });

  it('displays Arial as the default selected font', () => {
    render(<FontDropdown />);
    expect(screen.getByText('Arial')).toBeInTheDocument();
  });

  it('renders font options from the FONTS enum', () => {
    render(<FontDropdown />);
    // MenuItems are only in the DOM when the Select is open
    fireEvent.mouseDown(screen.getByRole('button', { name: 'font family' }));
    Object.values(FONTS).forEach((fontName) => {
      expect(screen.getByRole('option', { name: fontName })).toBeInTheDocument();
    });
  });

  it('calls DOMEventHandlers.handleFontFamily when a font is selected', () => {
    render(<FontDropdown />);
    // Open the Select then click an option
    fireEvent.mouseDown(screen.getByRole('button', { name: 'font family' }));
    fireEvent.click(screen.getByRole('option', { name: FONTS.CALIBRI }));
    expect(mockHandleFontFamily).toHaveBeenCalledWith(FONTS.CALIBRI);
  });

  it('updates displayed font after selection', () => {
    render(<FontDropdown />);
    fireEvent.mouseDown(screen.getByRole('button', { name: 'font family' }));
    fireEvent.click(screen.getByRole('option', { name: FONTS.GEORGIA }));
    // After selection the combobox displays the selected font
    expect(screen.getAllByText(FONTS.GEORGIA).length).toBeGreaterThanOrEqual(1);
  });
});
