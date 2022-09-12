/*
 * Router API
 * @param: {String} ...... path as page url
 * @param: {String} ...... template id or page title
 * @param: {Function} .... controller of template function
 */
// store route hash
const routes = {};

// route register
export const route = (path, templateId, controller) => {
  try {
    routes[path] = {
      templateId: templateId,
      controller: controller
    };
  }
  catch (error) { return error; }
}

// route initializer
export const router = () => {
  const routeWatcher = () => {
    try {
      let templateUrl = location.hash.slice(1) || '/';
      let route = routes[templateUrl];
      let templateTitle = route.templateId;
      document.title = templateTitle;
      let templateVNode = route.controller;
      mount("root", render(templateVNode));
      // init DOM style
      style(true);
    }
    catch (error) { return error; }
  }
  window.addEventListener('hashchange', routeWatcher);
  window.addEventListener('load', routeWatcher);
}
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
 * @param: {List} ...... hover
 * @param: {List} ...... expand
 * @param: {Bool} ...... vdom
 */
export const craft = (
  selector, {
    props = {},
    style = "",
    text = "",
    // options
    actions = [],
    tasks = [],
    toggle = "",
    hover = [],
    vdom = "",
    // data
    keys = [],
    data = [],
    // child
    html = ``,
    expand = [],
  }
) => {
  const virtualElement = Object.create(null);
  Object.assign(virtualElement, {
    selector, props, style, text,
    // options
    actions, tasks, toggle, hover, vdom,
    // data
    keys, data,
    // child
    html, expand,
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
  let targetElement = document.getElementById(id);
  if (targetElement) {
    targetElement.replaceWith(virtualNode);
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
  selector, props, style, text,
  // options
  actions, tasks, toggle, hover, vdom,
  // data
  keys, data,
  // child
  html, expand,
}) => {
  const $element = document.createElement(selector);
  /*
   * Element Attributes
   * @params {List} .... usage, props: { class: `` }
   * @note: use `` for data binding
   */
  for (const [pKey, pValue] of Object.entries(props)) {
    $element.setAttribute(pKey, pValue);
  }
  /*
   * Element Style
   * @params {String} .... usage, style: ``,
   * @note: use `` for data binding
   */
  if (typeof style === "string") { $element.cssText = style; }
  /*
   * Element Text
   * @params {String} .... usage, text: ``,
   * @note: use `` for data binding
   */
  if (typeof text === "string") { $element.innerText = text; }
  /*
   * Element Child HTML
   * @params {String} .... usage, html: ``,
   * @note: use `` for data binding
   */
  if (html) { $element.innerHTML = html; }
  /*
   * (Element Child) Object Keys
   * @params {List} ...... object ref. of `data: [{...}]`
   */
  if (keys) {
    keys.forEach((k) => {
      if (data) {
        data.forEach((i) => {
          const ky = document.createElement("div")
          ky.innerHTML = `${i[k]}`;
          $element.appendChild(ky);
        });
      }
    });
  }
  /*
   * Element Actions
   * @params {mode} ...... event mode
   * @params {type} ...... event listener
   * @params {event} ..... function calls
   */
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
  /*
   * Element Toggle
   * @params {id} ...... element id
   */
  if (toggle) {
    $element.addEventListener("click", () => {
      const t = document.getElementById(toggle);
      if (t.style.display === "none") {
        t.style.display = "block";
        // fix missing element styles
        t.removeAttribute("style");
      } else {
        t.style.display = "none";
      }
    });
  }
  /*
   * Element Hover
   * @params {id} .......... element id
   * @params {mode} ........ set `block` or `visible` style
   * @params {opacity} ..... value 0.9 to 1
   * @params {duration} .... transition time 0.1s to 1s
   */
  if (hover) {
    hover.map(([id, mode = "block", opacity = "0.6", duration = "0.3s"]) => {
      if (mode === "block") {
        $element.addEventListener("mouseover", () => {
          const bmo = document.getElementById(id);
          bmo.style.display = mode;
          bmo.style.opacity = opacity;
          bmo.style.transition = duration;
        });
        $element.addEventListener("mouseout", () => {
          const bmot = document.getElementById(id);
          bmot.style.opacity = "1";
        });
      }
      if (mode === "visible") {
        $element.addEventListener("mouseover", () => {
          const vmo = document.getElementById(id);
          vmo.style.visibility = mode;
        });
        $element.addEventListener("mouseout", () => {
          const vmot = document.getElementById(id);
          vmot.style.visibility = "hidden";
        });
      }
    });
  }
  /*
   * Tasks (LifeCycle)
   * Custom function call after component is mounted.
   * @params {Func} ... function call
   */
  // TODO: is-mounted, before-mounted, after-mounted
  if (typeof tasks === "function") { return tasks; }
  /*
   * Element DOM Properties
   * @params {Bool} ...... set `true` to display on console
   */
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

  // setting newProps
  for (const [kk, vv] of Object.entries(newProps)) {
    patches.push($node => {
      $node.setAttribute(kk, vv);
      return $node;
    });
  }

  // removing attrs
  for (const kk in oldProps) {
    if (!(kk in newProps)) {
      patches.push($node => {
        $node.removeAttribute(kk);
        return $node;
      });
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node);
    }
    return $node;
  };
};

const diffExpand = (oldVChildren, newVChildren) => {
  const childPatches = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return $parent => {
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
    return $node => {
      $node.remove();
      return undefined;
    }
  }

  if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
    if (oldVTree !== newVTree) {
      return $node => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return $node => $node;
    }
  }

  if (oldVTree.selector !== newVTree.selector) {
    return $node => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchProps = diffProps(oldVTree.props, newVTree.props);
  const patchExpand = diffExpand(oldVTree.expand, newVTree.expand);

  return $node => {
    patchProps($node);
    patchExpand($node);
    return $node;
  };
};
/*
 * Register Service Worker (PWA)
 * Use SW to cache static assets for offline access.
 * @params {List} .... set `true` to enable, see file `sw.js`
 */
export const pwa = (enableSW) => {
  if (enableSW === true) {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then((res) => console.log("service worker registered"))
          .catch((err) => console.log("service worker not registered", err));
      });
    }
  }
}

