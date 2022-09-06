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
        return;
      }
      if (mode === "addWindow") {
        window.addEventListener(type, event);
        return;
      }
      if (mode === "remove") {
        $element.removeEventListener(type, event);
        return;
      }
      if (mode === "removeWindow") {
        window.removeEventListener(type, event);
        return;
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
 * Service Worker
 */
export const sw = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./sw.js")
        .then((res) => console.log("[knott] service worker registered"))
        .catch((err) => console.log("[knott] service worker not registered", err));
    });
  }
}

