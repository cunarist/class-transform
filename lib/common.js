/**
 * Enum class that represents the transformation direction.
 */
export class Direction {
  static toBoth = 0;
  static toInstanceOnly = 1;
  static toPlainOnly = 2;
}

let exposingDepth = 0;

/**
 * Executes a provided function in an exposing context,
 * which makes `Exposed` fields actually become
 * instances of `Exposed`.
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
 * @returns {boolean}
 */
export function isExposing() {
  if (exposingDepth == 0) {
    return false;
  } else {
    return true;
  }
}
