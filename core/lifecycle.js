// TODO: Experiemental
export const lifecycle = ({
  data: data,
  state: state,
  component: component,
  beforeMounted: beforeMounted,
  mounted: mounted,
  afterMounted: afterMounted,
  onBeforeUnloaded: onBeforeUnloaded,
  onloaded: onloaded,
  onAfterUnloaded: onAfterUnloaded,
}) => {
  if (typeof data === "object" || typeof data === "array") {
    return data;
  }
  if (typeof state === "object" || typeof data === "array") {
    return state;
  }
  if (typeof component === "function") {
    return component;
  }
  if (typeof beforeMounted === "function") {
    return beforeMounted;
  }
  if (typeof mounted === "function") {
    return mounted;
  }
  if (typeof afterMounted === "function") {
    return afterMounted;
  }
  throw "error!";
};
