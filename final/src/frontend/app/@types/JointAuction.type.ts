import { Item } from "./Item.type";
import { Pool } from "./Pool.type";

export interface JointAuction {
  joint_auction_id: string;
  set_host_id: string[];
  created_at: number;
  closed_at: number;
  floor_price: number;
  winner: string;
  highest_bid: number;
  set_item_id: string[];
  is_finish: boolean;
  is_open: boolean;
  pool: Pool;
  items: Item[];
}
