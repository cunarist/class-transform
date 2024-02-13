import { DiscriminatorDescriptor } from "./nest-discriminator-descriptor.interface";

/**
 * Possible transformation options for the @nest decorator.
 */
export interface NestOptions {
  /**
   * Optional discriminator object, when provided the property value will be
   * initialized according to the specified object.
   */
  discriminator?: DiscriminatorDescriptor;

  /**
   * Indicates whether to keep the discriminator property on the
   * transformed object or not. Disabled by default.
   *
   * @default false
   */
  keepDiscriminator?: boolean;
}
