import { plainToInstance, instanceToPlain } from "class-transform";
import { User } from "./User";

let userJson = {
  id: 1,
  name: "Johny Cage",
  date: new Date().valueOf(),
};

console.log(plainToInstance(User, userJson));

const user = new User();
user.id = 1;
user.name = "Johny Cage";
user.date = new Date();

console.log(instanceToPlain(user));
