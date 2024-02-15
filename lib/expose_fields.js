// @ts-check

import { Exposed } from "./exposed.js";

/**
 * @template T
 * @param {T} object
 * @returns {T}
 */
export function exposeFields(object) {
  if (object instanceof Array) {
    const array = [];
    for (const eachObject in object) {
      array.push(exposeFields(eachObject));
    }
    // @ts-ignore
    return array;
  }

  for (const prop in object) {
    /** @type {string} */
    const property = prop;
    const nested = object[property];
    if (!(nested instanceof Exposed)) {
      continue;
    }
    const Type = nested.type;
    const isArray = nested.isArray;

    if (isArray) {
      object[property] = [];
    } else if (Type === Number) {
      object[property] = null;
    } else if (Type === Boolean) {
      object[property] = null;
    } else if (Type === String) {
      object[property] = null;
    } else {
      object[property] = exposeFields(new Type());
    }
  }
  return object;
}
