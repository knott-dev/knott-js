export const observer = new MutationObserver((mutations, observer2) => {
  mutations.forEach((mutation) => {
    const target = mutation.target;
    target.lastClassName !== target.className && styleElement(target);
    target.lastClassName = target.className;
  });
});
