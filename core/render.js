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
   * Element Function Call
   * @params {Func} .... usage, tasks: [],
   */
  if (typeof tasks === "function") { return tasks; };
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
