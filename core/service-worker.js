/*
 * Register Service Worker (PWA)
 * Use SW to cache static assets for offline access.
 * @params {List} .... set `true` to enable, see file `sw.js`
 */
export const cache = (enableSW) => {
  if (enableSW === true) {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then((res) => console.log("service worker registered"))
          .catch((err) => console.log("service worker not registered", err));
      });
    }
  }
};