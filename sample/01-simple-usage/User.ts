import { nested } from "class-transform";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  @nested(Date) registrationDate: Date;
}
