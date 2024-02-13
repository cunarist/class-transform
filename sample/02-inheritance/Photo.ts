import { nest, exclude } from "class-transform";
import { Album } from "./Album";
import { Authorable } from "./Authorable";

export class Photo extends Authorable {
  id: string;
  filename: string;
  description: string;
  @exclude() authorEmail: string; // this decoration will ignore skipping inherited from Authorable class
  @nest(Album) albums: Array<Album>;
}
