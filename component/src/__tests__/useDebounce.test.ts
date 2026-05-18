import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('returns the initial value immediately on mount', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('still returns the old value before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );
    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('first');
  });

  it('returns the updated value after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );
    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('second');
  });

  it('resets the timer when the value changes before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );
    rerender({ value: 'b', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    }); // 200ms since 'b' — not debounced
    rerender({ value: 'c', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    }); // 200ms since 'c' — not debounced yet
    expect(result.current).toBe('a');
    act(() => {
      jest.advanceTimersByTime(100);
    }); // 300ms since 'c' — now debounced
    expect(result.current).toBe('c');
  });

  it('does not return intermediate values that change faster than the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );
    rerender({ value: 'b', delay: 500 });
    rerender({ value: 'c', delay: 500 });
    rerender({ value: 'd', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('d'); // Only last value is returned
  });

  it('works with zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'x', delay: 0 } }
    );
    rerender({ value: 'y', delay: 0 });
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current).toBe('y');
  });

  it('works with array values (margin use case)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: any; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: [100, 100, 120, 120], delay: 500 } }
    );
    rerender({ value: [50, 50, 60, 60], delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toEqual([50, 50, 60, 60]);
  });

  it('clears timer on unmount', () => {
    const setStateSpy = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce('value', 500));
    unmount();
    // After unmount, advancing timers should not cause state updates
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // No error about state updates on unmounted component
    expect(result.current).toBe('value');
  });
});
