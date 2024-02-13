/**
 * Possible transformation options for the @exclude decorator.
 */
export interface ExcludeOptions {
  /**
   * Expose this property only when transforming from plain to class instance.
   */
  toInstanceOnly?: boolean;

  /**
   * Expose this property only when transforming from class instance to plain object.
   */
  toPlainOnly?: boolean;
}
