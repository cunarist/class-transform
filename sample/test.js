// @ts-check

class Nested {
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
   * @returns {Array<T> | null}
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
   * @returns {Array<number> | null}
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
   * @returns {Array<boolean> | null}
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
   * @returns {Array<string> | null}
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
function nest(object) {
  /** @type {Map<string, Nested>} */
  const fieldMap = new Map();
  for (let prop in object) {
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
 * @template T
 * @param {new () => T} Type
 * @param {Object} plainObject
 * @returns {T}
 */
function plainToInstance(Type, plainObject) {
  /** @type {Object} */
  const instance = new Type();

  for (const [key, value] of Object.entries(plainObject)) {
    const nested = instance[key];

    if (!(nested instanceof Nested)) {
      // If the property is not `Nested`, do not assign the value from plain object
      continue;
    }

    if (value instanceof Array) {
      // If the property is an array
      if (nested.isArray) {
        // If it's an array in the nested structure, assign the value directly
        const array = [];
        instance[key] = array;
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
        instance[key] = null;
      }
    } else {
      if (nested.isArray) {
        instance[key] = [];
      } else {
        if (nested.type === Number) {
          instance[key] = Number(value);
        } else if (nested.type === Boolean) {
          instance[key] = Boolean(value);
        } else if (nested.type === String) {
          instance[key] = String(value);
        } else {
          instance[key] = plainToInstance(nested.type, value);
        }
      }
    }
  }

  return instance;
}

class Inner {
  a = Nested.number();
  b = Nested.numbers();
}

class Mine {
  a = Nested.number();
  b = Nested.numbers();
  c = Nested.boolean();
  d = Nested.booleans();
  e = Nested.string();
  f = Nested.strings();
  g = Nested.struct(Inner);
  h = Nested.structs(Inner);
  i = new Date();
}

let result = nest(new Mine());
result.f?.push("HI");
console.log(result);

let plainObject = {
  a: 3,
  b: [4, "2.6", 6],
  c: true,
  d: [true, 0, 0.2, 0.5, false],
  e: "Hello",
  f: ["Hehe", "Love", false],
  g: { a: 3, b: [6, 6, false] },
  h: [
    { a: 3, b: [6, 6, false] },
    { a: 3, b: ["STR"] },
  ],
};
let resultFromPlain = plainToInstance(Mine, plainObject);
console.log(resultFromPlain);
