// @ts-check

class Nested {
  /**
   * @param {new (...args) => any} type
   * @param {boolean} isArray
   */
  constructor(type, isArray) {
    /** @type {new (...args) => any} */
    this.type = type;
    /** @type {boolean} */
    this.isArray = isArray;
  }

  /**
   * @template T
   * @param {new (...args) => T} type
   * @returns {T | null}
   */
  static type(type) {
    // @ts-ignore
    return new Nested(type, false);
  }

  /**
   * @template T
   * @param {new (...args) => T} type
   * @returns {Array<T> | null}
   */
  static types(type) {
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
  g = Nested.type(Inner);
  h = Nested.types(Inner);
}

const result = nest(new Mine());
console.log(result);
result.f?.push("HI");
console.log(result);
