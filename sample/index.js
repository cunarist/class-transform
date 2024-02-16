// @ts-check

import {
  plainToInstance,
  instanceToPlain,
  nullifyExposed,
} from "class-transform";
import { Photo, TimeRange } from "./classes.js";

const divider = "----------------------------------------";
console.log(divider);

// Check replacing fields.

let photoEmpty = nullifyExposed(new Photo());
console.log(photoEmpty);
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

let newPhotoPlain = instanceToPlain(photo);
console.log(newPhotoPlain);
console.log(divider);

// Check stringifying.

let photojson = JSON.stringify(newPhotoPlain, null, 2);
console.log(photojson);
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

let photos = plainToInstance(Photo, photosPlain);
console.log(photos);
console.log(divider);

// Check array untyping.

let newPhotosPlain = instanceToPlain(photos);
console.log(newPhotosPlain);
console.log(divider);

let plain = {
  startTimestamp: "February 12, 2024 12:30:00",
  endTimestamp: 1613477400000,
};

let instance = plainToInstance(TimeRange, plain);
console.log(instance.start);
console.log(instance.end);
console.log(divider);
