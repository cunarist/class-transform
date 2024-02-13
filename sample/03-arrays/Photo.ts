import { Album } from "./Album";
import { nest } from "class-transform";

export class Photo {
  id: string;
  filename: string;
  description: string;
  tags: Array<string>;
  @nest(Album) albums: Array<Album>;
}
