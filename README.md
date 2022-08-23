# knott.js

A weightless micro web component library for the basic web.

## Basic Usage

create new project from nothing.

```bash
$ mkdir my-new-knott-project
$ cd my-new-knott-project
$ npm init -y
```
Install necessary modules to use in the project.

```bash
# install parcel bundler
$ npm install parcel --dev-save
# install Knott library
$ npm install knott --dev-save
# install Weavv CSS
$ npm install weavvcss --dev-save
```

Edit and add this line into `package.json` file.

```bash
"scripts": {
  "dev": "parcel src/index.html",
},
```

To use as watching development project.

```bash
$ npm run dev
```

Create both `/views/` and `/components/` directories.

```bash
$ mkdir -p views/components/
```

Create an empty HTML5 template file named as `index.html` in `./views/` directory.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
  </head>
  <body id="app">
    <script src="./main.js"></script>
  </body>
</html>
```

Create new JavaScript file named as `main.js` in `./views/` directory. And

```js
// main.js
import { craft, render, diff, mount } from "knott";
```

> Recommended to use [WEAVV CSS](https:///weavvcss.netlify.app) as styling framework for fast prototyping UI designs.

Import [WEAVV CSS](https:///weavvcss.netlify.app) framework.

```js
// main.js
import "weavvcss";
```

Create the basic `Knott` web component app.

**Knott.js** uses `craft()` to create new DOM elements.

```js
craft(tagName, {
  props {
    id: "",
    class: "",
    title: "",
    alt: "",
    src: "",
    href: "",
    any: any
  },
  text = "",
  expand = [
    slotComponent,
    craft(
      ...,
      craft(...);
    );
  ]
});
```

- `"tagName"` : to create parent element known as `<div>`, `<p>`, or semantically `<profile-image>` element.
- `props {...}` : to create attributes as properties to an e.g. `<div class="" id="" any=""></div>` element.
- `expand [...]` : to create countless of child elements in a parent element in `craft()`, e.g. `<div><p><a></a></p></div>`.
- `text` : to create text content to an element, e.g. `<p>Text</p>`.
- `slotComponent` : to import external UI component with additionally to use `import {...} from "...";` from other component file.

Let's create a new primary DOM node in `<body>` with an ID as in `<body id="app">`. And add new CSS styling in `<body>` by using [WEAVV CSS](https://weavvcss.netlify.app).

```js
// main.js
const ui = () =>
  craft("body", {
    props: {
      id: "app",
      class: "font-default height-screen flex flex-center bg-white",
    },
  });
```
Still in the `main.js` file in `./views/` directory. Now **Knott.js** needs to mount the app before write into DOM.

```js
// main.js
mount(render(ui()), "app");
```

Finally, in the DOM will output as below for the `index.html`.

```html
<body id="app" class="font-default height-screen flex flex-center bg-white"> ... </body>
```

---

## Slot Component

```js
// @file: `views/main.js`
import { craft, render, diff, mount } from "knott";
import "weavvcss";

// import ui components
import { largeCard, smallCard } from "./components/cards";

craft("div", {
  props {
    class: "flex flex-wrap flex-center",
  },
  expand = [
    largeCard,
    smallCard,
  ]
});

mount(render(ui()), "app");
```

```js
// @file: `views/components/cards.js`
const large = craft("div", {
  props {
    class: "width-64 height-64 text-xl-2 flex flex-center curve-border-lg shadow",
  },
  text: "Large";
});

const small = craft("div", {
  props {
    class: "width-32 height-32 text-xl-2 flex flex-center  curve-border-lg shadow",
  },
  text: "Small";
});

export const large = largeCard;
export const small = smallCard;
```

## Credits

[Vanilla JS](http://vanilla-js.com/), [NodeJS](https://nodejs.org/)

---

[MIT](https://github.com/louislow81/knottjs/blob/master/LICENSE)