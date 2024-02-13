import { nested, exclude } from "class-transform";
import { User } from "./User";

export class Authorable {
  authorName: string;

  @exclude()
  authorEmail: string;

  @nested(User)
  author: User;
}
