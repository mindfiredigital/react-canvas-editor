import React from 'react';
import { render, screen } from '@testing-library/react';
import Fallback from '../components/Fallback/Fallback';

describe('Fallback', () => {
  it('renders without crashing', () => {
    expect(() => render(<Fallback />)).not.toThrow();
  });

  it('renders the error heading text', () => {
    render(<Fallback />);
    expect(screen.getByText('Woops!')).toBeInTheDocument();
  });

  it('renders the error description text', () => {
    render(<Fallback />);
    expect(screen.getByText('Something went wrong :(')).toBeInTheDocument();
  });

  it('renders the SVG illustration', () => {
    const { container } = render(<Fallback />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the main-error-page container', () => {
    const { container } = render(<Fallback />);
    expect(container.querySelector('.main-error-page')).toBeInTheDocument();
  });
});
