// @ts-check

import { Exposed } from "./exposed.js";

/**
 * @template T
 * @param {T} object
 * @returns {T}
 */
export function expose(object) {
  /** @type {Map<string, Exposed>} */
  const fieldMap = new Map();

  for (const prop in object) {
    /** @type {string} */
    const property = prop;
    const nested = object[property];
    if (!(nested instanceof Exposed)) {
      continue;
    }
    fieldMap[property] = nested;
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
      object[property] = expose(new Type());
    }
  }
  return object;
}
