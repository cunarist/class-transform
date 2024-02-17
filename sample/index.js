import {
  plainToInstance,
  plainsToInstances,
  instanceToPlain,
  instancesToPlains,
  initExposed,
  NotExposingError,
} from "class-transform";
import { Photo, TimeRange } from "./classes.js";

const divider = "----------------------------------------";
console.log(divider);

// Check replacing fields.

try {
  let photoEmpty = new Photo();
  console.log(photoEmpty);
  console.log(divider);
} catch (error) {
  if (error instanceof NotExposingError) {
    console.log(error.message);
  }
  console.log(divider);
}

let photoEmpty = initExposed(Photo);
photoEmpty.metadata = "blank";
console.log(photoEmpty);
console.log(divider);

let photoPlainEmpty = instanceToPlain(photoEmpty);
console.log(photoPlainEmpty);
console.log(divider);

let photoEmptyNew = plainToInstance(Photo, photoPlainEmpty);
console.log(photoEmptyNew);
console.log(divider);

// Check typing.

let photoPlain = {
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

let photo = plainToInstance(Photo, photoPlain);
photo.year = 2020;
console.log(photo);
console.log(divider);

// Check untyping.

let photoPlainNew = instanceToPlain(photo);
console.log(photoPlainNew);
console.log(divider);

// Type an array.
let photosPlain = [
  {
    id: "1",
    rawFilename: "myphoto.jpg",
    author: {
      id: "2",
      firstName: "Johny",
      lastName: "Cage",
      registrationDate: "1995-12-17T03:24:00",
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
  },
  {
    id: "2",
    rawFilename: "hisphoto.jpg",
    description: "about his photo",
    author: {
      id: "2",
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
  },
];
let photosJson = JSON.stringify(photosPlain, null, 2);

let photos = plainsToInstances(Photo, JSON.parse(photosJson));
console.log(photos);
console.log(divider);

for (const photo of photos) {
  console.log(photo.filename);
}
console.log(divider);

// Check array untyping.

let photosPlainNew = instancesToPlains(photos);
console.log(photosPlainNew);
console.log(divider);

let plain = {
  startTimestamp: "February 12, 2024 12:30:00",
  endTimestamp: 1613477400000,
};

let instance = plainToInstance(TimeRange, plain);
console.log(instance.start);
console.log(instance.end);
console.log(divider);
