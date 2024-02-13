import { exclude, include } from "class-transform";

@exclude()
export class Album {
  @include({ plainName: "idPlain" })
  id: string;
  name: string;
}
