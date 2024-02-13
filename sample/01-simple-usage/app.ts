import { plainToInstance, instanceToPlain } from "class-transform";
import { Photo } from "./Photo";

// check deserialization

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
      idPlain: "1",
      name: "My life",
    },
    {
      idPlain: "2",
      name: "My young years",
    },
  ],
};

let photo = plainToInstance(Photo, photoPlain);
console.log("deserialized object: ", photo);

// now check serialization

let newPhotoPlain = instanceToPlain(photo);
console.log("serialized object: ", newPhotoPlain);

// try to deserialize an array
console.log("-------------------------------");

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
        idPlain: "1",
        name: "My life",
      },
      {
        idPlain: "2",
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
        idPlain: "1",
        name: "My life",
      },
      {
        idPlain: "2",
        name: "My young years",
      },
    ],
  },
];

let photos = plainToInstance(Photo, photosPlain);
console.log("deserialized array: ", photos);

// now check array serialization

let newPhotosPlain = instanceToPlain(photos);
console.log("serialized array: ", newPhotosPlain);
