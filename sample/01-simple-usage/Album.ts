import { exclude, include } from "class-transform";

@exclude()
export class Album {
  @include()
  id: string;
  name: string;
}
