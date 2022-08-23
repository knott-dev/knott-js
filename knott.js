export const craft = (
  tagName, {
    props = {},
    text = "",
    expand = []
  }
) => {
  const virtualElement = Object.create(null);
  Object.assign(virtualElement, {
    tagName,
    props,
    text,
    expand,
  });
  return virtualElement;
};

// //////////////////////
// //////////////////////

const renderElement = ({
  tagName,
  props,
  text,
  expand
}) => {
  const $element = document.createElement(tagName);
  // set attribute (e.g. src, href, title, alt, etc.)
  for (const [pKey, pValue] of Object.entries(props)) {
    $element.setAttribute(pKey, pValue);
  }

  $element.innerText = text;

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

// //////////////////////
// //////////////////////

export const mount = (virtualNode, id) => {
  let app = document.getElementById(id);
  app.replaceWith(virtualNode);
  return virtualNode;
};

// //////////////////////
// //////////////////////

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
  for (const [key, value] of Object.entries(newProps)) {
    patches.push(($node) => {
      $node.setAttribute(key, value);
      return $node;
    });
  }
  // removing props
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
    // since childPatches are expecting the $child, not $parent,
    // we cannot just loop through them and call patch($parent)
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
  // let's assume oldVTree is not undefined!
  if (newVTree === undefined) {
    return ($node) => {
      $node.remove();
      // the patch should return the new root node.
      // since there is none in this case,
      // we will just return undefined.
      return undefined;
    };
  }

  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      // could be 2 cases:
      // 1. both trees are string and they have different values
      // 2. one of the trees is text node and
      //    the other one is elem node
      // Either case, we will just render(newVTree)!
      return ($node) => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      // this means that both trees are string
      // and they have the same values
      return ($node) => $node;
    }
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    // we assume that they are totally different and
    // will not attempt to find the differences.
    // simply render the newVTree and mount it.
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

// //////////////////////
// //////////////////////
