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
