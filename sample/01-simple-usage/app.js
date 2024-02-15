// @ts-check

import { plainToInstance, instanceToPlain } from "class-transform";
import { Photo } from "./Photo.js";

const divider = "----------------------------------------";
console.log(divider);

// Check typing.

let photoPlain = {
  id: "1",
  filename: "myphoto.jpg",
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

// Type an array.
let photosPlain = [
  {
    id: "1",
    filename: "myphoto.jpg",
    description: "about my photo",
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
    filename: "hisphoto.jpg",
    description: "about his photo",
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
  },
];

let photos = plainToInstance(Photo, photosPlain);
console.log(photos);
console.log(divider);

// Check array untyping.

let newPhotosPlain = instanceToPlain(photos);
console.log(newPhotosPlain);
console.log(divider);
