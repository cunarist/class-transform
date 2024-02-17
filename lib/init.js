import { Exposed } from "./exposed.js";

/**
 * Initializes all `Exposed` fields with its default value.
 * If you've created an instance
 * of a class that includes `Exposed` fields,
 * you must use this function to initialize it.
 * @template T
 * @param {T} instance
 * @returns {T}
 */
export function initExposed(instance) {
  /** @type {any} */
  let instanceAny = instance;
  if (instance instanceof Array) {
    const array = [];
    for (const eachObject in instance) {
      array.push(initExposed(eachObject));
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
      instance[property] = exposed.defaultValue;
    } else {
      instance[property] = initExposed(new Type());
    }
  }
  return instance;
}
