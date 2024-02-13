import { nested } from "class-transform";

export class User {
  @nested(Number)
  id: number;

  firstName: string;

  lastName: string;

  @nested(Date)
  registrationDate: Date;
}
