import { typography } from "../utilities/typography";
import { layouts } from "../utilities/layouts";
import { interactivity } from "../utilities/interactivity";
import { flex } from "../utilities/flex";
import { backgrounds } from "../utilities/backgrounds";
import { borders } from "../utilities/borders";
import { spacing } from "../utilities/spacing";
import { sizing } from "../utilities/sizing";
import { transitions } from "../utilities/transitions";
import { filters } from "../utilities/filters";

import { filteredUtils } from "../utilities/filteredUtils";

const cssUtilities = {
  ...typography,
  ...layouts,
  ...interactivity,
  ...flex,
  ...backgrounds,
  ...borders,
  ...spacing,
  ...sizing,
  ...transitions,
  ...filters,
};

export const extractStyleObjects = (className) => {
  try {
    const notUnitUtils = [...filteredUtils];
    const classNameObjects = className.match(/(^[a-z-A-Z]{1,23}):([a-z-A-Z-0-9-%-.,(%)]{1,23})?/);
    const cssProperty = classNameObjects && cssUtilities[classNameObjects[1]];
    const utilClassName = classNameObjects[1];
    const utilClassValue = classNameObjects[2];
    const unit = (classNameObjects && classNameObjects[3]) || "px";
    // filter not unit utils
    if (notUnitUtils.indexOf(utilClassName) > -1) {
      return cssProperty && {
        key: cssProperty,
        value: utilClassValue,
      };
    }
    // otherwise use unit
    return cssProperty && {
      key: cssProperty,
      value: utilClassValue + unit,
    };
  } catch(error) {
    return error;
  };
}
