import { ClassTransformOptions } from "../interfaces/class-transform-options.interface";

/**
 * These are the default options used by any transformation operation.
 */
export const defaultOptions: Partial<ClassTransformOptions> = {
  enableCircularCheck: false,
  enableImplicitConversion: false,
  excludeExtraneous: false,
  excludePrefixes: undefined,
  exposeDefaultValues: false,
  exposeUnsetFields: true,
  groups: undefined,
  ignoreDecorators: false,
  targetMaps: undefined,
  version: undefined,
};
