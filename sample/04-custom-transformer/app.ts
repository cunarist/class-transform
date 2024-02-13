import { plainToInstance, instanceToPlain } from "class-transform";
import { User } from "./User";

let userPlain = {
  id: 1,
  name: "Johny Cage",
  date: new Date().valueOf(),
};

console.log(plainToInstance(User, userPlain));

let user = new User();
user.id = 1;
user.name = "Johny Cage";
user.date = new Date();

console.log(instanceToPlain(user));
