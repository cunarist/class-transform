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
Once you've parsed some data from some JSON API or a JSON file with `JSON.parse`,
you have a plain JavaScript object, not an instance of a class.

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

To achieve object-oriented programming, you can use `class-transform`.
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
let instances = plainsToInstances(User, await response.json());
// Now each value in `instances` array is an instance of `User`.
// By converting plain objects into class instances,
// type checking becomes available.
// You can use proper class methods as well.
```

Even inside TypeScript codebases,
using classes for JSON can be advantageous over `interface` and `type` statements
because they are preserved after compilation,
enabling true object-oriented programming for type-safe runtime behaviors.

## Samples

Take a look on [samples](https://github.com/cunarist/class-transform/tree/main/sample)
for more examples of usages.

## Functions

| Function            | Summary                               |
| ------------------- | ------------------------------------- |
| `plainToInstance`   | `Object` to `SomeType`                |
| `plainsToInstances` | `Array<Object>` to `Array<SomeType>`  |
| `instanceToPlain`   | `SomeType` to `Object`                |
| `instancesToPlains` | `Array<SomeType>` to `Array<Object>`  |
| `initExposed`       | Init all `Exposed` with initial value |

```javascript
import { plainToInstance } from "class-transform";
let instance = plainToInstance(SomeType, { ... });
```

```javascript
import { initExposed } from "class-transform";
let instance = initExposed(new SomeType());
```

Detailed information about each function is written as doc comments.

## Methods for exposing fields

All field methods provide proper type hints to TypeScript type checker.

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
| `Exposed.toInstanceOnly` | Include only to instance       |
| `Exposed.toPlainOnly`    | Include only to plain          |

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
  id = Exposed.number();
  firstName = Exposed.string();
  lastName = Exposed.string();
  favorites = Exposed.strings();
  isKind = true;
}

let plain = {
  unkownProp: "Hello there",
  firstName: "Umed",
  lastName: "Khudoiberdiev",
};

// An instance always guarantees the exact shape and types.
let instance = plainToInstance(User, plain);
console.log(instance);
// User {
//   id: null,
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev',
//   favorites: [],
//   isKind: true
// }

// Transformation is done exactly on `Exposed` fields.
let plainNew = instanceToPlain(instance);
console.log(plainNew);
// {
//   id: null,
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev'
//   favorites: [],
// }
```

If a value is missing, `class-transform` will fill it with
`null`, blank array, or an empty child instance
depending on the field type. If the field is not `Exposed`,
the value will not be included in the transformation at all.

Each type method has a return type that represents the data,
allowing TypeScript's type checker to do its job.
It also works well with `"strict": true` of `tsconfig.json`.
If you're using JavaScript, you can add `// @ts-check` at the top of your file,
or set `tsconfig.json`'s `compilerOptions.checkJs` to `true`,
to utilize TypeScript's type checker.

## Working with nested structures

When you are trying to transform objects that have nested objects,
it's necessary to know which type you should transform the object into.
You need to explicitly specify the type of field
by passing the class itself into `Exposed.struct` or `Exposed.structs`.

Let's say we have an album with photos.
And we are trying to convert album plain object to class object:

```javascript
import { Exposed, plainToInstance } from "class-transform";

class Photo {
  id = Exposed.number();
  filename = Exposed.string();
}

class Album {
  id = Exposed.number();
  name = Exposed.string();
  photo = Exposed.struct(Photo); // Photo
  photos = Exposed.structs(Photo); // Array<Photo>
}

let instance = plainToInstance(Album, plain);
console.log(instance);
// Album {
//   id: ...,
//   name: ...,
//   photo: Photo {
//     id: ...,
//     filename: ...,
//   },
//   photos: [
//     Photo {
//       id: ...,
//       filename: ...,
//     },
//     Photo {
//       id: ...,
//       filename: ...,
//     }
//   }
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

let instance = plainToInstance(User, plain);
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

let instance = plainToInstance(User, plain);
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

- `toPlainOnly`: `null` or initial value on `plainToInstance`
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

let instance = plainToInstance(TimeRange, plain);
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

let instance = plainToInstance(SomeType, plain);
console.log(instance);
//  { prop: 1234, otherProp: '5678' }
```

## Constructing an instance manually

To create a class instance that has `Exposed` in it,
you _must_ use the `initExposed` function instead of the `new` keyword.
This is because fields that are marked with `Exposed`
don't actually have a valid value upon creation.

```javascript
import { Exposed, initExposed } from "class-transform";

class Photo {
  id = Exposed.number();
  filename = Exposed.string("HI.jpg"); // Initial value
}

class Album {
  id = Exposed.number();
  name = Exposed.string();
  tags = Exposed.strings();
  photo = Exposed.struct(Photo);
  hardCover = true;
}

let instance = initExposed(Album);
console.log(instance);
// Album {
//   id: null,
//   name: null,
//   tags: [],
//   photo: Photo {
//     id: null,
//     filename: 'HI.jpg',
//   },
//   hardCover: true
// }
```

If you try to create an instance with `Exposed`
by using `new SomeType()` syntax, `NotExposingError` will be thrown.
