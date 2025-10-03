import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  Exposed,
  instancesToPlains,
  instanceToPlain,
  plainsToInstances,
  plainToInstance,
} from "@cunarist/class-transform";

export class Album {
  id = Exposed.number();
  name = Exposed.string();
}

export class User {
  id = Exposed.number();
  firstName = Exposed.string("5050");
  lastName = Exposed.string("PLACEHOLDER");
  age: number;

  constructor(age: number) {
    this.age = age;
  }
}

export class Photo {
  id = Exposed.number(0);
  filename = Exposed.alias("rawFilename").string("BASE-FILENAME");
  metadata = Exposed.toPlainOnly().string();
  description = Exposed.string();
  tags = Exposed.toInstanceOnly().strings();
  author = Exposed.struct(User, [25]);
  albums = Exposed.structs(Album, []);
  year = 1970;
  mood: string;

  constructor(mood: string) {
    this.mood = mood;
  }

  get name(): string {
    return this.id + "_" + this.filename;
  }

  getAlbums(): any[] {
    console.log("this is not serialized/deserialized");
    return this.albums;
  }
}

export class TimeRange {
  startTimestamp = Exposed.string();
  endTimestamp = Exposed.number();

  get start(): Date {
    return new Date(this.endTimestamp ?? 0);
  }

  get end(): Date {
    return new Date(this.endTimestamp ?? 0);
  }
}

Deno.test("Photo class - basic transformation", () => {
  const photoPlain = {
    id: "1",
    rawFilename: "myphoto.jpg",
    description: "about my photo",
    tags: ["me", "iam"],
    author: {
      id: "2",
      firstName: "Johny",
      lastName: "Cage",
    },
    albums: [
      {
        id: "1",
        name: "My life",
      },
      {
        id: "2",
        name: "My young years",
      },
    ],
    metadata: "I like it",
  };

  const photo = plainToInstance(photoPlain, Photo, ["Vibrant"]);

  assertInstanceOf(photo, Photo);
  assertEquals(photo.id, 1); // Should be converted to number
  assertEquals(photo.filename, "myphoto.jpg");
  assertEquals(photo.description, "about my photo");
  assertEquals(photo.tags, ["me", "iam"]);
  assertEquals(photo.metadata, null); // metadata is toPlainOnly, so not transformed from plain
  assertEquals(photo.mood, "Vibrant");

  assertInstanceOf(photo.author, User);
  assertEquals(photo.author.id, 2);
  assertEquals(photo.author.firstName, "Johny");
  assertEquals(photo.author.lastName, "Cage");

  assertEquals(photo.albums.length, 2);
  assertInstanceOf(photo.albums[0], Album);
  assertEquals(photo.albums[0].id, 1);
  assertEquals(photo.albums[0].name, "My life");
});

Deno.test("Photo class - instance to plain transformation", () => {
  const photo = new Photo("Joyful");
  photo.id = 123;
  photo.filename = "test.jpg";
  photo.description = "test description";
  photo.metadata = "test metadata";
  photo.year = 2020;

  const plain = instanceToPlain(photo);

  assertEquals(plain.id, 123);
  assertEquals(plain.rawFilename, "test.jpg"); // Should use alias
  assertEquals(plain.description, "test description");
  assertEquals(plain.metadata, "test metadata");
  // year is not exposed, so not serialized
  assertEquals(plain.year, undefined);
  // mood should not be serialized as it's not exposed
  assertEquals(plain.mood, undefined);
});

Deno.test("Photo class - roundtrip transformation", () => {
  const originalPlain = {
    id: "42",
    rawFilename: "roundtrip.jpg",
    description: "roundtrip test",
    metadata: "roundtrip metadata",
    author: {
      id: "1",
      firstName: "Test",
      lastName: "User",
    },
    albums: [
      {
        id: "1",
        name: "Test Album",
      },
    ],
  };

  const photo = plainToInstance(originalPlain, Photo, ["Happy"]);
  const backToPlain = instanceToPlain(photo);

  assertEquals(backToPlain.id, 42);
  assertEquals(backToPlain.rawFilename, "roundtrip.jpg");
  assertEquals(backToPlain.description, "roundtrip test");
  assertEquals(backToPlain.metadata, null); // metadata is toPlainOnly, not transformed from plain
  assertEquals(backToPlain.author.id, 1);
  assertEquals(backToPlain.author.firstName, "Test");
  assertEquals(backToPlain.author.lastName, "User");
  assertEquals(backToPlain.albums[0].id, 1);
  assertEquals(backToPlain.albums[0].name, "Test Album");
});

