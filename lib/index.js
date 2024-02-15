// @ts-check

export class Nested {
  /**
   * @param {new () => any} type
   * @param {boolean} isArray
   */
  constructor(type, isArray) {
    /** @type {new () => any} */
    this.type = type;
    /** @type {boolean} */
    this.isArray = isArray;
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {T | null}
   */
  static struct(type) {
    // @ts-ignore
    return new Nested(type, false);
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {Array<T>}
   */
  static structs(type) {
    // @ts-ignore
    return new Nested(type, true);
  }

  /**
   * @returns {number | null}
   */
  static number() {
    // @ts-ignore
    return new Nested(Number, false);
  }

  /**
   * @returns {Array<number>}
   */
  static numbers() {
    // @ts-ignore
    return new Nested(Number, true);
  }

  /**
   * @returns {boolean | null}
   */
  static boolean() {
    // @ts-ignore
    return new Nested(Boolean, false);
  }

  /**
   * @returns {Array<boolean>}
   */
  static booleans() {
    // @ts-ignore
    return new Nested(Boolean, true);
  }

  /**
   * @returns {string | null}
   */
  static string() {
    // @ts-ignore
    return new Nested(String, false);
  }

  /**
   * @returns {Array<string>}
   */
  static strings() {
    // @ts-ignore
    return new Nested(String, true);
  }
}

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

/**
 * @template T, V
 * @param {new () => T} Type
 * @param {V} plain
 * @returns {V extends Array? Array<T>: T}
 */
export function plainToInstance(Type, plain) {
  if (plain instanceof Array) {
    const array = [];
    for (const eachObject of plain) {
      array.push(plainToInstance(Type, eachObject));
    }
    // @ts-ignore
    return array;
  }

  /** @type {Object} */
  const instance = new Type();

  for (const property in plain) {
    const value = plain[property];
    const nested = instance[property];

    if (!(nested instanceof Nested)) {
      // If the property is not `Nested`, do not assign the value from plain object
      continue;
    }

    if (value instanceof Array) {
      // If the property is an array
      if (nested.isArray) {
        // If it's an array in the nested structure, assign the value directly
        const array = [];
        instance[property] = array;
        for (const eachValue of value) {
          if (nested.type === Number) {
            array.push(Number(eachValue));
          } else if (nested.type === Boolean) {
            array.push(Boolean(eachValue));
          } else if (nested.type === String) {
            array.push(String(eachValue));
          } else {
            array.push(plainToInstance(nested.type, eachValue));
          }
        }
      } else {
        // If it's not an array in the nested structure, ignore the incoming value
        instance[property] = null;
      }
    } else {
      if (nested.isArray) {
        instance[property] = [];
      } else {
        if (nested.type === Number) {
          instance[property] = Number(value);
        } else if (nested.type === Boolean) {
          instance[property] = Boolean(value);
        } else if (nested.type === String) {
          instance[property] = String(value);
        } else {
          instance[property] = plainToInstance(nested.type, value);
        }
      }
    }
  }

  // Replace remaining `Nested` objects with empty.
  for (const property in instance) {
    const value = instance[property];
    if (value instanceof Nested) {
      if (value.isArray) {
        instance[property] = [];
      } else {
        instance[property] = null;
      }
    }
  }

  return instance;
}

/**
 * @template V
 * @param {V} instance - The instance to convert to a plain object.
 * @returns {V extends Array? Array<Object>: Object}
 */
export function instanceToPlain(instance) {
  if (instance instanceof Array) {
    const array = [];
    for (const eachInstance of instance) {
      array.push(instanceToPlain(eachInstance));
    }
    // @ts-ignore
    return array;
  }

  /** @type {Object} */
  const plain = {};

  for (const prop in instance) {
    /** @type {string} */
    const property = prop;
    const value = instance[property];

    if (value instanceof Nested) {
      // If the property is a Nested object
      plain[property] = null;
      continue;
    }

    if (value instanceof Array) {
      const array = [];
      plain[property] = array;
      for (const eachValue of value) {
        if (typeof eachValue == "number") {
          array.push(eachValue);
        } else if (typeof eachValue == "boolean") {
          array.push(eachValue);
        } else if (typeof eachValue == "string") {
          array.push(eachValue);
        } else if (typeof eachValue == "object") {
          array.push(instanceToPlain(eachValue));
        } else {
          array.push(eachValue);
        }
      }
    } else {
      if (typeof value == "number") {
        plain[property] = value;
      } else if (typeof value == "boolean") {
        plain[property] = value;
      } else if (typeof value == "string") {
        plain[property] = value;
      } else if (typeof value == "object") {
        plain[property] = instanceToPlain(value);
      } else {
        plain[property] = value;
      }
    }
  }

  return plain;
}
