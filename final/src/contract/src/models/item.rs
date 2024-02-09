use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

use super::user::UserId;

pub type ItemId = String;

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct ItemMetadata {
    pub item_id: ItemId,

    pub name: String,

    pub description: String,

    pub media: String,

    pub owner_id: UserId,

    /// timestamp
    pub created_at: u64,

    pub updated_at: u64,

    pub is_auction: bool,
}

pub trait ImplItem {
    fn create_item(
        &mut self,
        name: String,

        description: String,

        media: String,
    ) -> ItemMetadata;

    fn get_item_metadata_by_item_id(&self, item_id: ItemId) -> Option<ItemMetadata>;

    /// Get all the item per user have. Current but without successful auction items
    fn get_all_items_per_user_own(
        &self,
        user_id: UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<ItemMetadata>;

    fn update_item(&mut self, item_id: ItemId, name: String, description: String, media: String) -> Option<ItemMetadata> ;

    fn delete_item(&mut self, item_id: ItemId) -> ItemMetadata;
}
