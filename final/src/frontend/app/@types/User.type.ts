import { Item } from "./Item.type";

export interface User {
  user_id: string;
  name: string | null;
  avatar: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
  address: string | null;
  items: Item[];
}
