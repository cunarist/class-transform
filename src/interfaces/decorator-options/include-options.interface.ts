/**
 * Possible transformation options for the @include decorator.
 */
export interface IncludeOptions {
  /**
   * Name of property on the target object to expose the value of this property.
   */
  name?: string;

  /**
   * First version where this property should be included.
   *
   * Example:
   * ```ts
   * instanceToPlain(payload, { version: 1.0 });
   * ```
   */
  since?: number;

  /**
   * Last version where this property should be included.
   *
   * Example:
   * ```ts
   * instanceToPlain(payload, { version: 1.0 });
   * ```
   */
  until?: number;

  /**
   * List of transformation groups this property belongs to. When set,
   * the property will be included only when transform is called with
   * one of the groups specified.
   *
   * Example:
   * ```ts
   * instanceToPlain(payload, { groups: ['user'] });
   * ```
   */
  groups?: Array<string>;

  /**
   * Expose this property only when transforming from plain to class instance.
   */
  toInstanceOnly?: boolean;

  /**
   * Expose this property only when transforming from class instance to plain object.
   */
  toPlainOnly?: boolean;
}
