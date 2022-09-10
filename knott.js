/*
 * Create Element API
 * @param: {String} .... selector
 * @param: {List} ...... props
 * @param: {String}..... style
 * @param: {String} .... text
 * @param: {String} .... html
 * @param: {List} ...... keys
 * @param: {List} ...... data
 * @param: {List} ...... actions
 * @param: {List} ...... tasks
 * @param: {String} .... toggle
 * @param: {List} ...... expand
 * @param: {Bool} ...... vdom
 */
export const craft = (
  selector, {
    props = {},
    style = "",
    text = "",
    html = ``,
    keys = [],
    data = [],
    actions = [],
    tasks = [],
    toggle = "",
    expand = [],
    vdom = ""
  }
) => {
  const virtualElement = Object.create(null);
  Object.assign(virtualElement, {
    selector, props, style, text, html, keys,
    data, actions, tasks, toggle, expand, vdom
  });
  return virtualElement;
};

/*
 * Mount (LifeCycle) API
 * Deliver real (DOM) elements on the page visible on browser viewport.
 * Note: New virtual node has to be mounted with id="".
 * @param: {String} .... target element id
 * @param: {List} ...... virtual node (See, Create Element API)
 */
export const mount = (id, virtualNode) => {
  let addElement = document.getElementById(id);
  if (addElement) {
    addElement.replaceWith(virtualNode);
    return virtualNode;
  }
};

/*
 * UnMount (LifeCycle) API
 * Remove child (DOM) element from the page invisible on browser
 * viewport.
 * @param: {String} .... target element id
 */
export const unmount = (id) => {
  let removeElement = document.getElementById(id);
  if (removeElement) {
    removeElement.remove();
  }
};

/*
 * Render API
 * Render virtual (DOM) elements into real (DOM) elements.
 * @param: {List} .... virtual nodes (See, Create Element API)
 */
const renderElement = ({
  selector, props, style, text, html, keys,
  data, actions, tasks, toggle, expand, vdom
}) => {
  const $element = document.createElement(selector);

  for (const [pKey, pValue] of Object.entries(props)) {
    $element.setAttribute(pKey, pValue);
  }

  if (typeof style === "string") { $element.cssText = style; }

  if (typeof text === "string") { $element.innerText = text; }

  if (html) { $element.innerHTML = html; }

  if (keys) {
    keys.forEach((k) => {
      if (data) {
        data.forEach((i) => {
          const t = document.createElement("div");
          t.innerHTML = `${i[k]}`;
          $element.appendChild(t);
        });
      }
    });
  }

  if (actions) {
    actions.map(([mode, type, event]) => {
      if (mode === "add") {
        $element.addEventListener(type, event);
      }
      if (mode === "addWindow") {
        window.addEventListener(type, event);
      }
      if (mode === "remove") {
        $element.removeEventListener(type, event);
      }
      if (mode === "removeWindow") {
        window.removeEventListener(type, event);
      }
    });
  }

  // TODO: tasks

  if (toggle) {
    $element.addEventListener("click", () => {
      const toggleElement = document.getElementById(toggle);
      if (toggleElement.style.display === "none") {
        toggleElement.style.display = "block";
        // fix missing element styles
        toggleElement.removeAttribute("style");
      } else {
        toggleElement.style.display = "none";
      }
    });
  }

  // virtual DOM element properties
  if (vdom === true) {
    console.log("[knott]", $element);
  }
  // expand children node
  for (const child of expand) {
    $element.appendChild(render(child));
  }
  return $element;
};

export const render = (virtualNode) => {
  if (typeof virtualNode === "string") {
    return document.createTextNode(virtualNode);
  }
  return renderElement(virtualNode);
};

/*
 * Diff API
 * Calculate the differences between the two virtual trees.
 * @param: {List} .... old virtual node
 * @param: {List} .... new virtual node
 */
const compress = (xs, ys) => {
  const compressed = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    compressed.push([xs[i], ys[i]]);
  }
  return compressed;
};

