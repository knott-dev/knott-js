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