import { Direction, isExposing } from "./common.ts";

// Type for constructor functions
type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Marks a class field to be exposed while transformation,
 * so that `plainToInstance` and `instanceToPlain` can pick them up properly.
 * Each method also provides proper type hints.
 */
export class Exposed {
  type: Constructor | null = null;
  args: any[] = [];
  isArray: boolean = false;
  plainAlias: string | null = null;
  defaultValue: any = null;
  direction: number = Direction.toBoth;

  // Type builders

  /**
   * Creates a number field with optional default value
   */
  static number<T extends number | null = null>(
    defaultValue: T = null as T,
  ): T extends null ? number | null : number {
    if (!isExposing()) {
      return defaultValue as any;
    }
    const exposed = new Exposed();
    exposed.type = Number;
    exposed.defaultValue = defaultValue;
    return exposed as any;
  }

  /**
   * Instance method for number field
   */
  number<T extends number | null = null>(
    defaultValue: T = null as T,
  ): T extends null ? number | null : number {
    if (!isExposing()) {
      return defaultValue as any;
    }
    this.type = Number;
    this.defaultValue = defaultValue;
    return this as any;
  }

  /**
   * Creates an array of numbers
   */
  static numbers(): number[] {
    if (!isExposing()) {
      return [];
    }
    const exposed = new Exposed();
    exposed.type = Number;
    exposed.isArray = true;
    return exposed as any;
  }

  /**
   * Instance method for array of numbers
   */
  numbers(): number[] {
    if (!isExposing()) {
      return [];
    }
    this.type = Number;
    this.isArray = true;
    return this as any;
  }

  /**
   * Creates a boolean field with optional default value
   */
  static boolean<T extends boolean | null = null>(
    defaultValue: T = null as T,
  ): T extends null ? boolean | null : boolean {
    if (!isExposing()) {
      return defaultValue as any;
    }
    const exposed = new Exposed();
    exposed.type = Boolean;
    exposed.defaultValue = defaultValue;
    return exposed as any;
  }

  /**
   * Instance method for boolean field
   */
  boolean<T extends boolean | null = null>(
    defaultValue: T = null as T,
  ): T extends null ? boolean | null : boolean {
    if (!isExposing()) {
      return defaultValue as any;
    }
    this.type = Boolean;
    this.defaultValue = defaultValue;
    return this as any;
  }

  /**
   * Creates an array of booleans
   */
  static booleans(): boolean[] {
    if (!isExposing()) {
      return [];
    }
    const exposed = new Exposed();
    exposed.type = Boolean;
    exposed.isArray = true;
    return exposed as any;
  }

  /**
   * Instance method for array of booleans
   */
  booleans(): boolean[] {
    if (!isExposing()) {
      return [];
    }
    this.type = Boolean;
    this.isArray = true;
    return this as any;
  }

  /**
   * Creates a string field with optional default value
   */
  static string<T extends string | null = null>(
    defaultValue: T = null as T,
  ): T extends null ? string | null : string {
    if (!isExposing()) {
      return defaultValue as any;
    }
    const exposed = new Exposed();
    exposed.type = String;
    exposed.defaultValue = defaultValue;
    return exposed as any;
  }

  /**
   * Instance method for string field
   */
  string<T extends string | null = null>(
    defaultValue: T = null as T,
  ): T extends null ? string | null : string {
    if (!isExposing()) {
      return defaultValue as any;
    }
    this.type = String;
    this.defaultValue = defaultValue;
    return this as any;
  }

  /**
   * Creates an array of strings
   */
  static strings(): string[] {
    if (!isExposing()) {
      return [];
    }
    const exposed = new Exposed();
    exposed.type = String;
    exposed.isArray = true;
    return exposed as any;
  }

  /**
   * Instance method for array of strings
   */
  strings(): string[] {
    if (!isExposing()) {
      return [];
    }
    this.type = String;
    this.isArray = true;
    return this as any;
  }

  /**
   * Creates a struct (class instance) field
   */
  static struct<T, A extends any[]>(type: new (...args: A) => T, args: A): T {
    if (!isExposing()) {
      return new type(...args);
    }
    const exposed = new Exposed();
    exposed.type = type;
    exposed.args = args;
    return exposed as any;
  }

  /**
   * Instance method for struct field
   */
  struct<T, A extends any[]>(type: new (...args: A) => T, args: A): T {
    if (!isExposing()) {
      return new type(...args);
    }
    this.type = type;
    this.args = args;
    return this as any;
  }

  /**
   * Creates an array of structs
   */
  static structs<T, A extends any[]>(
    type: new (...args: A) => T,
    args: A,
  ): T[] {
    if (!isExposing()) {
      return [];
    }
    const exposed = new Exposed();
    exposed.type = type;
    exposed.args = args;
    exposed.isArray = true;
    return exposed as any;
  }

  /**
   * Instance method for array of structs
   */
  structs<T, A extends any[]>(type: new (...args: A) => T, args: A): T[] {
    if (!isExposing()) {
      return [];
    }
    this.type = type;
    this.args = args;
    this.isArray = true;
    return this as any;
  }

  // Options

  /**
   * Sets an alias for the plain object property name
   */
  static alias(plainAlias: string): Exposed {
    const exposed = new Exposed();
    exposed.plainAlias = plainAlias;
    return exposed;
  }

  /**
   * Instance method to set alias
   */
  alias(plainAlias: string): Exposed {
    this.plainAlias = plainAlias;
    return this;
  }

  /**
   * Marks field as transformation to instance only
   */
  static toInstanceOnly(): Exposed {
    const exposed = new Exposed();
    exposed.direction = Direction.toInstanceOnly;
    return exposed;
  }

  /**
   * Instance method to mark as instance only
   */
  toInstanceOnly(): Exposed {
    this.direction = Direction.toInstanceOnly;
    return this;
  }

  /**
   * Marks field as transformation to plain only
   */
  static toPlainOnly(): Exposed {
    const exposed = new Exposed();
    exposed.direction = Direction.toPlainOnly;
    return exposed;
  }

  /**
   * Instance method to mark as plain only
   */
  toPlainOnly(): Exposed {
    this.direction = Direction.toPlainOnly;
    return this;
  }
}
