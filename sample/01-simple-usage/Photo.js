// @ts-check

import { Exposed } from "class-transform";
import { Album } from "./Album.js";
import { User } from "./User.js";

export class Photo {
  id = Exposed.number();
  filename = Exposed.string();
  description = Exposed.string();
  tags = Exposed.strings();
  author = Exposed.struct(User);
  albums = Exposed.structs(Album);
  year = 1970;
  month = 1;
  day = 1;

  get name() {
    return this.id + "_" + this.filename;
  }

  getAlbums() {
    console.log("this is not serialized/deserialized");
    return this.albums;
  }
}
