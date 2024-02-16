// @ts-check

import { Exposed } from "./exposed.js";

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
  /** @type {any} */
  let instanceAny = instance;
  if (instance instanceof Array) {
    const array = [];
    for (const eachObject in instance) {
      array.push(nullifyExposed(eachObject));
    }
    // @ts-ignore
    return array;
  }

  for (const property in instanceAny) {
    const exposed = instance[property];

    if (!(exposed instanceof Exposed)) {
      continue;
    }

    const Type = exposed.type;
    const isArray = exposed.isArray;

    if (Type === null) {
      throw TypeError("Type information not included in `Exposed`");
    }

    if (isArray) {
      instance[property] = [];
    } else if (Type === Number || Type === Boolean || Type === String) {
      instance[property] = null;
    } else {
      instance[property] = nullifyExposed(new Type());
    }
  }
  return instance;
}
