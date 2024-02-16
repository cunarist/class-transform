// @ts-check

import { Exposed } from "./exposed";

/**
 * Replaces all `Exposed` values with `null` or nested instance.
 * If you've created an instance
 * of a class that includes `Exposed` fields,
 * you must use this function to initialize them.
 * @template T
 * @param {T} instance
 * @returns {T}
 */
export function nullifyExposed(instance) {
  if (instance instanceof Array) {
    const array = [];
    for (const eachObject in instance) {
      array.push(nullifyExposed(eachObject));
    }
    // @ts-ignore
    return array;
  }

  for (const prop in instance) {
    /** @type {string} */
    const property = prop;
    const nested = instance[property];
    if (!(nested instanceof Exposed)) {
      continue;
    }
    const Type = nested.type;
    const isArray = nested.isArray;

    if (isArray) {
      instance[property] = [];
    } else if (Type === Number) {
      instance[property] = null;
    } else if (Type === Boolean) {
      instance[property] = null;
    } else if (Type === String) {
      instance[property] = null;
    } else {
      instance[property] = nullifyExposed(new Type());
    }
  }
  return instance;
}
