// @ts-check

import { Exposed } from "class-transform";

export class User {
  id = Exposed.number();
  firstName = Exposed.string();
  lastName = Exposed.string();
}
