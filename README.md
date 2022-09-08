<p align="center">
  <img src="https://raw.githubusercontent.com/louislow81/knott.js/knott-logo.svg" width="200px" alt="Knott JS">
</p>

## A weightless javascript micro web component library for the basic web.

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/knott.svg)](https://badge.fury.io/js/knott)
[![npm downloads](https://img.shields.io/npm/dm/knott.svg)](https://www.npmjs.com/package/knott)

# Introduction

`Knott.JS` is a tiny **Virtual DOM** JavaScript library for creating object-based web components it's called **virtual nodes** with very basic necessary features to build a simple web application or website.

## `craft`

Use `craft()` to create virtual nodes commonly everywhere in the project. It takes a **selector** as a new element, **props** as attributes, **text** as string to put on the document, **html** to add custom _non-virtual-node_ element, optional **actions** as an event listener, **tasks** as custom function calls, and expands the array of children elements in the same node with **expand: [...]**. Read more details below.

```mjs
craft(
  selector, {
    props {
      id: "", 
      class: "",
      style: "",
      // any...
    },
    text: "TEXT",
    html: `<p></p>`,
    data: [{ a: "1" }, { a: "2" }],
    keys: ["A","B"],
    toggle: "target-id",
    actions: [
      [action, event, ()=>{ f(); }],
    ],
    tasks: [ f() ],
    expand: [
      slotComponent,
      customFunction,
      craft(),
    ],
  }
);
```

| Keys | Params | Descriptions |
|:-|:-|:-|
| **selector** | _String_ | create new element (e.g. `<div>`, `<p>`), or semantically elements (e.g. `<profile-image>`, `<profile-avatar/>`). |
| **props** | _List_ {...} | create any attributes (e.g. `alt=""`, `src=""`) as properties to an element. |
| **expand** | _List_ [...] | create child elements with `craft()` in a parent element (e.g. `<div><p><a></a></p></div>`) or includes other **slotComponent** created with `craft()` or **customFunction** calls when component is loaded. |
| **text** | _String_ | create string content to an element (e.g. `<p>Text</p>`). |
| **html** | _String_ | create first-render HTML element to an element, but **text** content will be disabled. |
| **keys** | _List_ [...] | iterate objects in a JSON array append on an element from **data** objects. |
| **data** | _Object_ [...] | add an array JSON object to an element. Use **keys** to select which object to iterate. |
| **actions** | _List_ [...] | create event listener to an element to call function(s) when clicked or onload. |
| **tasks** | _List_ [...] | add on-demand function(s) call when the component is loaded. |
| **toggle** | _String_ | show or hide target component with an element ID. |
| **vdom** | _Boolean_ | add `true` to display virtual node objects in console. |
| **slotComponent** | _function_ | import component file by using `import {...} from "...";`. | 
| **customFunction**| _function_ | import custom function calls. |

## Examples

Create basic component with inline CSS properties.

```mjs
craft("div", props: { style:"color-red" }, text: "Welcome!");
```

```mjs
craft("top-header-container", html: `<div class="...">Welcome!</div>`);
```

Create a component with children element within a parent element.

```mjs
craft("div", // parent
  text: "Parent",
  expand: [ // children
    craft("div", {
      text: "Children",
    }),
  ]
);
```

## Virtual Node

An virtual node with element is rendered into actual document to display on browser is using `render()` and mounted with `mount()` as component taken one element ID.

### Example #1

```mjs
import { craft, mount, render } from "knott";

const vNode = craft(
  "div", {
    props {
      class: "text-xs",
      style: "background:red; color:white",
    },
    text = "This is Text!",
  }
);

// Output as <div id="app">
mount("app", render(vNode));
```

### Example #2

```mjs
import { craft, mount, render } from "knott";

// Output as <div id="app">
mount("app", render(
  craft(
    "div", {
      props {
        class: "text-xs",
        style: "background:red; color:white",
      },
      text = "This is Text!",
    }
  );
));
```
## Create Component

```mjs
// file: component-a.js
import { craft } from "knott";

const largeCard = craft(
  "div", {
    text: "Large Card",
  }
);

export { largeCard };
```

## Import Component

```mjs
// file: main.js
import { craft, mount, render } from "knott";
import { largeCard } from "component-a";

mount("root", render(
  craft("body", {
    props: {
      id: "root",
    },
    expand: [
      largeCard, // imported component as child element in <body id="root">
    ],
  })
));
```

## Event Listener

| Keys | Modes | Events | Calls |
|:-|:-|:-|:-|
| **actions** | add, remove, addWindow, removeWindow | https://developer.mozilla.org/en-US/docs/Web/Events | _Function_ |

```mjs
import { craft } from "knott";

const alertButton = craft(
  "div", {
    text: "Click Me!",
    actions: [
      ["add", "click", ()=>{ alert("Clicked Event") }],
      ["addWindow", "click", ()=>{ alert("Clicked Event") }],
      ["remove", "click", ()=>{ alert("Clicked Event") }],
      ["removeWindow", "click", ()=>{ alert("Clicked Event") }],
    ],
  }
);

export { alertButton };
```

## Mount Component

| Functions | Descriptions |
|:-|:-|
| `mount("id", render(vNode));` | deliver real (DOM) elements on the page visible on browser viewport. **Note:** Virtual node has to be mounted with a target element Id (e.g `<div id="root"></div> or <body id="root"></body>`). |

An example to **display** additional component by using `mount()` when a text clicked with click handler `actions:[...]`.

```mjs
import { craft, mount, render } from "knott";

// main component
const panelA = craft(
  "div", {
    props: {
      id: "idPanelA",
    },
    text: "This is Panel A. Click Me!",
    actions: [
      ["add", "click", ()=> { // or
        mount("idPanelA", render(panelB)); 
      }],
    ],
    tasks: [ // or
      mount("idPanelA", render(panelB))
    ],
  }
);

// to be added
const panelB = craft(
  "div", {
    text: "Panel B is appeared!",
  }
);

export { panelA };
```

## UnMount Component

| Functions | Descriptions |
|:-|:-|
| `unmount("id");` | remove (DOM) element from the page invisible on browser viewport. |

An example to remove component or element node from DOM with `unmount()`.

```mjs
import { craft, mount, unmount, render } from "knott";

// main component
const panelA = craft(
  "div", {
    text: "Click Me to remove Panel B",
    actions: [ // or
      ["add", "click", ()=> { 
        unmount("idPanelB");
      }],
    ],
    tasks: [ // or
      unmount("idPanelB");
    ],
    expand: [
      // to be removed
      craft(
        "div", {
          props: {
            id: "idPanelB", // <= target
          },
          text: "Panel B!",
        }
      );
    ],
  }
);

export { panelA };
```

## Data Binding

```mjs
const newCard = (customCSS, customText) => 
  craft("", {
    props: {
      class: customCSS,
    },
    text: customText,
  });
```

```mjs
const newCard = (customCSS, customText) => 
  craft("", {
    html: `
      <div class=${customCSS}>
        ${customText}
      </div>
    `,
  });
```

## Iteration

| Keys | Params | Descriptions |
|:-|:-|:-|
| **actions** | _List_ [...] | create event listener to an element to call function(s) when clicked or onload. |

```mjs
const images = [
  { url: "https://example.com/example-one.png" },
  { url: "https://example.com/example-two.png" },
];

const logos = () => craft("partner-logos", {
  actions: [
    ["addWindow", "load", ()=> {
      // loop
      images.forEach((item) => {
        const l = document.createElement("div");
        l.innerHTML = `
          <img 
            class="height-6 width-full filter drop-shadow-md" 
            src="${item.url}"
            alt=""
            loading="lazy" 
          />
        `;
        document
          .querySelector("partner-logos")
          .appendChild(l);
      });
      //...
    }],
  ]
});
```

## Show/Hide Component with Click Handler

| Keys | Params | Descriptions |
|:-|:-|:-|
| **toggle** | _String_ | show or hide target component with an element ID. |

```mjs
const newButton = craft("button", {
  text: "Click Me!"
  toggle: "modal",
});

const newModal = craft("div", {
  props: {
    id: "modal",
  },
  text: "This is a Modal"
});
```

---

[MIT](https://github.com/louislow81/knottjs/blob/master/LICENSE)
