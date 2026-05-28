import { debounce } from '../utils/utility';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not call the callback immediately', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 300);
    debounced();
    expect(cb).not.toHaveBeenCalled();
  });

  it('calls the callback after the specified wait time', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 300);
    debounced();
    jest.advanceTimersByTime(300);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the callback', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 100);
    debounced('a', 'b', 42);
    jest.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledWith('a', 'b', 42);
  });

  it('resets the timer when called again before the wait elapses', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 300);
    debounced();
    jest.advanceTimersByTime(200);
    debounced(); // reset timer
    jest.advanceTimersByTime(200);
    expect(cb).not.toHaveBeenCalled(); // 200ms since last call, not yet 300ms
    jest.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('only calls the callback once when invoked rapidly', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 300);
    debounced();
    debounced();
    debounced();
    jest.advanceTimersByTime(300);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('preserves `this` context when called', () => {
    const obj = {
      value: 42,
      getValue: jest.fn(function (this: any) {
        return this.value;
      }),
    };
    const debounced = debounce(obj.getValue, 100);
    debounced.call(obj);
    jest.advanceTimersByTime(100);
    expect(obj.getValue).toHaveBeenCalledTimes(1);
  });

  it('can be called multiple times with gaps between calls', () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 200);
    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);
    expect(cb).toHaveBeenCalledTimes(2);
  });
});
