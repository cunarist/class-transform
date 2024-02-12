import { Nested, Exclude } from '../../src/decorators';

export class SuperCollection<T> {
  @Exclude()
  private type: Function;

  @Nested(options => {
    return (options.newObject as SuperCollection<T>).type;
  })
  items: T[];

  count: number;

  constructor(type: Function) {
    this.type = type;
  }
}
