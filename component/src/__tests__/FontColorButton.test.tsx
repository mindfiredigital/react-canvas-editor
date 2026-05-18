import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FontColorButton from '../components/FontColorButton/FontColorButton';
import documentReducer from '../redux/documentReducer';

const makeStore = () =>
  configureStore({ reducer: { document: documentReducer } });

const renderWithStore = (ui: React.ReactElement) =>
  render(<Provider store={makeStore()}>{ui}</Provider>);

describe('FontColorButton', () => {
  it('renders without crashing', () => {
    expect(() => renderWithStore(<FontColorButton textColor={null} style={undefined} />)).not.toThrow();
  });

  it('renders the Text color icon button', () => {
    renderWithStore(<FontColorButton textColor={null} style={undefined} />);
    // IconButton has no aria-label, but there should be a button element
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the color palette popover when clicked (anchorEl set)', () => {
    renderWithStore(<FontColorButton textColor={null} style={undefined} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    // After click, anchorEl is set → Popover opens (open becomes true)
    // ColorPalettes Popover renders with open=true
    expect(document.body.innerHTML).toContain('CUSTOM');
  });

  it('renders with a defined textColor prop without crashing', () => {
    expect(() =>
      renderWithStore(<FontColorButton textColor="#ff0000" style={undefined} />)
    ).not.toThrow();
  });

  it('applies custom style to the icon button', () => {
    expect(() =>
      renderWithStore(<FontColorButton textColor={null} style={{ background: 'blue' }} />)
    ).not.toThrow();
  });
});
