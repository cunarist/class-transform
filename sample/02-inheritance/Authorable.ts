import { nest, conceal } from "class-transform";
import { User } from "./User";

export class Authorable {
  authorName: string;

  @conceal()
  authorEmail: string;

  @nest(User)
  author: User;
}
