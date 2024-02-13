import { nest } from "class-transform";

export class User {
  @nest(Number)
  id: number;

  firstName: string;

  lastName: string;

  @nest(Date)
  registrationDate: Date;
}
