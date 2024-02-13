import { NestOptions } from "..";

/**
 * This object represents metadata assigned to a property via the @nest decorator.
 */
export interface NestMetadata {
  target: Function;

  /**
   * The property name this metadata belongs to on the target (property only).
   */
  propertyName: string;

  /**
   * The type guessed from assigned Reflect metadata ('design:type')
   */
  reflectedType: any;

  /**
   * The custom function provided by the user in the @nest decorator which
   * returns the target type for the transformation.
   */
  classConstructor: new (...args: any[]) => any;

  /**
   * Options passed to the @nest operator for this property.
   */
  options: NestOptions;
}
