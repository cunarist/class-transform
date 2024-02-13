import { exclude } from "class-transform";

export class Album {
  id: string;

  @exclude()
  name: string;
}
