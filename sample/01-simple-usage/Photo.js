// @ts-check

import { Nested } from "class-transform";
import { Album } from "./Album.js";
import { User } from "./User.js";

export class Photo {
  id = Nested.number();
  filename = Nested.string();
  description = Nested.string();
  tags = Nested.strings();
  author = Nested.struct(User);
  albums = Nested.structs(Album);

  get name() {
    return this.id + "_" + this.filename;
  }

  getAlbums() {
    console.log("this is not serialized/deserialized");
    return this.albums;
  }
}
