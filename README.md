> This library is a fork of the original
> [`class-transformer`](https://github.com/typestack/class-transformer) package.
> Its goal is to enhance API usability through continuous updates.
> This project will be maintained and will always accept pull requests.
> Please note that the API is still subject to changes.

# `class-transform`

[![Continuous Integration](https://github.com/cunarist/class-transform/workflows/CI/badge.svg)](https://github.com/cunarist/class-transform/actions/workflows/continuous_integration.yml)
[![NPM Version](https://img.shields.io/npm/v/class-transform)](https://badge.fury.io/js/class-transform)

It's ES6 and Typescript era.
Nowadays you are working with classes and instances more than ever.
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
    - [plainToInstance](#plaintoinstance)
    - [instanceToPlain](#instancetoplain)
    - [instanceToInstance](#instancetoinstance)
  - [Enforcing type-safe instance](#enforcing-type-safe-instance)
  - [Working with nested objects](#working-with-nested-objects)
    - [Providing more than one type option](#providing-more-than-one-type-option)
  - [Exposing getters and method return values](#exposing-getters-and-method-return-values)
  - [Exposing properties with different names](#exposing-properties-with-different-names)
  - [Skipping specific properties](#skipping-specific-properties)
  - [Skipping depend of operation](#skipping-depend-of-operation)
  - [Skipping all properties of the class](#skipping-all-properties-of-the-class)
  - [Skipping private properties, or some prefixed properties](#skipping-private-properties-or-some-prefixed-properties)
  - [Using groups to control excluded properties](#using-groups-to-control-excluded-properties)
  - [Using versioning to control exposed and excluded properties](#using-versioning-to-control-exposed-and-excluded-properties)
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

Sometimes you want to transform plain javascript object to an instance of the ES6 class.
Once you've parsed some data from some JSON API or a JSON file with `JSON.parse`,
you have a plain javascript object, not an instance of a class.

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

To load JSON data, you would write the following code. However, it consists solely of plain objects and lacks type safety.

```typescript
let response = await fetch("users.json");
let users: any = await response.json();
// `users` variable is just an array of plain objects.
// TypeScript compiler cannot help you with `any` type like this.
```

To achieve object-oriented programming, you can use `class-transform`.
Purpose of this library is to help you to convert your plain javascript
objects to the instances of classes you have.

```typescript
import { plainToInstance } from "class-transform";

class User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  getName() {
    return this.firstName + " " + this.lastName;
  }
  isAdult() {
    return this.age > 36 && this.age < 60;
  }
}

let response = await fetch("users.json");
let realUsers: Array<User> = plainToInstance(User, await response.json());
// Now each value in `realUsers` is an instance of the `User` class.

realUsers[0].getName();
realUsers[0].isAdult();
// By converting plain objects into class instances,
// the compiler's type checking becomes available.
// You can use class methods as well.
```

Using classes for JSON can be advantageous over TypeScript's `interface` and `type` statements because they are preserved after compilation, enabling true object-oriented programming for type-safe runtime behaviors.

## Functions

### plainToInstance

Transforms a plain javascript object to instance of specific class.

```typescript
import { plainToInstance } from "class-transform";
let users = plainToInstance(User, userPlain);
```

### instanceToPlain

Transforms your class object back to plain javascript object, that can be `JSON.stringify`ed later.

```typescript
import { instanceToPlain } from "class-transform";
let photoPlain = instanceToPlain(photo);
```

### instanceToInstance

Transforms your class object into a new instance of the class object.
This may be treated as deep clone of your objects.

```typescript
import { instanceToInstance } from "class-transform";
let photo = instanceToInstance(photo);
```

You can also use an `ignoreDecorators` option in transformation options to ignore all decorators your classes are using.

## Enforcing type-safe instance

The default behaviour of the `plainToInstance` method is to set _all_ properties from the plain object,
even those which are not specified in the class.

```typescript
import { plainToInstance } from "class-transform";

class User {
  id: number;
  firstName: string;
  lastName: string;
}

let userPlain = {
  unkownProp: "hello there",
  firstName: "Umed",
  lastName: "Khudoiberdiev",
};

console.log(plainToInstance(User, userPlain));

// User {
//   unkownProp: 'hello there',
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev',
// }
```

If this behaviour does not suit your needs, you can use the `excludeExtraneousValues` option
in the `plainToInstance` method while _exposing all your class properties_ as a requirement.

```typescript
import { expose, plainToInstance } from "class-transform";

class User {
  @expose() id: number;
  @expose() firstName: string;
  @expose() lastName: string;
}

let userPlain = {
  unkownProp: "hello there",
  firstName: "Umed",
  lastName: "Khudoiberdiev",
};

console.log(
  plainToInstance(User, userPlain, { excludeExtraneousValues: true }),
);

// User {
//   id: undefined,
//   firstName: 'Umed',
//   lastName: 'Khudoiberdiev'
// }
```

## Working with nested objects

When you are trying to transform objects that have nested objects,
it's necessary to know which type you should transform the object into.
Since TypeScript does not yet have robust reflection abilities,
we need to explicitly specify the type of object each property contains.
This is accomplished using the `@nested` decorator.

Lets say we have an album with photos.
And we are trying to convert album plain object to class object:

```typescript
import { nested, plainToInstance } from "class-transform";

class Album {
  id: number;
  name: string;
  @nested(Photo) photos: Array<Photo>;
}

class Photo {
  id: number;
  filename: string;
}

let album = plainToInstance(Album, albumPlain);
// now album is Album object with Photo objects inside
```

### Providing more than one type option

In case the nested object can be of different types, you can provide an additional options object,
that specifies a discriminator. The discriminator option must define a `property` that holds the subtype
name for the object and the possible `subTypes` that the nested object can converted to. A sub type
has a `value`, that holds the constructor of the Type and the `name`, that can match with the `property`
of the discriminator.

Lets say we have an album that has a top photo. But this photo can be of certain different types.
And we are trying to convert album plain object to class object. The plain object input has to define
the additional property `__type`. This property is removed during transformation by default:

**JSON input**:

```json
{
  "id": 1,
  "name": "foo",
  "topPhoto": {
    "id": 9,
    "filename": "cool_whale.jpg",
    "depth": 1245,
    "__type": "underwater"
  }
}
```

```typescript
import { nested, plainToInstance } from "class-transform";

class Photo {
  id: number;
  filename: string;
}

class Landscape extends Photo {
  panorama: boolean;
}

class Portrait extends Photo {
  person: Person;
}

class UnderWater extends Photo {
  depth: number;
}

class Album {
  id: number;
  name: string;

  @nested(Photo, {
    discriminator: {
      property: "__type",
      subTypes: [
        { value: Landscape, name: "landscape" },
        { value: Portrait, name: "portrait" },
        { value: UnderWater, name: "underwater" },
      ],
    },
  })
  topPhoto: Landscape | Portrait | UnderWater;
}

let album = plainToInstance(Album, albumPlain);
// now album is Album object with a UnderWater object without `__type` property.
```

Hint: The same applies for arrays with different sub types. Moreover you can specify `keepDiscriminatorProperty: true`
in the options to keep the discriminator property also inside your resulting class.

## Exposing getters and method return values

You can expose what your getter or method return by setting an `@expose()` decorator to those getters or methods:

```typescript
import { expose } from "class-transform";

class User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;

  @expose()
  get name() {
    return this.firstName + " " + this.lastName;
  }

  @expose()
  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
```

## Exposing properties with different names

If you want to expose some of the properties with a different name,
you can do that by specifying a `name` option to `@expose` decorator:

```typescript
import { expose } from "class-transform";

class User {
  @expose({ name: "uid" })
  id: number;
  firstName: string;
  lastName: string;
  @expose({ name: "secretKey" })
  password: string;

  @expose({ name: "fullName" })
  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
```

## Skipping specific properties

Sometimes you want to skip some properties during transformation.
This can be done using `@exclude` decorator:

```typescript
import { expose } from "class-transform";

class User {
  id: number;
  email: string;
  @exclude()
  password: string;
}
```

Now when you transform a User, the `password` property will be skipped and not be included in the transformed result.

## Skipping depend of operation

You can control on what operation you will exclude a property. Use `toInstanceOnly` or `toPlainOnly` options:

```typescript
import { expose } from "class-transform";

class User {
  id: number;
  email: string;
  @exclude({ toPlainOnly: true })
  password: string;
}
```

Now `password` property will be excluded only during `instanceToPlain` operation. Vice versa, use the `toInstanceOnly` option.

## Skipping all properties of the class

You can skip all properties of the class, and expose only those are needed explicitly:

```typescript
import { exclude, expose } from "class-transform";

@exclude()
class User {
  @expose()
  id: number;
  @expose()
  email: string;
  password: string;
}
```

Now `id` and `email` will be exposed, and password will be excluded during transformation.
Alternatively, you can set exclusion strategy during transformation:

```typescript
import { instanceToPlain } from "class-transform";
let photo = instanceToPlain(photo, { strategy: "excludeAll" });
```

In this case you don't need to `@exclude()` a whole class.

## Skipping private properties, or some prefixed properties

If you name your private properties with a prefix, lets say with `_`,
then you can exclude such properties from transformation too:

```typescript
import { instanceToPlain } from "class-transform";
let photo = instanceToPlain(photo, { excludePrefixes: ["_"] });
```

This will skip all properties that start with `_` prefix.
You can pass any number of prefixes and all properties that begin with these prefixes will be ignored.
For example:

```typescript
import { expose, instanceToPlain } from "class-transform";

class User {
  id: number;
  private _firstName: string;
  private _lastName: string;
  _password: string;

  setName(firstName: string, lastName: string) {
    this._firstName = firstName;
    this._lastName = lastName;
  }

  @expose()
  get name() {
    return this._firstName + " " + this._lastName;
  }
}

let user = new User();
user.id = 1;
user.setName("Johny", "Cage");
user._password = "123";

let userPlain = instanceToPlain(user, { excludePrefixes: ["_"] });
// here userPlain will be equal to
// { id: 1, name: "Johny Cage" }
```

## Using groups to control excluded properties

You can use groups to control what data will be exposed and what will not be:

```typescript
import { exclude, expose, instanceToPlain } from "class-transform";

class User {
  id: number;

  name: string;

  @expose({ groups: ["user", "admin"] }) // this means that this data will be exposed only to users and admins
  email: string;

  @expose({ groups: ["user"] }) // this means that this data will be exposed only to users
  password: string;
}

let user1 = instanceToPlain(user, { groups: ["user"] }); // will contain id, name, email and password
let user2 = instanceToPlain(user, { groups: ["admin"] }); // will contain id, name and email
```

## Using versioning to control exposed and excluded properties

If you are building an API that has different versions, class-transform has extremely useful tools for that.
You can control which properties of your model should be exposed or excluded in what version. Example:

```typescript
import { exclude, expose, instanceToPlain } from "class-transform";

class User {
  id: number;
  name: string;
  @expose({ since: 0.7, until: 1 }) // this means that this property will be exposed for version starting from 0.7 until 1
  email: string;
  @expose({ since: 2.1 }) // this means that this property will be exposed for version starting from 2.1
  password: string;
}

let user1 = instanceToPlain(user, { version: 0.5 }); // will contain id and name
let user2 = instanceToPlain(user, { version: 0.7 }); // will contain id, name and email
let user3 = instanceToPlain(user, { version: 1 }); // will contain id and name
let user4 = instanceToPlain(user, { version: 2 }); // will contain id and name
let user5 = instanceToPlain(user, { version: 2.1 }); // will contain id, name and password
```

## Сonverting date strings into Date objects

Sometimes you have a Date in your plain javascript object received in a string format.
And you want to create a real javascript Date object from it.
You can do it simply by passing a Date object to the `@nested` decorator:

```typescript
import { nested } from "class-transform";

class User {
  id: number;
  email: string;
  password: string;
  @nested(Date) registrationDate: Date;
}
```

Same technique can be used with `Number`, `String`, `Boolean`
primitive types when you want to convert your values into these types.

## Working with arrays

When you are using arrays you must provide a type of the object that array contains.
This type, you specify in a `@nested()` decorator:

```typescript
import { nested } from "class-transform";

class Photo {
  id: number;
  name: string;
  @nested(Album) albums: Array<Album>;
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

  @nested(Date)
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

> **NOTE** If you use class-validator together with class-transform you propably DON'T want to enable this function.

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
