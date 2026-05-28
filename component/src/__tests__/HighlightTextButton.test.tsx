import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HighlightTextButton from '../components/HighlightTextButton/HighlightTextButton';
import documentReducer from '../redux/documentReducer';

const makeStore = () =>
  configureStore({ reducer: { document: documentReducer } });

const renderWithStore = (ui: React.ReactElement) =>
  render(<Provider store={makeStore()}>{ui}</Provider>);

describe('HighlightTextButton', () => {
  it('renders without crashing', () => {
    expect(() =>
      renderWithStore(<HighlightTextButton color={null} style={undefined} />)
    ).not.toThrow();
  });

  it('renders an icon button', () => {
    renderWithStore(<HighlightTextButton color={null} style={undefined} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the color palette when clicked', () => {
    renderWithStore(<HighlightTextButton color={null} style={undefined} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(document.body.innerHTML).toContain('CUSTOM');
  });

  it('renders with a defined color prop without crashing', () => {
    expect(() =>
      renderWithStore(<HighlightTextButton color="#ffff00" style={undefined} />)
    ).not.toThrow();
  });

  it('applies custom style without crashing', () => {
    expect(() =>
      renderWithStore(
        <HighlightTextButton color={null} style={{ border: '1px solid red' }} />
      )
    ).not.toThrow();
  });
});
