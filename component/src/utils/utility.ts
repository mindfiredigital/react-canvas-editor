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

export const formatDate = (param: number | string) => {
  const date = new Date(param);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // hour12: true, // Set to true for 12-hour format with AM/PM
  };

  return date.toLocaleString("en-US", options).replace("at", "");
};
