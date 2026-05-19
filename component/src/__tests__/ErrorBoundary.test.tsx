import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Suppress console.error output from ErrorBoundary in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

// A component that throws on render when given a prop
const BrokenComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div>Working fine</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Working fine')).toBeInTheDocument();
  });

  it('renders Fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Woops!')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong :(')).toBeInTheDocument();
  });

  it('does not render children when an error is caught', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.queryByText('Working fine')).not.toBeInTheDocument();
  });

  it('renders children with no children provided (empty boundary)', () => {
    expect(() => render(<ErrorBoundary />)).not.toThrow();
  });

  it('calls getDerivedStateFromError — sets hasError true on throw', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow />
      </ErrorBoundary>
    );
    // Fallback is shown, confirming hasError was set to true
    expect(screen.getByText('Woops!')).toBeInTheDocument();
  });

  it('calls componentDidCatch and logs the error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.anything()
    );
  });
});
