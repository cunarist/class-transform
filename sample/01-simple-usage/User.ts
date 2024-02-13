import { nest } from "class-transform";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  @nest(Date) registrationDate: Date;
}
