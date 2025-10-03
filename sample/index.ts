import {
    instancesToPlains,
    instanceToPlain,
    plainsToInstances,
    plainToInstance,
} from "../src/index.ts";
import { Photo, TimeRange } from "./classes.ts";

const divider = "----------------------------------------";
console.log(divider);

// Check replacing fields.

const photoEmpty = new Photo("Joyful");
photoEmpty.metadata = "blank";
console.log(photoEmpty);
console.log(divider);

const photoPlainEmpty = instanceToPlain(photoEmpty);
console.log(photoPlainEmpty);
console.log(divider);

const photoEmptyNew = plainToInstance(photoPlainEmpty, Photo, ["Silent"]);
console.log(photoEmptyNew);
console.log(divider);

// Check typing.

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
photo.year = 2020;
console.log(photo);
console.log(divider);

// Check untyping.

const photoPlainNew = instanceToPlain(photo);
console.log(photoPlainNew);
console.log(divider);

// Type an array.
const photosPlain = [
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
const photosJson = JSON.stringify(photosPlain, null, 2);

const photos = plainsToInstances(JSON.parse(photosJson), Photo, ["Party"]);
console.log(photos);
console.log(divider);

for (const photo of photos) {
    console.log(`${photo.filename} ${photo.mood}`);
}
console.log(divider);

// Check array untyping.

const photosPlainNew = instancesToPlains(photos);
console.log(photosPlainNew);
console.log(divider);

const plain = {
    startTimestamp: "February 12, 2024 12:30:00",
    endTimestamp: 1613477400000,
};

const instance = plainToInstance(plain, TimeRange, []);
console.log(instance.start);
console.log(instance.end);
console.log(divider);
