/**
 * Enum class that represents the transformation direction.
 */
export class Direction {
  static readonly toBoth = 0;
  static readonly toInstanceOnly = 1;
  static readonly toPlainOnly = 2;
}

let exposingDepth: number = 0;

/**
 * Executes a provided function in an exposing context,
 * which makes `Exposed` fields actually become
 * instances of `Exposed`.
 * This function can be called recursively.
 */
export function whileExposing<T>(callable: () => T): T {
  exposingDepth += 1;
  try {
    const returned = callable();
    return returned;
  } catch (error) {
    throw error;
  } finally {
    exposingDepth -= 1;
  }
}

/**
 * Checks if the code is currently within an exposing context.
 */
export function isExposing(): boolean {
  if (exposingDepth === 0) {
    return false;
  } else {
    return true;
  }
}
