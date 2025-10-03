import { Exposed } from "./exposed.ts";
import { Direction, whileExposing } from "./common.ts";

/**
 * Transforms an array of plain objects
 * to an array of class instances.
 */
export function plainsToInstances<T, A extends any[]>(
  plains: Record<string, any>[],
  type: new (...args: A) => T,
  args: A,
): T[] {
  if (!(plains instanceof Array)) {
    throw new TypeError("For non-arrays, `plainToInstance` should be used");
  }
  const array: T[] = [];
  for (const eachObject of plains) {
    array.push(plainToInstance(eachObject, type, args));
  }
  return array;
}

/**
 * Transforms an array of class instances
 * to an array of plain objects.
 */
export function instancesToPlains<T>(instances: T[]): Record<string, any>[] {
  if (!(instances instanceof Array)) {
    throw new TypeError("For non-arrays, `instanceToPlain` should be used");
  }
  const array: Record<string, any>[] = [];
  for (const eachInstance of instances) {
    array.push(instanceToPlain(eachInstance));
  }
  return array;
}

/**
 * Transforms a plain JavaScript object to a class instance.
 */
export function plainToInstance<T, A extends any[]>(
  plain: Record<string, any>,
  type: new (...args: A) => T,
  args: A,
): T {
  if (plain instanceof Array) {
    throw new TypeError("For arrays, `plainsToInstances` should be used");
  }

  return whileExposing(() => {
    const instance = new type(...args) as any;

    for (const property in instance) {
      const exposed = instance[property];

      if (!(exposed instanceof Exposed)) {
        // If the property is not `Exposed`, do not assign the value from plain object
        continue;
      }

      const exposedType = exposed.type;
      const isArray = exposed.isArray;
      const plainAlias = exposed.plainAlias;
      const defaultValue = exposed.defaultValue;
      const direction = exposed.direction;
      const exposedArgs = exposed.args;

      let value: any;
      if (plainAlias === null) {
        value = plain[property];
      } else {
        value = plain[plainAlias];
      }

      if (exposedType === null) {
        throw new TypeError("Type information not included in `Exposed`");
      }

      if (
        value === null ||
        value === undefined ||
        direction === Direction.toPlainOnly
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
          } else if (
            exposedType === Number || exposedType === Boolean ||
            exposedType === String
          ) {
            instance[property] = (exposedType as any)(defaultValue);
          } else {
            instance[property] = new exposedType();
          }
        }
        continue;
      }

      if (isArray) {
        if (value instanceof Array) {
          // Expected array, received array.
          // Put in an array with elements that have proper type enforced.
          const array: any[] = [];
          instance[property] = array;
          for (const eachValue of value) {
            if (eachValue === null) {
              continue;
            } else if (
              exposedType === Number || exposedType === Boolean ||
              exposedType === String
            ) {
              array.push((exposedType as any)(eachValue));
            } else {
              array.push(plainToInstance(eachValue, exposedType, exposedArgs));
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
          } else if (
            exposedType === Number || exposedType === Boolean ||
            exposedType === String
          ) {
            instance[property] = (exposedType as any)(defaultValue);
          } else {
            instance[property] = new exposedType();
          }
        } else {
          // Expected single, received single.
          // Put in the received value with proper type enforced.
          if (
            exposedType === Number || exposedType === Boolean ||
            exposedType === String
          ) {
            instance[property] = (exposedType as any)(value);
          } else {
            instance[property] = plainToInstance(
              value,
              exposedType,
              exposedArgs,
            );
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
 */
export function instanceToPlain<T>(instance: T): Record<string, any> {
  if (instance instanceof Array) {
    throw new TypeError("For arrays, `instancesToPlains` should be used");
  }

  return whileExposing(() => {
    const type = Object.getPrototypeOf(instance).constructor;
    const blankInstance = new type() as any;
    const exposedProperties: string[] = [];

    for (const property in blankInstance) {
      if (blankInstance[property] instanceof Exposed) {
        exposedProperties.push(property);
      }
    }

    const plain: Record<string, any> = {};

    for (const property of exposedProperties) {
      const value = (instance as any)[property];

      if (value === null || value === undefined) {
        plain[property] = null;
        continue;
      }

      const blankExposed = blankInstance[property];
      const plainName = blankExposed.plainAlias ?? property;
      const direction = blankExposed.direction;

      if (direction === Direction.toInstanceOnly) {
        continue;
      }

      if (value instanceof Exposed) {
        // If the property is `Exposed`
        plain[property] = value.defaultValue;
        continue;
      }

      if (value instanceof Array) {
        const array: any[] = [];
        plain[plainName] = array;
        for (const eachValue of value) {
          if (typeof eachValue === "number") {
            array.push(eachValue);
          } else if (typeof eachValue === "boolean") {
            array.push(eachValue);
          } else if (typeof eachValue === "string") {
            array.push(eachValue);
          } else if (typeof eachValue === "object") {
            array.push(instanceToPlain(eachValue));
          }
        }
      } else {
        if (typeof value === "number") {
          plain[plainName] = value;
        } else if (typeof value === "boolean") {
          plain[plainName] = value;
        } else if (typeof value === "string") {
          plain[plainName] = value;
        } else if (typeof value === "object") {
          plain[plainName] = instanceToPlain(value);
        } else {
          plain[plainName] = null;
        }
      }
    }

    return plain;
  });
}
