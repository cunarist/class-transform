let exposingDepth = 0;

/**
 * This error is thrown whenever an `Exposed` is created
 * outisde an exposing context.
 */
export class NotExposingError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotExposingError";
  }
}

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

function checkIfExposing() {
  if (exposingDepth == 0) {
    throw new NotExposingError(
      "Tried to create `Exposed` outside an exposing context",
    );
  }
}

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
   * @param {new () => T} type
   * @returns {T}
   */
  static struct(type) {
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
    checkIfExposing();
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
}
