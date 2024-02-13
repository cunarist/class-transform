import { nest, exclude } from "class-transform";
import { User } from "./User";

export class Authorable {
  authorName: string;

  @exclude()
  authorEmail: string;

  @nest(User)
  author: User;
}
