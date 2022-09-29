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