import { nested, exclude } from "../../src/index";
import { Photo } from "./Photo";

export class Album {
  id: string;

  @exclude()
  name: string;

  @nested(Photo)
  photos: Array<Photo>;
}
