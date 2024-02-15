// @ts-check

export class Exposed {
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
    return new Exposed(type, false);
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {Array<T>}
   */
  static structs(type) {
    // @ts-ignore
    return new Exposed(type, true);
  }

  /**
   * @returns {number | null}
   */
  static number() {
    // @ts-ignore
    return new Exposed(Number, false);
  }

  /**
   * @returns {Array<number>}
   */
  static numbers() {
    // @ts-ignore
    return new Exposed(Number, true);
  }

  /**
   * @returns {boolean | null}
   */
  static boolean() {
    // @ts-ignore
    return new Exposed(Boolean, false);
  }

  /**
   * @returns {Array<boolean>}
   */
  static booleans() {
    // @ts-ignore
    return new Exposed(Boolean, true);
  }

  /**
   * @returns {string | null}
   */
  static string() {
    // @ts-ignore
    return new Exposed(String, false);
  }

  /**
   * @returns {Array<string>}
   */
  static strings() {
    // @ts-ignore
    return new Exposed(String, true);
  }
}
