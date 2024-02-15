// @ts-check

import { Nested } from "class-transform";

export class Album {
  id = Nested.number();
  name = Nested.string();
}
