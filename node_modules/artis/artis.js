/*
 * Artis Utilities API
 * A functional low-level virtual CSS without CSS payload.
 * Inspired by Virtual DOM.
 * @params {Bool} .... set `true` to enable
 */
import { styleElement } from "./core/style-element";
import { observer } from "./core/observer";

export const design = (initStyle) => {

  if (initStyle === true) {

    const scope = window.document;
    const elements = scope.getElementsByTagName("*");

    for (let i in elements) {

      const element = elements[i];

      if (typeof element === "object") {
        styleElement(element);
        observer.observe(element, {
          attributes: true,
          attributeFilter: ["class"]
        });
      }
    }
    console.log("[artis] is running");
  }
};
