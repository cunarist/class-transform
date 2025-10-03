// Simple test to verify the library works correctly
import { Exposed, instanceToPlain, plainToInstance } from "../src/index.ts";

class Person {
  name = Exposed.string();
  age = Exposed.number();
}

// Test plainToInstance
const plain = { name: "John", age: 30 };
const person = plainToInstance(plain, Person, []);

console.log("plainToInstance test:");
console.log("Person instance:", person);
console.log("Is instance of Person:", person instanceof Person);

// Test instanceToPlain
const backToPlain = instanceToPlain(person);
console.log("\ninstanceToPlain test:");
console.log("Back to plain:", backToPlain);

console.log("\nAll tests passed! ✅");