const diffProps = (oldProps, newProps) => {
  const patches = [];
  for (const [key, value] of Object.entries(newProps)) {
    patches.push(($node) => {
      $node.setAttribute(key, value);
      return $node;
    });
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      patches.push(($node) => {
        $node.removeAttribute(key);
        return $node;
      });
    }
  }
  return ($node) => {
    for (const patch of patches) {
      patch($node);
    }
    return $node;
  };
};

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });
  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }
  return ($parent) => {
    for (const [patch, $child] of compress(childPatches, $parent.childNodes)) {
      patch($child);
    }
    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
};

export const diff = (oldVTree, newVTree) => {
  if (newVTree === undefined) {
    return ($node) => {
      $node.remove();
      return undefined;
    };
  }
  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      return ($node) => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return ($node) => $node;
    }
  }
  if (oldVTree.selector !== newVTree.selector) {
    return ($node) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchProps = diffProps(oldVTree.props, newVTree.props);
  const patchChildren = diffChildren(oldVTree.expand, newVTree.expand);

  return ($node) => {
    patchProps($node);
    patchChildren($node);
    return $node;
  };
};

/*
 * Register Service Worker (PWA)
 * Use SW to cache static assets for offline access.
 * @params {List} .... set `true` to enable, see file `sw.js`
 */
export const pwa = (swOption) => {
  if(swOption === true) {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then((res) => console.log("knott service worker registered"))
          .catch((err) => console.log("knott service worker not registered", err));
      });
    }
  }
}

/*
 * DOM CSS Utilities
 * A functional low-level DOM CSS styler without CSS payload.
 * @params {Bool} .... set `true` to enable DOM styling
 */
export const style = (enableDomStyle) => {
  const cssUtilities = {
    top: "top", bottom: "bottom", left: "left", right: "right",
    width: "width", height: "height", padding: "padding",
    paddingTop: "paddingTop", paddingBottom: "paddingBottom",
    paddingLeft: "paddingLeft", paddingRight: "paddingRight",
    margin: "margin", marginTop: "marginTop",
    marginBottom: "marginBottom", marginLeft: "marginLeft",
    marginRight: "marginRight", borderRadius: "borderRadius",
    fontSize: "fontSize", lineHeight: "lineHeight",
    screenHeight: "height", textColor: "color",
    bgColor: "backgroundColor", fontWeight: "fontWeight",
    display: "display", flex: "flex", justifyContent: "justifyContent",
    alignItems: "alignItems", flexWrap: "flexWrap",
    flexDirection: "flexDirection", filter: "filter",
    position: "position", overflow: "overflow", listStyle: "listStyle",
    objectFit: "objectFit", objectPosition: "objectPosition",
    borderWidth: "borderWidth", borderStyle: "borderStyle",
    borderColor: "borderColor", textAlign: "textAlign",
    fontStyle: "fontStyle",
  };

  const observer = new MutationObserver((mutations, observer2) => {
    mutations.forEach((mutation) => {
      const target = mutation.target;
      target.lastClassName !== target.className && styleElement(target);
      target.lastClassName = target.className;
    });
  });

  const styleElement = (element) => {
    const classNames = element && element.className && element.className.split(" ") || [];
    classNames.forEach((className) => {
      const style2 = generateDomStyle(className);
      style2 && style2.key && (element.style[style2.key] = style2.value);
    });
  };

  const generateDomStyle = (className) => {
    // utilities without em, rem, px units
    const notUnitUtils = [
      "textColor", "bgColor", "display", "justifyContent",
      "alignItems", "flexWrap", "flexDirection", "screenHeight",
      "filter", "position", "objectFit", "objectPosition",
      "borderwidth", "borderStyle", "borderColor", "textAlign",
      "fontStyle", "listStyle",
    ];

    const classNameObjects = className.match(/(^[a-z-A-Z]{1,23})-([a-z-0-9(%)%]{1,23})?/);
    const cssProperty = classNameObjects && cssUtilities[classNameObjects[1]];
    const utilClassName = classNameObjects[1];
    const utilClassValue = classNameObjects[2];
    const unit = (classNameObjects && classNameObjects[3]) || "px" || "em";
    // filter not unit utils
    if (notUnitUtils.indexOf(utilClassName) > -1) {
      return cssProperty && {
        key: cssProperty,
        value: utilClassValue,
      };
    }
    // otherwise use unit
    return cssProperty && {
      key: cssProperty,
      value: utilClassValue + unit,
    };
  }

  if (enableDomStyle === true) {
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
  }
};

