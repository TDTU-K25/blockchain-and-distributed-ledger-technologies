use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

use near_sdk::Balance;

use super::{auction::AuctionId, user::UserId};

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct BidTransaction {
    pub auction_id: AuctionId,
    pub owner_id: UserId,
    pub total_bid: Balance,
    pub updated_at: u64,
}
