# `class-transform`

[![Continuous Integration](https://github.com/cunarist/class-transform/workflows/CI/badge.svg)](https://github.com/cunarist/class-transform/actions/workflows/continuous_integration.yml)
[![NPM Version](https://img.shields.io/npm/v/class-transform)](https://badge.fury.io/js/class-transform)

Class syntax was introduced to JavaScript in ES6.
Nowadays you are working with typed instances more than ever.
`class-transform` allows you to transform
JSON or plain object into typed instance of a class and vice versa.
This tool is super useful on both frontend and backend.

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

## Table of contents

- [`class-transform`](#class-transform)
  - [Table of contents](#table-of-contents)
  - [About this library](#about-this-library)
  - [Functions](#functions)
  - [Exposed field types](#exposed-field-types)
  - [Type safety](#type-safety)
  - [Working with nested structures](#working-with-nested-structures)
  - [Constucting an instance](#constucting-an-instance)
  - [Giving different property name for plain objects](#giving-different-property-name-for-plain-objects)
  - [Exposing getters and method return values](#exposing-getters-and-method-return-values)
  - [Сonverting date strings into Date objects](#сonverting-date-strings-into-date-objects)
  - [Working with arrays](#working-with-arrays)
  - [Additional data transformation](#additional-data-transformation)
    - [Basic usage](#basic-usage)
    - [Advanced usage](#advanced-usage)
  - [Working with generics](#working-with-generics)
  - [Implicit type conversion](#implicit-type-conversion)
  - [How does it handle circular references?](#how-does-it-handle-circular-references)
  - [Samples](#samples)
  - [Release notes](#release-notes)

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

To load JSON data, you would write the following code.
However, it consists solely of plain objects and lacks type safety.

```javascript
let response = await fetch("users.json");
let users = await response.json();
// `users` variable is just an array of plain objects.
// Type checkers cannot help you with `any` type like this.
```

To achieve object-oriented programming, you can use `class-transform`.
Purpose of this library is to help you to convert your plain JavaScript
objects to the instances of classes you have.

```javascript
import { Exposed, plainToInstance } from "class-transform";

class User {
  id = Exposed.number();
  firstName = Exposed.string();
  lastName = Exposed.string();
  age = Exposed.number();
}

let response = await fetch("users.json");
let realUsers = plainToInstance(User, await response.json());
// Now each value in `realUsers` array is an instance of `User`.
// By converting plain objects into class instances,
// type checking becomes available.
// You can use proper class methods as well.
```

Even inside TypeScript codebases,
using classes for JSON can be advantageous over `interface` and `type` statements
because they are preserved after compilation,
enabling true object-oriented programming for type-safe runtime behaviors.

## Functions

Detailed information about each function is written as doc comments.

`nullifyExposed`:

```javascript
import { nullifyExposed } from "class-transform";
let user = nullifyExposed(new User());
```

`plainToInstance`:

```javascript
import { plainToInstance } from "class-transform";
let users = plainToInstance(User, userPlain);
```

`instanceToPlain`:

```javascript
import { instanceToPlain } from "class-transform";
let photoPlain = instanceToPlain(photo);
```

## Exposed field types

All field functions provide proper type hints to the IDE.

- `Exposed.number`: `number` or `null`, default `null`
- `Exposed.numbers`: `Array<number>`, default `[]`
- `Exposed.boolean`: `boolean` or `null`, default `null`
- `Exposed.booleans`: `Array<boolean>`, default `[]`
- `Exposed.string`: `string` or `null`, default `null`
- `Exposed.strings`: `Array<string>`, default `[]`
- `Exposed.struct`: `T`, default `T {}`
- `Exposed.structs`: `Array<T>`, default `[]`

## Type safety

Type safety is always enforced.

`class-transform` only shares class fields
that are set as `Exposed` with plain objects.
Fields that are not `Exposed` will be ignored.
This applies to both `plainToInstance` and `instanceToPlain`.

```javascript
import { Exposed, plainToInstance, instanceToPlain } from "class-transform";

class User {
  id = Exposed.number();
  firstName = Exposed.string();
  lastName = Exposed.string();
  isKind = true;
}

let userPlain = {
  unkownProp: "hello there",
  firstName: "Umed",
  lastName: "Khudoiberdiev",
};

let userInstance = plainToInstance(User, userPlain);
console.log(userInstance);
// User {
//   id: null,
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev',
//   isKind: true
// }

let userPlainNew = instanceToPlain(userInstance);
console.log(userPlainNew);
// {
//   id: null,
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev',
// }
```

## Working with nested structures

When you are trying to transform objects that have nested objects,
it's necessary to know which type you should transform the object into.
You need to explicitly specify the type of object each property contains
by passing the class itself into `Exposed.struct` or `Exposed.structs`.

Lets say we have an album with photos.
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
  photos = Exposed.structs(Photo);
}

let album = plainToInstance(Album, albumPlain);
// Now `album` is `Album` instance with `Photo` instances inside.
```

## Constucting an instance

Because fields that are marked with `Exposed`
don't actually have a valid value upon creation,
you need to explicitly wrap the instance with `nullifyExposed`
after construction to use them properly,
if the class includes `Exposed` fields.

```javascript
import { nullifyExposed } from "class-transform";
let album = nullifyExposed(new Album());
```

## Giving different property name for plain objects

If the plain object's property should have a different name,
you can do that by specifying a `plainName` option in `@include` decorator:

```typescript
import { include } from "class-transform";

class User {
  id: number;
  @include({ plainName: "first_name" })
  firstName: string;
  @include({ plainName: "last_name" })
  lastName: string;
  password: string;
}
```

This is useful when the JSON API uses snakecase or weird naming convention.

## Exposing getters and method return values

You can mark that your getter or method returns something by setting an `@include()` decorator to those getters or methods:

```typescript
import { include } from "class-transform";

class User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;

  @include()
  get name() {
    return this.firstName + " " + this.lastName;
  }

  @include()
  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
```

## Сonverting date strings into Date objects

Sometimes you have a Date in your plain JavaScript object received in a string format.
And you want to create a real JavaScript Date object from it.
You can do it simply by passing a Date object to the `@nest` decorator:

```typescript
import { nest } from "class-transform";

class User {
  id: number;
  email: string;
  password: string;
  @nest(Date) registrationDate: Date;
}
```

Same technique can be used with `Number`, `String`, `Boolean`
primitive types when you want to convert your values into these types.

## Working with arrays

When you are using arrays you must provide a type of the object that array contains.
This type, you specify in a `@nest()` decorator:

```typescript
import { nest } from "class-transform";

class Photo {
  id: number;
  name: string;
  @nest(Album) albums: Array<Album>;
}
```

This library will handle the transformation automatically.

## Additional data transformation

### Basic usage

You can perform additional data transformation using `@transform` decorator.
For example, you want to make your `Date` object to be a `moment` object when you are
transforming object from plain to class:

```typescript
import { transform } from "class-transform";
import * as moment from "moment";
import { Moment } from "moment";

class Photo {
  id: number;

  @nest(Date)
  @transform(({ value }) => moment(value), { toInstanceOnly: true })
  date: Moment;
}
```

Now when you call `plainToInstance` and send a plain representation of the Photo object,
it will convert a date value in your photo object to moment date.
`@transform` decorator also supports groups and versioning.

### Advanced usage

The `@transform` decorator is given more arguments to let you configure how you want the transformation to be done.

```ts
@transform(({ value, key, obj, type }) => value)
```

| Argument  | Description                                             |
| --------- | ------------------------------------------------------- |
| `value`   | The property value before the transformation.           |
| `key`     | The name of the transformed property.                   |
| `obj`     | The transformation source object.                       |
| `type`    | The transformation type.                                |
| `options` | The options object passed to the transformation method. |

## Working with generics

Generics are not supported because TypeScript does not have good reflection abilities.

## Implicit type conversion

> **NOTE** If you use class-validator together with `class-transform`, you propably DON'T want to enable this function.

Enables automatic conversion between built-in types based on type information provided by Typescript. Disabled by default.

```ts
import { IsString } from "class-validator";

class MyPayload {
  @IsString()
  prop: string;
}

let result1 = plainToInstance(
  MyPayload,
  { prop: 1234 },
  { enableImplicitConversion: true },
);
let result2 = plainToInstance(
  MyPayload,
  { prop: 1234 },
  { enableImplicitConversion: false },
);

/**
 *  result1 will be `{ prop: "1234" }` - notice how the prop value has been converted to string.
 *  result2 will be `{ prop: 1234 }` - default behaviour
 */
```

## How does it handle circular references?

Circular references are ignored.
For example, if you are transforming class `User` that contains property `photos` with type of `Photo`,
and `Photo` contains link `user` to its parent `User`, then `user` will be ignored during transformation.
Circular references are not ignored only during `instanceToInstance` operation.

## Samples

Take a look on [samples](https://github.com/cunarist/class-transform/tree/main/sample) for more examples of
usages.

## Release notes

See information about breaking changes and release notes [here](https://github.com/cunarist/class-transform/tree/main/CHANGELOG.md).
