import { Exposed } from "./exposed.js";
import { whileExposing, Direction } from "./common.js";

/**
 * Transforms an array of plain JavaScript objects
 * to an array of class instances.
 * ---
 * @template T
 * @template {Array<any>} A
 * @param {Array<Object>} plains
 * @param {new (...args: A) => T} type
 * @param {A} args
 * @returns {Array<T>}
 */
export function plainsToInstances(plains, type, args) {
  if (!(plains instanceof Array)) {
    throw new TypeError("For non-arrays, `plainToInstance` should be used");
  }
  const array = [];
  for (const eachObject of plains) {
    array.push(plainToInstance(eachObject, type, args));
  }
  // @ts-ignore
  return array;
}

/**
 * Transforms an array of class instances
 * to an array of plain JavaScript objects.
 * ---
 * @template T
 * @param {Array<T>} instances - The instance to convert to a plain object.
 * @returns {Array<Object>}
 */
export function instancesToPlains(instances) {
  if (!(instances instanceof Array)) {
    throw new TypeError("For non-arrays, `instanceToPlain` should be used");
  }
  const array = [];
  for (const eachInstance of instances) {
    array.push(instanceToPlain(eachInstance));
  }
  // @ts-ignore
  return array;
}

/**
 * Transforms a plain JavaScript object to a class instance.
 * ---
 * @template T
 * @template {Array<any>} A
 * @param {Object} plain
 * @param {new (...args: A) => T} type
 * @param {A} args
 * @returns {T}
 */
export function plainToInstance(plain, type, args) {
  if (plain instanceof Array) {
    throw new TypeError("For arrays, `plainsToInstances` should be used");
  }

  return whileExposing(() => {
    /** @type {Object} */
    const instance = new type(...args);

    for (const property in instance) {
      const exposed = instance[property];

      if (!(exposed instanceof Exposed)) {
        // If the property is not `Exposed`, do not assign the value from plain object
        continue;
      }

      const type = exposed.type;
      const isArray = exposed.isArray;
      const plainAlias = exposed.plainAlias;
      const defaultValue = exposed.defaultValue;
      const direction = exposed.direction;
      const args = exposed.args;

      let value;
      if (plainAlias === null) {
        value = plain[property];
      } else {
        value = plain[plainAlias];
      }

      if (type === null) {
        throw new TypeError("Type information not included in `Exposed`");
      }

      if (
        value === null ||
        value === undefined ||
        direction == Direction.toPlainOnly
      ) {
        if (isArray) {
          // Expected array, received invalid value.
          // Put in a blank array.
          instance[property] = [];
        } else {
          // Expected single, received invalid value.
          // Put in the initial value with proper type enforced.
          if (defaultValue === null) {
            instance[property] = null;
          } else if (type === Number || type === Boolean || type === String) {
            // @ts-ignore
            instance[property] = type(defaultValue);
          } else {
            instance[property] = new type();
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
            } else if (type === Number || type === Boolean || type === String) {
              // @ts-ignore
              array.push(type(eachValue));
            } else {
              array.push(plainToInstance(eachValue, type, args));
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
          // Put in the initial value with proper type enforced.
          if (defaultValue === null) {
            instance[property] = null;
          } else if (type === Number || type === Boolean || type === String) {
            // @ts-ignore
            instance[property] = type(defaultValue);
          } else {
            instance[property] = new type();
          }
        } else {
          // Expected single, received single.
          // Put in the received value with proper type enforced.
          if (type === Number || type === Boolean || type === String) {
            // @ts-ignore
            instance[property] = type(value);
          } else {
            instance[property] = plainToInstance(value, type, args);
          }
        }
      }
    }

    // Replace remaining `Exposed` objects with initial value.
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
  });
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
    throw new TypeError("For arrays, `instancesToPlains` should be used");
  }

  return whileExposing(() => {
    const type = Object.getPrototypeOf(instance).constructor;
    const blankInstance = new type();
    const exposedProperties = [];
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

      const blankExposed = blankInstance[property];
      const plainName = blankExposed.plainAlias ?? property;
      const direction = blankExposed.direction;

      if (direction == Direction.toInstanceOnly) {
        continue;
      }

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
  });
}
