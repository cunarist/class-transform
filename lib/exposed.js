// @ts-check

/**
 * Marks a class field to be exposed while transformation,
 * so that `plainToInstance` and `instanceToPlain` can pick them up properly.
 * Each method also provides proper type hints.
 */
export class Exposed {
  // Constructor

  /**
   * @param {(new () => any) | null } type
   * @param {boolean} isArray
   * @param {string | null} plainAlias
   */
  constructor(type, isArray, plainAlias = null) {
    /** @type {(new () => any) | null} */
    this.type = type;
    /** @type {boolean} */
    this.isArray = isArray;
    /** @type {string | null} */
    this.plainAlias = plainAlias;
  }

  // Type builders

  /**
   * @returns {number | null}
   */
  static number() {
    // @ts-ignore
    return new Exposed(Number, false);
  }

  /**
   * @returns {number | null}
   */
  number() {
    this.type = Number;
    this.isArray = false;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<number>}
   */
  static numbers() {
    // @ts-ignore
    return new Exposed(Number, true);
  }

  /**
   * @returns {Array<number>}
   */
  numbers() {
    this.type = Number;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {boolean | null}
   */
  static boolean() {
    // @ts-ignore
    return new Exposed(Boolean, false);
  }

  /**
   * @returns {boolean | null}
   */
  boolean() {
    this.type = Boolean;
    this.isArray = false;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<boolean>}
   */
  static booleans() {
    // @ts-ignore
    return new Exposed(Boolean, true);
  }

  /**
   * @returns {Array<boolean>}
   */
  booleans() {
    this.type = Boolean;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {string | null}
   */
  static string() {
    // @ts-ignore
    return new Exposed(String, false);
  }

  /**
   * @returns {string | null}
   */
  string() {
    this.type = String;
    this.isArray = false;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<string>}
   */
  static strings() {
    // @ts-ignore
    return new Exposed(String, true);
  }

  /**
   * @returns {Array<string>}
   */
  strings() {
    this.type = String;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {T}
   */
  static struct(type) {
    // @ts-ignore
    return new Exposed(type, false);
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {T}
   */
  struct(type) {
    this.type = type;
    this.isArray = false;
    // @ts-ignore
    return this;
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
   * @template T
   * @param {new () => T} type
   * @returns {Array<T>}
   */
  structs(type) {
    this.type = type;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  // Options

  /**
   * @param {string} plainAlias
   * @returns {Exposed}
   */
  static alias(plainAlias) {
    return new Exposed(null, false, plainAlias);
  }

  /**
   * @param {string} plainAlias
   * @returns {Exposed}
   */
  alias(plainAlias) {
    this.plainAlias = plainAlias;
    return this;
  }
}
