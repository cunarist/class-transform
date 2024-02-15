// @ts-check

import { Nested } from "class-transform";

export class User {
  id = Nested.number();
  firstName = Nested.string();
  lastName = Nested.string();
}
