/*
 * Create Element API
 * @param: {String}  tagName
 * @param: {List}    props
 * @param: {String}  text
 * @param: {List}    expand
 *
 * (a) tagName : to create parent element known as <div>, <p>, or
 * semantically elements as <profile-image>, <profile-avatar/> .
 * (b) props : to create attributes as properties to an e.g.
 * <div class="" id="" any=""></div> element.
 * (c) expand : to create countless of child elements in a parent
 * element in craft(), e.g. <div><p><a></a></p></div>.
 * (d) text : to create text content to an element, e.g. <p>Text</p>.
 * (e) slotComponent : to import external UI component with additionally
 * to use `import {...} from "...";` from other component file.
 *
 * USAGE,
 *
 *    craft("tagName", {
 *      props: {
 *        id: "",
 *        class: "",
 *        title: "",
 *        alt: "",
 *        src: "",
 *        href: "",
 *        any: any
 *      },
 *      text: "",
 *      expand: [
 *        slotComponent,
 *        craft(
 *          ...
 *          craft(...);
 *          ...
 *        );
 *        ...
 *      ]
 *    );
 */
export const craft = ( tagName, { props = {}, text = "", expand = [] }) => {
  const virtualElement = Object.create(null);
  Object.assign(virtualElement, { tagName, props, text, expand, });
  return virtualElement;
};

/*
 * Render API
 * Render virtual (DOM) elements into real (DOM) elements.
 *
 * @param: {List}    virtual nodes (See, Create Element API)
 *
 * Usage,
 *
 *    const vNode = () => {
 *      craft("div", {
 *        props: {
 *          class: "css classname",
 *        }
 *        text: "This is a Text!",
 *      });
 *    };
 *
 *    render(vNode());
 */
const renderElement = ({ tagName, props, text, expand }) => {
  const $element = document.createElement(tagName);
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

/*
 * Mount API
 * Deliver real (DOM) elements on the page visible on browser viewport.
 * Note: New element has to mounted with id="".
 *
 * @param: {List}    virtual node (See, Create Element API)
 * @param: {String}  target element id
 *
 * Usage,
 *
 *    const vNode = () => {
 *      craft("div", {
 *        props: {
 *          id: "app",
 *          class: "css-classname",
 *        }
 *        text: "This is a Text!",
 *      });
 *    };
 *
 *    mount(render(vNode()), "app");
 */
export const mount = (virtualNode, id) => {
  let app = document.getElementById(id);
  app.replaceWith(virtualNode);
  return virtualNode;
};

/*
 * Diff API
 * Calculate the differences between the two virtual trees.
 *
 * @param: {List}    old virtual node
 * @param: {List}    new virtual node
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

