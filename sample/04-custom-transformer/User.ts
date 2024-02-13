import { nested, transform } from "class-transform";
import moment from "moment";

export class User {
  id: number;
  name: string;

  @nested(Date)
  @transform(({ value }) => value.toString(), { toPlainOnly: true })
  @transform(({ value }) => moment(value), { toInstanceOnly: true })
  date: Date;
}