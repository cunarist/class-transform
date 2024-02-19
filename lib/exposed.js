import { NotExposingError, DirectionSetError } from "./error.js";

let exposingDepth = 0;

/**
 * Executes a provided function while `exposing` is set to true,
 * which allows `Exposed` fields to be constructed.
 * This function can be called recursively.
 * @template T
 * @param {() => T} callable
 * @returns {T}
 */
export function whileExposing(callable) {
  exposingDepth += 1;
  try {
    let returned = callable();
    return returned;
  } catch (error) {
    throw error;
  } finally {
    exposingDepth -= 1;
  }
}

/**
 * Checks if the code is currently within an exposing context.
 * If not, throws a `NotExposingError` indicating an attempt
 * to create an `Exposed` outside such context.
 */

function checkIfExposing() {
  if (exposingDepth == 0) {
    throw new NotExposingError(
      "Tried to create `Exposed` outside an exposing context",
    );
  }
}

export class Direction {
  static toBoth = 0;
  static toInstanceOnly = 1;
  static toPlainOnly = 2;
}

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
    checkIfExposing();
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
    checkIfExposing();
    this.type = Number;
    this.defaultValue = defaultValue;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<number>}
   */
  static numbers() {
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
    this.type = Boolean;
    this.defaultValue = defaultValue;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<boolean>}
   */
  static booleans() {
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
    this.type = String;
    this.defaultValue = defaultValue;
    // @ts-ignore
    return this;
  }

  /**
   * @returns {Array<string>}
   */
  static strings() {
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
    const exposed = new Exposed();
    exposed.plainAlias = plainAlias;
    return exposed;
  }

  /**
   * @param {string} plainAlias
   * @returns {Exposed}
   */
  alias(plainAlias) {
    checkIfExposing();
    this.plainAlias = plainAlias;
    return this;
  }

  /**
   * @returns {Exposed}
   */
  static toInstanceOnly() {
    checkIfExposing();
    const exposed = new Exposed();
    exposed.direction = Direction.toInstanceOnly;
    return exposed;
  }

  /**
   * @returns {Exposed}
   */
  toInstanceOnly() {
    checkIfExposing();
    if (this.direction != Direction.toBoth) {
      throw new DirectionSetError("Transformation direction is already set");
    }
    this.direction = Direction.toInstanceOnly;
    return this;
  }

  /**
   * @returns {Exposed}
   */
  static toPlainOnly() {
    checkIfExposing();
    const exposed = new Exposed();
    exposed.direction = Direction.toPlainOnly;
    return exposed;
  }

  /**
   * @returns {Exposed}
   */
  toPlainOnly() {
    checkIfExposing();
    if (this.direction != Direction.toBoth) {
      throw new DirectionSetError("Transformation direction is already set");
    }
    this.direction = Direction.toPlainOnly;
    return this;
  }
}
