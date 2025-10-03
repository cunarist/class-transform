import { Exposed } from "../src/index.ts";

export class Album {
    id = Exposed.number();
    name = Exposed.string();
}

export class User {
    id = Exposed.number();
    firstName = Exposed.string(5050);
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
