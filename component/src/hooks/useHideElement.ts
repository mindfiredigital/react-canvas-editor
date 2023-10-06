import { useEffect } from "react";

export const useHideElement = (classNames: string[]) => {
  useEffect(() => {
    classNames.map((className) => {
      const element = document.getElementsByClassName(
        className
      )[0] as HTMLElement;
      if (element) element.style.display = "none";
    });
  });
};
