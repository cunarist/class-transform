import { exclude } from "class-transform";
import { Authorable } from "./Authorable";

export class Album extends Authorable {
  id: string;
  @exclude() name: string;
}
