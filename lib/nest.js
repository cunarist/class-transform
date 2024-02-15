// @ts-check

import { Nested } from "./nested.js";

/**
 * @template T
 * @param {T} object
 * @returns {T}
 */
export function nest(object) {
  /** @type {Map<string, Nested>} */
  const fieldMap = new Map();

  for (const prop in object) {
    /** @type {string} */
    const property = prop;
    const nested = object[property];
    if (!(nested instanceof Nested)) {
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
      object[property] = nest(new Type());
    }
  }
  return object;
}
