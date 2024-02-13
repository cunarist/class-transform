import { Album } from "./Album";
import { AlbumArray } from "./AlbumArray";
import { nested } from "../../src/index";

export class Photo {
  id: string;
  filename: string;
  description: string;
  tags: Array<string>;
  @nested(Album) albums: AlbumArray;
}
