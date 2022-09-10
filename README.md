<p align="center">
  <img src="https://raw.githubusercontent.com/louislow81/knott.js/e832386075591d7ad4e42b7703e46836d2ca5988/knott-logo.svg" width="200px" alt="Knott JS">
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
| **vdom** | _Boolean_ | set `true` to display virtual node objects in console. |
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
const css = "font-bold";
const text = "Welcome to Knott JS!";

const newCard = (css, text) => 
  craft("div", {
    props: {
      class: css,
    },
    text: text,
  });
```

```mjs
const css = "font-bold";
const text = "Knott JS!";

const newCard = (css, text) => 
  craft("div", {
    props: {
      class: `classA classB classC ${css}`,
    },
    text: `Welcome to ${text}`,
  });
```

```mjs
const css = "font-bold";
const text = "Knott JS!";

const newCard = (css, text) => 
  craft("div", {
    html: `
      <div class=${css}>
        ${text}
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
## DOM Styling

Set `style()` to **true** to enable functional low-level CSS styling without writing CSS and no CSS payload. Up to 40 different type of useful utilities and each utility has countless modifier that allows you to fine-tuning the utility more precisely.

| Utility | CSS Class | DOM Styles | Usage |
|:-|:-|:-|:-|
|1| top | _style.top_ | top-**{px}** |
|2| bottom | _style.bottom_ | bottom-**{px}** |
|3| left | _style.left_ | left-**{px}** |
|4| right | _style.right_ | right-**{px}** |
|5| padding | _style.padding_ | padding-**{px}** |
|6| paddingTop | _style.paddingTop_ | paddingTop-**{px}** |
|7| paddingBottom | _style.paddingBottom_ | paddingBottom-**{px}** |
|8| paddingLeft | _style.paddingLeft_ | paddingLeft-**{px}** |
|9| paddingRight | _style.paddingRight_ | paddingRight-**{px}** |
|10| margin | _style.margin_ | margin-**{px}** |
|11| marginTop | _style.marginTop_ | marginTop-**{px}** |
|12| marginBottom | _style.marginBottom_ | marginBottom-**{px}** |
|13| marginLeft | _style.marginLeft_ | marginLeft-**{px}** |
|14| marginRight | _style.marginRight_ | marginRight-**{px}** |
|15| height | _style.height_ | height-**{px}** |
|16| width | _style.width_ | width-**{px}** |
|17| screenHeight | _style.height_ | screenHeight-**{vh,%}** |
|18| fontSize | _style.fontSize_ | fontSize-**{px}** |
|19| fontWeight | _style.fontWeight_ | fontWeight-**{n}** |
|20| fontStyle | _style.fontStyle_ | fontStyle-**{n}** |
|21| textColor | _style.color_ | textColor-**{n}** |
|22| bgColor | _style.backgroundColor_ | bgColor-**{n}** |
|23| borderRadius | _style.borderRadius_ | borderRadius-**{n}** |
|24| lineHeight | _style.lineHeight_ | lineHeight-**{n}** |
|25| display | _style.display_ | display-**{n}** |
|26| flex | _style.flex_ | flex-**{n}** |
|27| justifyContent | _style.justifyContent_ | justifyContent-**{n}** |
|28| alignItems | _style.alignItems_ | alignItems-**{n}** |
|29| flexWrap | _style.flexWrap_ | flexWrap-**{n}** |
|30| flexDirection | _style.flexDirection_ | flexDirection-**{n}** |
|31| filter | _style.filter_ | filter-**{n}** |
|32| position | _style.position_ | position-**{n}** |
|33| overflow | _style.overflow_ | overflow-**{n}** |
|34| listStyle | _style.listStyle_ | listStyle-**{n}** |
|35| objectFit | _style.objectFit_ | objectFit-**{n}** |
|36| objectPosition | _style.objectPosition_ | objectPosition-**{n}** |
|37| borderWidth | _style.borderWidth_ | borderWidth-**{n}** |
|38| borderStyle | _style.borderStyle_ | borderStyle-**{n}** |
|39| borderColor | _style.borderColor_ | borderColor-**{n}** |
|40| textAlign | _style.textAlign_ | textAlign-**{n}** |

```mjs
import { style } from "knott";

const main = craft(
  "body", {
    props: {
      id: "root",
      class: "display-flex justifyContent-center alignItems-center",
    },
    expand: [
      // all the elements here in the child 
      // are centered in the viewport.
    ]
  });

mount("root", render(main));

style(true); // should execute after the `mount()`
```

## Service Worker

Enable [PWA](https://web.dev/learn/pwa/) service worker to store app assets in browser for offline access.

### Example

Import `pwa()` module from `knott` and set parameter to `true`.

```mjs
// @file: app.js
import { pwa } from "knott";

pwa(true);
```
Create a new separate file named `sw.js` at the root of the project directory and, add below lines. Edit **CacheName** and **CacheAssets** to suit your need.

```mjs
// @file: {root_directory}/sw.js
const cacheName = "knott-app-cache-version";

const cacheAssets = [
  "/",
  "/index.html",
  "/assets/app.js",
  "/assets/app.css",
];

// BEYOND THIS LINE, DO NOT EDIT !!!

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(cacheAssets)
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  );
});
```

---

[MIT](https://github.com/louislow81/knottjs/blob/master/LICENSE)

