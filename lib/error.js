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
 * This error is thrown when an attempt to set
 * transformation direction happens,
 * even when it's already set.
 */
export class DirectionSetError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotExposingError";
  }
}