Deno.test("Photo array - plainsToInstances", () => {
  const photosPlain = [
    {
      id: "1",
      rawFilename: "photo1.jpg",
      author: {
        id: "2",
        firstName: "Johny",
        lastName: "Cage",
      },
      albums: [
        {
          id: "1",
          name: "My life",
        },
      ],
    },
    {
      id: "2",
      rawFilename: "photo2.jpg",
      description: "second photo",
      author: {
        id: "3",
        firstName: "Jane",
        lastName: "Doe",
      },
      albums: [],
    },
  ];

  const photos = plainsToInstances(photosPlain, Photo, ["Party"]);

  assertEquals(photos.length, 2);

  assertInstanceOf(photos[0], Photo);
  assertEquals(photos[0].id, 1);
  assertEquals(photos[0].filename, "photo1.jpg");
  assertEquals(photos[0].mood, "Party");

  assertInstanceOf(photos[1], Photo);
  assertEquals(photos[1].id, 2);
  assertEquals(photos[1].filename, "photo2.jpg");
  assertEquals(photos[1].description, "second photo");
  assertEquals(photos[1].mood, "Party");
});

Deno.test("Photo array - instancesToPlains", () => {
  const photo1 = new Photo("Calm");
  photo1.id = 1;
  photo1.filename = "test1.jpg";

  const photo2 = new Photo("Excited");
  photo2.id = 2;
  photo2.filename = "test2.jpg";
  photo2.description = "second test";

  const photos = [photo1, photo2];
  const plains = instancesToPlains(photos);

  assertEquals(plains.length, 2);
  assertEquals(plains[0].id, 1);
  assertEquals(plains[0].rawFilename, "test1.jpg");
  assertEquals(plains[1].id, 2);
  assertEquals(plains[1].rawFilename, "test2.jpg");
  assertEquals(plains[1].description, "second test");
});

Deno.test("TimeRange class - date transformation", () => {
  const plain = {
    startTimestamp: "February 12, 2024 12:30:00",
    endTimestamp: 1613477400000,
  };

  const instance = plainToInstance(plain, TimeRange, []);

  assertInstanceOf(instance, TimeRange);
  assertEquals(instance.startTimestamp, "February 12, 2024 12:30:00");
  assertEquals(instance.endTimestamp, 1613477400000);

  // Test computed properties
  assertInstanceOf(instance.start, Date);
  assertInstanceOf(instance.end, Date);
  assertEquals(instance.end.getTime(), 1613477400000);
});

Deno.test("User class - default values", () => {
  const userPlain = {
    id: "5",
  };

  const user = plainToInstance(userPlain, User, [30]);

  assertInstanceOf(user, User);
  assertEquals(user.id, 5);
  assertEquals(user.firstName, "5050"); // Default value converted to string
  assertEquals(user.lastName, "PLACEHOLDER"); // Default value
  assertEquals(user.age, 30); // Constructor argument
});

Deno.test("Album class - simple transformation", () => {
  const albumPlain = {
    id: "10",
    name: "Test Album",
  };

  const album = plainToInstance(albumPlain, Album, []);

  assertInstanceOf(album, Album);
  assertEquals(album.id, 10);
  assertEquals(album.name, "Test Album");
});

Deno.test("Photo class - empty object with defaults", () => {
  const photo = plainToInstance({}, Photo, ["Silent"]);

  assertInstanceOf(photo, Photo);
  assertEquals(photo.id, 0); // Default value
  assertEquals(photo.filename, "BASE-FILENAME"); // Default value
  assertEquals(photo.mood, "Silent"); // Constructor argument
  assertEquals(photo.year, 1970); // Class field default
});

Deno.test("Photo class - alias functionality", () => {
  const photoPlain = {
    rawFilename: "aliased.jpg", // Using the alias
  };

  const photo = plainToInstance(photoPlain, Photo, ["Test"]);
  assertEquals(photo.filename, "aliased.jpg"); // Should map to filename property

  const backToPlain = instanceToPlain(photo);
  assertEquals(backToPlain.rawFilename, "aliased.jpg"); // Should use alias in output
  assertEquals(backToPlain.filename, undefined); // Original property name shouldn't appear
});

Deno.test("Photo class - getter methods work", () => {
  const photo = new Photo("Test");
  photo.id = 123;
  photo.filename = "test.jpg";

  assertEquals(photo.name, "123_test.jpg"); // Test getter

  // Test method (should not be serialized)
  const albums = photo.getAlbums();
  assertEquals(albums, photo.albums);
});
