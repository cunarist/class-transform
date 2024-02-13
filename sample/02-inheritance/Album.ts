import { conceal } from "class-transform";
import { Authorable } from "./Authorable";

export class Album extends Authorable {
  id: string;
  @conceal() name: string;
}
