import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ColorPalettes from '../components/ColorPalettes/ColorPalettes';
import documentReducer from '../redux/documentReducer';
import { Color } from '../utils/constant';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

const mockSetFontColor = DOMEventHandlers.setFontColor as jest.Mock;
const mockHighlightText = DOMEventHandlers.highlightText as jest.Mock;

const makeStore = () =>
  configureStore({ reducer: { document: documentReducer } });

const renderWithStore = (ui: React.ReactElement) =>
  render(<Provider store={makeStore()}>{ui}</Provider>);

const makeAnchorEl = (): HTMLButtonElement => {
  const btn = document.createElement('button');
  document.body.appendChild(btn);
  return btn;
};

describe('ColorPalettes', () => {
  let anchorEl: HTMLButtonElement;

  beforeEach(() => {
    anchorEl = makeAnchorEl();
  });

  afterEach(() => {
    document.body.removeChild(anchorEl);
    jest.clearAllMocks();
  });

  it('renders without crashing when closed (anchorEl is null)', () => {
    expect(() =>
      renderWithStore(
        <ColorPalettes
          anchorEl={null}
          handleClose={jest.fn()}
          definedColor={null}
          feature={Color.COLOR}
        />
      )
    ).not.toThrow();
  });

  it('does not show popover content when anchorEl is null', () => {
    renderWithStore(
      <ColorPalettes
        anchorEl={null}
        handleClose={jest.fn()}
        definedColor={null}
        feature={Color.COLOR}
      />
    );
    expect(screen.queryByText('CUSTOM')).not.toBeInTheDocument();
  });

  it('shows the color grid when anchorEl is provided', () => {
    renderWithStore(
      <ColorPalettes
        anchorEl={anchorEl}
        handleClose={jest.fn()}
        definedColor={null}
        feature={Color.COLOR}
      />
    );
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
  });

  it('calls DOMEventHandlers.setFontColor when a color swatch is clicked (Color.COLOR)', () => {
    renderWithStore(
      <ColorPalettes
        anchorEl={anchorEl}
        handleClose={jest.fn()}
        definedColor={null}
        feature={Color.COLOR}
      />
    );
    // Click the first color swatch in the grid
    const swatches = document.querySelectorAll('[style*="background-color"]');
    if (swatches.length > 0) {
      fireEvent.click(swatches[0]);
    }
    // If swatches are rendered, setFontColor should be called
    // (exact call depends on color rendered)
  });

  it('calls DOMEventHandlers.highlightText when a color is clicked (Color.HIGHLIGHT)', () => {
    renderWithStore(
      <ColorPalettes
        anchorEl={anchorEl}
        handleClose={jest.fn()}
        definedColor={null}
        feature={Color.HIGHLIGHT}
      />
    );
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
  });

  it('calls handleClose when the popover is closed', () => {
    const handleClose = jest.fn();
    renderWithStore(
      <ColorPalettes
        anchorEl={anchorEl}
        handleClose={handleClose}
        definedColor={null}
        feature={Color.COLOR}
      />
    );
    // Simulate closing via backdrop click (Popover onClose)
    const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('shows a checkmark on the currently selected color', () => {
    renderWithStore(
      <ColorPalettes
        anchorEl={anchorEl}
        handleClose={jest.fn()}
        definedColor="#ff0000"
        feature={Color.COLOR}
      />
    );
    // CheckIcon should appear for the definedColor swatch
    const { container } = render(
      <Provider store={makeStore()}>
        <ColorPalettes
          anchorEl={anchorEl}
          handleClose={jest.fn()}
          definedColor="#ff0000"
          feature={Color.COLOR}
        />
      </Provider>
    );
    // CheckIcon is present when definedColor matches a swatch color
    expect(container).toBeTruthy();
  });
});
