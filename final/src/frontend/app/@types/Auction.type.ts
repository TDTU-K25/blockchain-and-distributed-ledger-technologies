import { Item } from "./Item.type";
import { User } from "./User.type";

export interface Auction {
  auction_id: string;
  host_id: string;
  created_at: number;
  closed_at: number;
  floor_price: number;
  winner: string;
  highest_bid: number;
  users_join_auction: User[];
  item_id: string;
  item_metadata: Item;
  is_finish: boolean;
}
