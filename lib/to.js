// @ts-check

import { Exposed } from "./exposed.js";

/**
 * Transforms an array of plain JavaScript objects
 * to an array of class instances.
 * ---
 * @template T
 * @param {new () => T} Type
 * @param {Array<Object>} plain
 * @returns {Array<T>}
 */
export function plainsToInstances(Type, plain) {
  const array = [];
  for (const eachObject of plain) {
    array.push(plainToInstance(Type, eachObject));
  }
  // @ts-ignore
  return array;
}

/**
 * Transforms an array of class instances
 * to an array of plain JavaScript objects.
 * ---
 * @template T
 * @param {Array<T>} instance - The instance to convert to a plain object.
 * @returns {Array<Object>}
 */
export function instancesToPlains(instance) {
  const array = [];
  for (const eachInstance of instance) {
    array.push(instanceToPlain(eachInstance));
  }
  // @ts-ignore
  return array;
}

/**
 * Transforms a plain JavaScript object to a class instance.
 * ---
 * @template T
 * @param {new () => T} Type
 * @param {Object} plain
 * @returns {T}
 */
export function plainToInstance(Type, plain) {
  if (plain instanceof Array) {
    throw TypeError("For arrays, `plainsToInstances` should be used");
  }

  /** @type {Object} */
  const instance = new Type();

  for (const property in instance) {
    const exposed = instance[property];

    if (!(exposed instanceof Exposed)) {
      // If the property is not `Exposed`, do not assign the value from plain object
      continue;
    }

    const Type = exposed.type;
    const isArray = exposed.isArray;
    const plainAlias = exposed.plainAlias;
    const defaultValue = exposed.defaultValue;

    let value;
    if (plainAlias === null) {
      value = plain[property];
    } else {
      value = plain[plainAlias];
    }

    if (Type === null) {
      throw TypeError("Type information not included in `Exposed`");
    }

    if (value === null || value === undefined) {
      if (isArray) {
        // Expected array, received invalid value.
        // Put in a blank array.
        instance[property] = [];
      } else {
        // Expected single, received invalid value.
        // Put in the default value with proper type enforced.
        if (defaultValue === null) {
          instance[property] = null;
        } else if (Type === Number || Type === Boolean || Type === String) {
          // @ts-ignore
          instance[property] = Type(defaultValue);
        } else {
          instance[property] = new Type();
        }
      }
      continue;
    }

    if (isArray) {
      if (value instanceof Array) {
        // Expected array, received array.
        // Put in an array with elements that have proper type enforced.
        const array = [];
        instance[property] = array;
        for (const eachValue of value) {
          if (eachValue === null) {
            continue;
          } else if (Type === Number || Type === Boolean || Type === String) {
            // @ts-ignore
            array.push(Type(eachValue));
          } else {
            array.push(plainToInstance(Type, eachValue));
          }
        }
      } else {
        // Expected array, received single.
        // Put in a blank array.
        instance[property] = [];
      }
    } else {
      if (value instanceof Array) {
        // Expected single, received array.
        // Put in the default value with proper type enforced.
        if (defaultValue === null) {
          instance[property] = null;
        } else if (Type === Number || Type === Boolean || Type === String) {
          // @ts-ignore
          instance[property] = Type(defaultValue);
        } else {
          instance[property] = new Type();
        }
      } else {
        // Expected single, received single.
        // Put in the received value with proper type enforced.
        if (Type === Number || Type === Boolean || Type === String) {
          // @ts-ignore
          instance[property] = Type(value);
        } else {
          instance[property] = plainToInstance(Type, value);
        }
      }
    }
  }

  // Replace remaining `Exposed` objects with default value.
  for (const property in instance) {
    const exposed = instance[property];

    if (!(exposed instanceof Exposed)) {
      continue;
    }

    if (exposed.isArray) {
      instance[property] = [];
    } else {
      instance[property] = exposed.defaultValue;
    }
  }

  return instance;
}

/**
 * Transforms a class instance to a plain JavaScript object.
 * ---
 * @template T
 * @param {T} instance - The instance to convert to a plain object.
 * @returns {Object}
 */
export function instanceToPlain(instance) {
  if (instance instanceof Array) {
    throw TypeError("For arrays, `instancesToPlains` should be used");
  }

  const exposedProperties = [];
  const Type = Object.getPrototypeOf(instance).constructor;
  const blankInstance = new Type();
  for (const property in blankInstance) {
    if (blankInstance[property] instanceof Exposed) {
      exposedProperties.push(property);
    }
  }

  /** @type {Object} */
  const plain = {};

  for (const property of exposedProperties) {
    const value = instance[property];

    if (value === null || value === undefined) {
      plain[property] = null;
      continue;
    }

    const plainName = blankInstance[property].plainAlias ?? property;

    if (value instanceof Exposed) {
      // If the property is `Exposed`
      plain[property] = value.defaultValue;
      continue;
    }

    if (value instanceof Array) {
      const array = [];
      plain[plainName] = array;
      for (const eachValue of value) {
        if (typeof eachValue == "number") {
          array.push(eachValue);
        } else if (typeof eachValue == "boolean") {
          array.push(eachValue);
        } else if (typeof eachValue == "string") {
          array.push(eachValue);
        } else if (typeof eachValue == "object") {
          array.push(instanceToPlain(eachValue));
        }
      }
    } else {
      if (typeof value == "number") {
        plain[plainName] = value;
      } else if (typeof value == "boolean") {
        plain[plainName] = value;
      } else if (typeof value == "string") {
        plain[plainName] = value;
      } else if (typeof value == "object") {
        plain[plainName] = instanceToPlain(value);
      } else {
        plain[plainName] = null;
      }
    }
  }

  return plain;
}
