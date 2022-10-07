/* Experiemental */

import { mount } from "../core/mount";
import { render } from "../core/render";
import { design } from "https://unpkg.com/artis@1.0.9/artis.js";

/*
 * Router API
 * @param: {String} ...... path as page url
 * @param: {String} ...... template id or page title
 * @param: {Function} .... controller of template function
 */
const routes = {}; // store route hash

// route register
export const route = (path, templateId, controller) => {
  try {
    routes[path] = {
      templateId: templateId,
      controller: controller
    };
  }
  catch (error) { return error; }
};

// route initializer
export const router = (mountElemId = "root") => {
  const routeWatcher = () => {
    try {
      let templateUrl = location.hash.slice(1) || '/';
      let route = routes[templateUrl];

      let templateTitle = route.templateId;
      document.title = templateTitle;

      let masterTemplateVNode = route.controller;
      mount(mountElemId, render(masterTemplateVNode));

      // preload `artis.js` for styling
      design(true);
    }
    catch (error) { return error; }
  }
  window.addEventListener('hashchange', routeWatcher);
  window.addEventListener('load', routeWatcher);
};
