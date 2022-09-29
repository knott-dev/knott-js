export const toggleById = (id, classlist) => {
  classlist.forEach((item) => {
    document
      .getElementById(id)
      .classList.toggle(item);
 });
};

export const toggleBySelector = (selector, classlist) => {
  classlist.forEach((item) => {
    document
      .querySelector(selector)
      .classList.toggle(item);
 });
};

export const toggleByIdSelector = (id, selector, classlist) => {
  classlist.forEach((item) => {
    document
      .getElementById(id)
      .querySelector(selector)
      .classList.toggle(item);
 });
};
