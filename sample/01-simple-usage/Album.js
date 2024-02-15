// @ts-check

import { Exposed } from "class-transform";

export class Album {
  id = Exposed.number();
  name = Exposed.string();
}
