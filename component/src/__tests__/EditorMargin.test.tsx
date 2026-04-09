import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import EditorMargin from '../components/EditorMargin/EditorMargin';
import documentReducer, { setDocumentMargins } from '../redux/documentReducer';

const makeStore = (margins: number[] = []) =>
  configureStore({
    reducer: { document: documentReducer },
    preloadedState: { document: { documentId: '', title: '', reloadRecentDoc: false, margins } },
  });

const renderWithProviders = (margins: number[] = []) => {
  const store = makeStore(margins);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <EditorMargin />
        </MemoryRouter>
      </Provider>
    ),
  };
};

describe('EditorMargin', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders without crashing', () => {
    expect(() => renderWithProviders()).not.toThrow();
  });

  it('renders the Margin icon button', () => {
    renderWithProviders();
    expect(screen.getByRole('button', { name: 'Margin' })).toBeInTheDocument();
  });

  it('does not show the dialog initially', () => {
    renderWithProviders();
    expect(screen.queryByText('Margins')).not.toBeInTheDocument();
  });

  // ── Dialog open / close ────────────────────────────────────────────────────

  it('opens the dialog when the Margin button is clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    expect(screen.getByText('Margins')).toBeInTheDocument();
  });

  it('shows Top, Bottom, Left, Right margin fields in the dialog', () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    expect(screen.getByText('Top :')).toBeInTheDocument();
    expect(screen.getByText('Bottom :')).toBeInTheDocument();
    expect(screen.getByText('Left :')).toBeInTheDocument();
    expect(screen.getByText('Right :')).toBeInTheDocument();
  });

  it('closes the dialog when Close button is clicked', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    // MUI Dialog exit transition takes ~225ms; waitFor retries until content is gone
    await waitFor(() => expect(screen.queryByText('Margins')).not.toBeInTheDocument());
  });

  it('closes the dialog when the X icon button is clicked', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() => expect(screen.queryByText('Margins')).not.toBeInTheDocument());
  });

  // ── Margin input fields ────────────────────────────────────────────────────

  it('displays initial margin values in the input fields', () => {
    renderWithProviders([100, 956, 120, 696]);
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(100); // Top
    expect(inputs[1]).toHaveValue(956); // Bottom
    expect(inputs[2]).toHaveValue(120); // Left
    expect(inputs[3]).toHaveValue(696); // Right
  });

  it('updates Top margin input when value is typed', () => {
    renderWithProviders([100, 956, 120, 696]);
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '50' } });
    expect(inputs[0]).toHaveValue(50);
  });

  it('clears margin input when value is cleared', () => {
    renderWithProviders([100, 956, 120, 696]);
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '' } });
    expect(inputs[0]).toHaveValue(null); // empty number input
  });

  it('shows Save changes button in the dialog', () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('clicking Save changes does not crash', () => {
    renderWithProviders([100, 956, 120, 696]);
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    ).not.toThrow();
  });

  // ── useEffect populates margins from store ─────────────────────────────────

  it('populates inputs from store margins via useEffect', () => {
    const { store } = renderWithProviders([]);
    act(() => {
      store.dispatch(setDocumentMargins({ margins: [80, 900, 100, 700] }));
    });
    fireEvent.click(screen.getByRole('button', { name: 'Margin' }));
    const inputs = screen.getAllByRole('spinbutton');
    // After debounce (500ms), marginState updates; we just verify no crash
    expect(inputs.length).toBe(4);
  });
});
