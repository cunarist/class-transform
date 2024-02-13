import { nested, exclude } from "../../src/index";
import { User } from "./User";

export class Authorable {
  authorName: string;

  @exclude()
  authorEmail: string;

  @nested(User)
  author: User;
}
