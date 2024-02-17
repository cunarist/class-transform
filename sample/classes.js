// @ts-check

import { Exposed } from "class-transform";

export class Album {
  id = Exposed.number();
  name = Exposed.string();
}

export class User {
  id = Exposed.number();
  firstName = Exposed.string(5050);
  lastName = Exposed.string("PLACEHOLDER");
}

export class Photo {
  id = Exposed.number(0);
  filename = Exposed.alias("rawFilename").string("BASE-FILENAME");
  metadata = Exposed.toPlainOnly().string();
  description = Exposed.string();
  tags = Exposed.toInstanceOnly().strings();
  author = Exposed.struct(User);
  albums = Exposed.structs(Album);
  year = 1970;

  get name() {
    return this.id + "_" + this.filename;
  }

  getAlbums() {
    console.log("this is not serialized/deserialized");
    return this.albums;
  }
}

export class TimeRange {
  startTimestamp = Exposed.string();
  endTimestamp = Exposed.number();

  get start() {
    return new Date(this.endTimestamp ?? 0);
  }

  get end() {
    return new Date(this.endTimestamp ?? 0);
  }
}
