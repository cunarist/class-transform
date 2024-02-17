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
