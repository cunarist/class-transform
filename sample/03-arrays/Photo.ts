import { Album } from "./Album";
import { nested } from "class-transform";

export class Photo {
  id: string;
  filename: string;
  description: string;
  tags: Array<string>;
  @nested(Album) albums: Array<Album>;
}
