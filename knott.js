/*
 * Create Element API
 * @param: {String} .... tagName
 * @param: {List} ...... props
 * @param: {String} .... text
 * @param: {List} ...... actions
 * @param: {List} ...... expand
 */
export const craft = (
  tagName, { props = {}, text = "", actions = [], expand = [] }
) => {
  const virtualElement = Object.create(null);
  Object.assign(virtualElement, {
    tagName, props, text, actions, expand,
  });
  return virtualElement;
};

/*
 * Render API
 * Render virtual (DOM) elements into real (DOM) elements.
 * @param: {List} .... virtual nodes (See, Create Element API)
 */
const renderElement = (
  { tagName, props, text, actions, expand }
) => {
  // tagName
  const $element = document.createElement(tagName);
  // props (attributes)
  for (const [pKey, pValue] of Object.entries(props)) {
    $element.setAttribute(pKey, pValue);
  }
  // text
  $element.innerText = text;
  // actions
  if (actions) {
    actions.map(([mode, type, event]) => {
      if (mode === "add") {
        $element.addEventListener(type, event);
      }
      if (mode === "remove") {
        $element.removeEventListener(type, event);
      }
    });
  }
  // expand
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
 * Mount (LifeCycle) API
 * Deliver real (DOM) elements on the page visible on browser viewport.
 * Note: New element has to mounted with id="".
 * @param: {List} ...... virtual node (See, Create Element API)
 * @param: {String} .... target element id
 */
export const mount = (virtualNode, id) => {
  let component = document.getElementById(id);
  if (component) {
    component.replaceWith(virtualNode);
    return virtualNode;
  }
};

/*
 * UnMount (LifeCycle) API
 * Remove child (DOM) element from the page invisible on browser viewport.
 * @param: {String} .... target element id
 */
export const unmount = (id) => {
  let target = document.getElementById(id);
  if (target) {
    target.parentNode.removeChild(target);
  }
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
  if (oldVTree.tagName !== newVTree.tagName) {
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
