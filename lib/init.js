import { whileExposing, Exposed } from "./exposed.js";

/**
 * Initializes all `Exposed` fields with its initial value.
 * If you've created an instance
 * of a class that includes `Exposed` fields,
 * you must use this function to initialize it.
 * @template T
 * @param {new () => T} Type
 * @returns {T}
 */
export function initExposed(Type) {
  const instance = whileExposing(() => {
    /** @type {any} */
    const instance = new Type();

    for (const property in instance) {
      const exposed = instance[property];

      if (!(exposed instanceof Exposed)) {
        continue;
      }

      const Type = exposed.type;
      const isArray = exposed.isArray;

      if (Type === null) {
        throw new TypeError("Type information not included in `Exposed`");
      }

      if (isArray) {
        instance[property] = [];
      } else if (Type === Number || Type === Boolean || Type === String) {
        instance[property] = exposed.defaultValue;
      } else {
        instance[property] = initExposed(Type);
      }
    }

    return instance;
  });
  return instance;
}
