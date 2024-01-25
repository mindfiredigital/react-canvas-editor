/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (cb: any, wait: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(context, args);
    }, wait);
  };
};
