import { conceal } from "class-transform";

export class Album {
  id: string;

  @conceal()
  name: string;
}
