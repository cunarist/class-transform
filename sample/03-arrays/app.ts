import { instanceToPlain, plainToInstance } from "class-transform";
import { Photo } from "./Photo";

// check deserialization

let photoJson = {
  id: "1",
  filename: "myphoto.jpg",
  description: "about my photo",
  tags: ["me", "iam"],
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
};

let photo = plainToInstance(Photo, photoJson);
console.log("deserialized object: ", photo);
console.log("-----------------------------");

// now check serialization

let newPhotoJson = instanceToPlain(photo);
console.log("serialized object: ", newPhotoJson);
console.log("-----------------------------");