/*
 * DOM CSS Utilities API
 * A functional low-level DOM CSS styler without CSS payload.
 * @params {Bool} .... set `true` to enable DOM styling
 */
export const style = (enableDomStyle) => {
  const typography = {
    font: "fontFamily",
    fontSize: "fontSize",
    fontStyle: "fontStyle",
    fontWeight: "fontWeight",
    lineHeight: "lineHeight",
    listStyle: "listStyle",
    textAlign: "textAlign",
    textColor: "color",
    textDecorationColor: "textDecorationColor",
    textDecoration: "textDecoration",
    textOverflow: "textOverflow",
    textTransform: "textTransform",
    whiteSpace: "whiteSpace",
    wordWrap: "wordWrap",
  };

  const layouts = {
    bottom: "bottom",
    display: "display",
    left: "left",
    objectFit: "objectFit",
    objectPosition: "objectPosition",
    overflow: "overflow",
    position: "position",
    right: "right",
    top: "top",
    visibility: "visibility",
  };

  const interactivity = {
    userSelect: "userSelect",
    cursor: "cursor",
  };

  const flex = {
    alignItems: "alignItems",
    flexDirection: "flexDirection",
    flex: "flex",
    flexWrap: "flexWrap",
    justifyContent: "justifyContent",
  };

  const backgrounds = {
    bgColor: "backgroundColor",
    opacity: "opacity",
  };

  const borders = {
    borderColor: "borderColor",
    borderRadius: "borderRadius",
    borderStyle: "borderStyle",
    borderWidth: "borderWidth",
  };

  const spacing = {
    marginBottom: "marginBottom",
    marginLeft: "marginLeft",
    margin: "margin",
    marginRight: "marginRight",
    marginTop: "marginTop",
    paddingBottom: "paddingBottom",
    paddingLeft: "paddingLeft",
    padding: "padding",
    paddingRight: "paddingRight",
    paddingTop: "paddingTop",
  };

  const sizing = {
    height: "height",
    width: "width",
    xHeight: "height",
    xWidth: "width",
  };

  const others = {
    filter: "filter",
    transition: "transition",
  };

  const cssUtilities = {
    ...typography,
    ...layouts,
    ...interactivity,
    ...flex,
    ...backgrounds,
    ...borders,
    ...spacing,
    ...sizing,
    ...others,
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
    const notUnitUtils = [
      "alignItems",
      "bgColor",
      "borderColor",
      "borderStyle",
      "borderwidth",
      "cursor",
      "display",
      "filter",
      "flexDirection",
      "flexWrap",
      "font",
      "fontStyle",
      "fontWeight",
      "justifyContent",
      "listStyle",
      "objectFit",
      "objectPosition",
      "opacity",
      "position",
      "textAlign",
      "textColor",
      "textDecoration",
      "textDecorationColor",
      "textOverflow",
      "textTransform",
      "transition",
      "userSelect",
      "visibility",
      "whiteSpace",
      "wordWrap",
      "xHeight",
      "xWidth",
    ];

    const classNameObjects = className.match(/(^[a-z-A-Z]{1,23})-([a-z-A-Z-0-9-%-.(%)]{1,23})?/);
    const cssProperty = classNameObjects && cssUtilities[classNameObjects[1]];
    const utilClassName = classNameObjects[1];
    const utilClassValue = classNameObjects[2];
    const unit = (classNameObjects && classNameObjects[3]) || "px";
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

