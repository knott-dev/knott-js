import { extractStyleObjects } from "./extract-style-objects";

export const styleElement = (element) => {
  const classNames = element && element.className && element.className.split(" ") || [];
  classNames.forEach((className) => {
    const cssObject = extractStyleObjects(className);
    return cssObject && cssObject.key && (element.style[cssObject.key] = cssObject.value);
  });
};
