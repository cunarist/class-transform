import { Direction, isExposing } from "./common.js";

/**
 * Marks a class field to be exposed while transformation,
 * so that `plainToInstance` and `instanceToPlain` can pick them up properly.
 * Each method also provides proper type hints.
 */
export class Exposed {
  // Constructor

  /** @type {(new (...args: Array<any>) => any) | null} */
  type = null;
  /** @type {Array<any>} */
  args = [];
  /** @type {boolean} */
  isArray = false;
  /** @type {string | null} */
  plainAlias = null;
  /** @type {any | null} */
  defaultValue = null;
  /** @type {number} */
  direction = Direction.toBoth;

  // Type builders

  /**
   * @template T
   * @param {T} defaultValue
   * @returns {null extends T ? (number | null) : number}
   */
  static number(defaultValue = null) {
    if (!isExposing()) {
      // @ts-ignore
      return defaultValue;
    }
    const exposed = new Exposed();
    exposed.type = Number;
    exposed.defaultValue = defaultValue;
    // @ts-ignore
    return exposed;
  }

  /**
   * @template T
   * @param {T} defaultValue
   * @returns {null extends T ? (number | null) : number}
   */
  number(defaultValue = null) {
    if (!isExposing()) {
      // @ts-ignore
      return defaultValue;
    }
    this.type = Number;
    this.defaultValue = defaultValue;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<number>}
   */
  static numbers() {
    if (!isExposing()) {
      return [];
    }
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
    if (!isExposing()) {
      return [];
    }
    this.type = Number;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  /**
   * @template T
   * @param {T} defaultValue
   * @returns {null extends T ? (boolean | null) : boolean}
   */
  static boolean(defaultValue = null) {
    if (!isExposing()) {
      // @ts-ignore
      return defaultValue;
    }
    const exposed = new Exposed();
    exposed.type = Boolean;
    exposed.defaultValue = defaultValue;
    // @ts-ignore
    return exposed;
  }

  /**
   * @template T
   * @param {T} defaultValue
   * @returns {null extends T ? (boolean | null) : boolean}
   */
  boolean(defaultValue = null) {
    if (!isExposing()) {
      // @ts-ignore
      return defaultValue;
    }
    this.type = Boolean;
    this.defaultValue = defaultValue;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<boolean>}
   */
  static booleans() {
    if (!isExposing()) {
      return [];
    }
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
    if (!isExposing()) {
      return [];
    }
    this.type = Boolean;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  /**
   * @template T
   * @param {T} defaultValue
   * @returns {null extends T ? (string | null) : string}
   */
  static string(defaultValue = null) {
    if (!isExposing()) {
      // @ts-ignore
      return defaultValue;
    }
    const exposed = new Exposed();
    exposed.type = String;
    exposed.defaultValue = defaultValue;
    // @ts-ignore
    return exposed;
  }

  /**
   * @template T
   * @param {T} defaultValue
   * @returns {null extends T ? (string | null) : string}
   */
  string(defaultValue = null) {
    if (!isExposing()) {
      // @ts-ignore
      return defaultValue;
    }
    this.type = String;
    this.defaultValue = defaultValue;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<string>}
   */
  static strings() {
    if (!isExposing()) {
      return [];
    }
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
    if (!isExposing()) {
      return [];
    }
    this.type = String;
    this.isArray = true;
    // @ts-ignore
    return this;
  }

  /**
   * @template T
   * @template {Array<any>} A
   * @param {new (...args: A) => T} type
   * @param {A} args
   * @returns {T}
   */
  static struct(type, args) {
    if (!isExposing()) {
      return new type(...args);
    }
    const exposed = new Exposed();
    exposed.type = type;
    exposed.args = args;
    // @ts-ignore
    return exposed;
  }

  /**
   * @template T
   * @template {Array<any>} A
   * @param {new (...args: A) => T} type
   * @param {A} args
   * @returns {T}
   */
  struct(type, args) {
    if (!isExposing()) {
      return new type(...args);
    }
    this.type = type;
    this.args = args;
    // @ts-ignore
    return this;
  }

  /**
   * @template T
   * @template {Array<any>} A
   * @param {new (...args: A) => T} type
   * @param {A} args
   * @returns {Array<T>}
   */
  static structs(type, args) {
    if (!isExposing()) {
      return [];
    }
    const exposed = new Exposed();
    exposed.type = type;
    exposed.args = args;
    exposed.isArray = true;
    // @ts-ignore
    return exposed;
  }

  /**
   * @template T
   * @template {Array<any>} A
   * @param {new (...args: A) => T} type
   * @param {A} args
   * @returns {Array<T>}
   */
  structs(type, args) {
    if (!isExposing()) {
      return [];
    }
    this.type = type;
    this.args = args;
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
   * @returns {Exposed}
   */
  static toInstanceOnly() {
    const exposed = new Exposed();
    exposed.direction = Direction.toInstanceOnly;
    return exposed;
  }

  /**
   * @returns {Exposed}
   */
  toInstanceOnly() {
    this.direction = Direction.toInstanceOnly;
    return this;
  }

  /**
   * @returns {Exposed}
   */
  static toPlainOnly() {
    const exposed = new Exposed();
    exposed.direction = Direction.toPlainOnly;
    return exposed;
  }

  /**
   * @returns {Exposed}
   */
  toPlainOnly() {
    this.direction = Direction.toPlainOnly;
    return this;
  }
}
