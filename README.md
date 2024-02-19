# `class-transform`

[![Continuous Integration](https://github.com/cunarist/class-transform/workflows/CI/badge.svg)](https://github.com/cunarist/class-transform/actions/workflows/continuous_integration.yml)
[![NPM Version](https://img.shields.io/npm/v/class-transform)](https://badge.fury.io/js/class-transform)
[![Minified Size](https://img.shields.io/bundlejs/size/class-transform)](https://bundlejs.com/?q=class-transform)

Class syntax was introduced to JavaScript in ES6.
Nowadays you are working with typed instances more than ever.
`class-transform` allows you to transform
JSON or plain object into strongly typed instance of a class and vice versa.
This tool is very helpful for both the frontend and backend.

```javascript
// Plain - no type information
{
  id: 1,
  name: 'foo',
  photos: [
    { id: 9, filename: 'cool_whale.jpg', depth: 1245 },
    { id: 10, filename: 'hot_bird.jpg', depth: 6123 }
  ],
  pages: { table: 6, contents: 72 }
}
```

```javascript
// Instance - typed by a class
Album {
  id: 1,
  name: 'foo',
  photos: [
    Photo { id: 9, filename: 'cool_whale.jpg', depth: 1245 },
    Photo { id: 10, filename: 'hot_bird.jpg', depth: 6123 }
  ],
  pages: Pages { table: 6, contents: 72 }
}
```

Started as a fork of [class-transformer](https://github.com/typestack/class-transformer),
this library aims to simplify the API, modernize code, and enhance type safety.
Both JavaScript and TypeScript are fully supported.

## Table of contents

- [`class-transform`](#class-transform)
  - [Table of contents](#table-of-contents)
  - [About this library](#about-this-library)
  - [Samples](#samples)
  - [Functions](#functions)
  - [Methods for exposing fields](#methods-for-exposing-fields)
  - [Strong type safety](#strong-type-safety)
  - [Working with nested structures](#working-with-nested-structures)
  - [Using different property name in plain objects](#using-different-property-name-in-plain-objects)
  - [Providing an initial value](#providing-an-initial-value)
  - [Skipping by direction](#skipping-by-direction)
  - [Using advanced types](#using-advanced-types)
  - [Implicit type conversion](#implicit-type-conversion)
  - [Constructing an instance manually](#constructing-an-instance-manually)

## About this library

In JavaScript, objects can be classified into two categories:

- Plain objects:
  Objects that are instances of `Object` class.
  Sometimes they are called literal objects, when created via `{}` notation.
- Instance objects:
  Instances of classes with own defined constructor, properties and methods.
  Usually you define them via `class` notation.

So, what is the problem?

Sometimes you want to transform plain JavaScript object to an instance of the ES6 class.
Once you've parsed some data from a JSON API or a JSON file with `JSON.parse`,
you have plain JavaScript objects, not instances of a class.

For example you have a list of users in your `users.json` that you are loading:

```json
[
  {
    "id": 1,
    "firstName": "Johny",
    "lastName": "Cage",
    "age": 27
  },
  {
    "id": 2,
    "firstName": "Ismoil",
    "lastName": "Somoni",
    "age": 50
  },
  {
    "id": 3,
    "firstName": "Luke",
    "lastName": "Dacascos",
    "age": 12
  }
]
```

To load the JSON data, you would write the following code.
However, it consists solely of plain objects and lacks type safety.

```javascript
let response = await fetch("users.json");
let plains = await response.json();
// `plains` variable is just an array of plain objects.
// Type checkers cannot help you with `any` type like this.
```

To achieve type-safe programming, you can use `class-transform`.
Purpose of this library is to help you to convert your plain objects
to the instances of classes you have.

```javascript
import { Exposed, plainsToInstances } from "class-transform";

class User {
  id = Exposed.number();
  firstName = Exposed.string();
  lastName = Exposed.string();
  age = Exposed.number();
}

let response = await fetch("users.json");
let instances = plainsToInstances(await response.json(), User, []);
// Now each value in `instances` array is an instance of `User`.
// By converting plain objects into class instances,
// type checking becomes available.
// You can use proper class methods as well.
```

Even inside TypeScript codebases,
using classes for JSON can be advantageous over `interface` and `type` statements
because they are preserved after compilation,
enabling true object-oriented programming for reliable runtime behaviors.

## Samples

Take a look at the [sample code](https://github.com/cunarist/class-transform/tree/main/sample)
for more examples of usages.

## Functions

| Function            | Summary                       |
| ------------------- | ----------------------------- |
| `plainToInstance`   | `Object` to `T`               |
| `plainsToInstances` | `Array<Object>` to `Array<T>` |
| `instanceToPlain`   | `T` to `Object`               |
| `instancesToPlains` | `Array<T>` to `Array<Object>` |

## Methods for exposing fields

All field methods provide proper type hint to TypeScript type checker.

| Field method       | Type hint         | Initial |
| ------------------ | ----------------- | ------- |
| `Exposed.number`   | `number \| null`  | `null`  |
|                    | `number`          | given   |
| `Exposed.numbers`  | `Array<number>`   | `[]`    |
| `Exposed.boolean`  | `boolean \| null` | `null`  |
|                    | `boolean`         | given   |
| `Exposed.booleans` | `Array<boolean>`  | `[]`    |
| `Exposed.string`   | `string \| null`  | `null`  |
|                    | `string `         | given   |
| `Exposed.strings`  | `Array<string>`   | `[]`    |
| `Exposed.struct`   | `T`               | `T {}`  |
| `Exposed.structs`  | `Array<T>`        | `[]`    |

There are also methods for specifying options.

| Option method            | Role                           |
| ------------------------ | ------------------------------ |
| `Exposed.alias`          | Property name in plain objects |
| `Exposed.toInstanceOnly` | Include it only to instance    |
| `Exposed.toPlainOnly`    | Include it only to plain       |

You can combine the effects of these methods by chaining them.
Please note that the type method should come at the _end_ of the chain.

```javascript
class SomeType {
  myField = Exposed.toPlainOnly().alias("my_field").number(36);
}
```

## Strong type safety

Strong type safety is always guaranteed.
A class instance will always have the
exact set of values that match its fields, with the exact types.

`class-transform` only transforms class fields
that are set as `Exposed` with plain objects.
Fields that are not `Exposed` will be ignored.
This applies to both `plainToInstance` and `instanceToPlain`.

```javascript
import { Exposed, plainToInstance, instanceToPlain } from "class-transform";

class User {
  id = Exposed.number(); // number | null
  firstName = Exposed.string(); // string | null
  lastName = Exposed.string("Johnson"); // string
  favorites = Exposed.strings(); // Array<string>
  isKind = true; // boolean
}

let plain = {
  unkownProp: "Hello there",
  firstName: "Umed",
  lastName: "Khudo",
};

// An instance always guarantees the exact shape and types.
let instance = plainToInstance(plain, User, []);
console.log(instance);
// User {
//   id: null,
//   firstName: 'Umed',
//   lastName: 'Khudo',
//   favorites: [],
//   isKind: true
// }

// Transformation is done exactly on `Exposed` fields.
let plainNew = instanceToPlain(instance);
console.log(plainNew);
// {
//   id: null,
//   firstName: 'Umed',
//   lastName: 'Khudo'
//   favorites: [],
// }
```

If a property is missing, `class-transform` will fill it with
the initial value, blank array, or an empty child instance
depending on the field type. If the field is not `Exposed`,
the value will not be included in the transformation at all.

Each type method has a return type that represents the data,
allowing TypeScript's type checker to do its job.
It works well with `"strict": true` of `tsconfig.json`.
If you're using JavaScript, you can set
`tsconfig.json`'s `compilerOptions.checkJs` to `true`
to utilize TypeScript's type checker.

## Working with nested structures

When you are trying to transform objects that have nested objects,
you need to explicitly specify the type of field
by passing the class itself into `Exposed.struct` or `Exposed.structs`.
An array with the class parameters is also needed.

Let's say we have an album with photos.
And we are trying to convert album plain object to class object:

```javascript
import { Exposed } from "class-transform";

class Photo {
  id = Exposed.number(); // number | null
  filename = Exposed.string("HI.jpg"); // string
}

class Album {
  id = Exposed.number(); // number | null
  name = Exposed.string(); // string | null
  tags = Exposed.strings(); // Array<string>
  photo = Exposed.struct(Photo, []); // Photo
  photos = Exposed.structs(Photo, []); // Array<Photo>
  hardCover = true;
}

let instance = new Album();
console.log(instance);
// Album {
//   id: null,
//   name: null,
//   tags: [],
//   photo: Photo {
//     id: null,
//     filename: 'HI.jpg',
//   },
//   photos: [
//     Photo {
//       id: null,
//       filename: 'HI.jpg'
//     },
//     Photo {
//       id: null,
//       filename: 'HI.jpg'
//     }
//   ],
//   hardCover: true
// }
```

## Using different property name in plain objects

If the plain object's property should have a different name,
you can do that by using `Exposed.alias` method.
Please note that the type method should come at the end.

```javascript
import { Exposed, plainToInstance, instanceToPlain } from "class-transform";

class User {
  firstName = Exposed.alias("first_name_raw").string();
  lastName = Exposed.alias("last_name_raw").string();
}

let plain = { first_name_raw: "John", last_name_raw: "Davis" };

let instance = plainToInstance(plain, User, []);
console.log(instance);
// User { firstName: 'John', lastName: 'Davis' }

let plainNew = instanceToPlain(instance);
console.log(plainNew);
// { first_name_raw: 'John', last_name_raw: 'Davis' }
```

This is useful when the JSON API uses snakecase or some other naming conventions.

## Providing an initial value

When a field didn't receive some proper value,
it can get an initial value instead of being filled with `null`.
Simply provide the initial value to the type method.
By doing so, `null` will be removed from the field's type hint.

```javascript
import { Exposed, plainToInstance } from "class-transform";

class User {
  firstName = Exposed.string(); // string | null
  lastName = Exposed.string("Davis"); // string
}

let plain = { firstName: "John" };

let instance = plainToInstance(plain, User, []);
console.log(instance);
// User { firstName: 'John', lastName: 'Davis' }
```

Even when you provide an initial value of a wrong type,
implicit type conversion happens under the hood,
resulting in a completely type-safe instance.

## Skipping by direction

You can control on which operation you will include a field.
Use `Exposed.toInstanceOnly` or `Exposed.toPlainOnly` method.

```typescript
import { Exclude } from "class-transformer";

class User {
  id = Exposed.number();
  email = Exposed.string();
  password = Exposed.toPlainOnly().string();
}
```

Now `password` field will be included
only during the `instanceToPlain` operation.

- `toPlainOnly`: Initial value on `plainToInstance`
- `toInstanceOnly`: Drop on `instanceToPlain`

## Using advanced types

Basically, it's recommended to store only primitive types for fields
to maintain clean structure and transformation.

However, sometimes more advanced types might be needed.
In such cases, you can use getter and setter methods
to process the data from the basic values in the class.

```javascript
import { Exposed, plainToInstance } from "class-transform";

class TimeRange {
  startTimestamp = Exposed.string();
  endTimestamp = Exposed.number();
  get start() {
    return new Date(this.startTimestamp ?? 0);
  }
  get end() {
    return new Date(this.endTimestamp ?? 0);
  }
}

let plain = {
  startTimestamp: "February 12, 2024 12:30:00",
  endTimestamp: 1613477400000,
};

let instance = plainToInstance(plain, TimeRange, []);
console.log(instance.start);
console.log(instance.end);
// 2024-02-12T03:30:00.000Z
// 2021-02-16T12:10:00.000Z
```

## Implicit type conversion

Automatic conversion is provided for fields of primitive types.

```javascript
import { Exposed, plainToInstance } from "class-transform";

class SomeType {
  prop = Exposed.number();
  otherProp = Exposed.string();
}

let plain = { prop: "1234", otherProp: 5678 };

let instance = plainToInstance(plain, SomeType, []);
console.log(instance);
//  { prop: 1234, otherProp: '5678' }
```

## Constructing an instance manually

You can simply use the `new` keyword.
All the `Exposed` fields will get its initial value.

```javascript
import { Exposed } from "class-transform";

class Photo {
  id = Exposed.number();
  filename = Exposed.string("HELLO.jpg");
}

class Album {
  id = Exposed.number(0);
  name = Exposed.string();
  tags = Exposed.strings();
  photo = Exposed.struct(Photo, []);
  hardCover = true;

  /** @param {number} pages */
  constuctor(pages) {
    this.pages = pages;
  }
}

let instance = new Album(82);
console.log(instance);
// Album {
//   id: 0,
//   name: null,
//   tags: [],
//   photo: Photo {
//     id: null,
//     filename: 'HELLO.jpg',
//   },
//   hardCover: true,
//   pages: 82
// }
```
