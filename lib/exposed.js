/**
 * Marks a class field to be exposed while transformation,
 * so that `plainToInstance` and `instanceToPlain` can pick them up properly.
 * Each method also provides proper type hints.
 */
export class Exposed {
  // Constructor

  /** @type {(new () => any) | null} */
  type = null;
  /** @type {boolean} */
  isArray = false;
  /** @type {string | null} */
  plainAlias = null;
  /** @type {any | null} */
  defaultValue = null;

  // Type builders

  /**
   * @returns {number | null}
   */
  static number() {
    const exposed = new Exposed();
    exposed.type = Number;
    // @ts-ignore
    return exposed;
  }

  /**
   * @returns {number | null}
   */
  number() {
    this.type = Number;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<number>}
   */
  static numbers() {
    const exposed = new Exposed();
    exposed.type = Number;
    exposed.isArray = true;
    // @ts-ignore
    return exposed;
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
    const exposed = new Exposed();
    exposed.type = Boolean;
    // @ts-ignore
    return exposed;
  }

  /**
   * @returns {boolean | null}
   */
  boolean() {
    this.type = Boolean;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<boolean>}
   */
  static booleans() {
    const exposed = new Exposed();
    exposed.type = Boolean;
    exposed.isArray = true;
    // @ts-ignore
    return exposed;
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
    const exposed = new Exposed();
    exposed.type = String;
    // @ts-ignore
    return exposed;
  }

  /**
   * @returns {string | null}
   */
  string() {
    this.type = String;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<string>}
   */
  static strings() {
    const exposed = new Exposed();
    exposed.type = String;
    exposed.isArray = true;
    // @ts-ignore
    return exposed;
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
    const exposed = new Exposed();
    exposed.type = type;
    // @ts-ignore
    return exposed;
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {T}
   */
  struct(type) {
    this.type = type;
    // @ts-ignore
    return this;
  }

  /**
   * @template T
   * @param {new () => T} type
   * @returns {Array<T>}
   */
  static structs(type) {
    const exposed = new Exposed();
    exposed.type = type;
    exposed.isArray = true;
    // @ts-ignore
    return exposed;
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
    const exposed = new Exposed();
    exposed.plainAlias = plainAlias;
    return exposed;
  }

  /**
   * @param {string} plainAlias
   * @returns {Exposed}
   */
  alias(plainAlias) {
    this.plainAlias = plainAlias;
    return this;
  }

  /**
   * @param {any} defaultValue
   * @returns {Exposed}
   */
  static default(defaultValue) {
    const exposed = new Exposed();
    exposed.defaultValue = defaultValue;
    return exposed;
  }

  /**
   * @param {any} defaultValue
   * @returns {Exposed}
   */
  default(defaultValue) {
    this.defaultValue = defaultValue;
    return this;
  }
}
