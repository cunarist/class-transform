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
