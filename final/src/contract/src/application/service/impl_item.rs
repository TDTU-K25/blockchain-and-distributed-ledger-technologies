use crate::models::contract::AuctionContractExt;
use crate::models::item::{ItemId, ItemMetadata};

use crate::models::user::UserId;
use crate::models::{contract::AuctionContract, item::ImplItem};
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, near_bindgen};

fn convert_to_item_id(owner: UserId, name: String) -> String {
    let item = "item ".to_ascii_lowercase();
    let owner_convert = owner.to_string().to_ascii_lowercase();
    let result = item + &name + " " + &owner_convert;
    result.replace(' ', "_")
}

#[near_bindgen]
/// Implement function for item
impl ImplItem for AuctionContract {
    fn create_item(&mut self, name: String, description: String, media: String) -> ItemMetadata {
        let owner_id = env::signer_account_id();
        let item_id = convert_to_item_id(owner_id.clone(), name.clone());
        let item = ItemMetadata {
            item_id: item_id.clone(),

            name,

            description,

            media,

            owner_id: owner_id.clone(),

            created_at: env::block_timestamp_ms(),

            updated_at: env::block_timestamp_ms(),

            is_auction: false,
        };

        let mut set_items = self
            .items_per_user
            .get(&owner_id)
            .or_else(|| {
                let key = String::from("items_") + &owner_id.to_string();
                Some(UnorderedSet::new(key.into_bytes()))
            }) // convert string to byte string
            .unwrap();
        set_items.insert(&item_id);

        self.items_per_user.insert(&owner_id, &set_items);
        self.item_metadata_by_id.insert(&item_id, &item);

        item
    }

    fn get_item_metadata_by_item_id(&self, item_id: ItemId) -> Option<ItemMetadata> {
        self.item_metadata_by_id.get(&item_id)
    }

    fn get_all_items_per_user_own(
        &self,
        user_id: UserId,
        start: Option<u32>,
        limit: Option<u32>,
    ) -> Vec<ItemMetadata> {
        let mut vec_items = Vec::new();
        if self.items_per_user.get(&user_id).is_none() {
            return vec_items;
        }
        let items = self.items_per_user.get(&user_id).unwrap();
        if items.is_empty() {
            return vec_items;
        }
        for item_id in items.iter() {
            let item_metadata = self.get_item_metadata_by_item_id(item_id).unwrap();
            vec_items.push(item_metadata);
        }
        vec_items
    }

    fn update_item(
        &mut self,
        item_id: ItemId,
        name: String,
        description: String,
        media: String,
    ) -> Option<ItemMetadata> {
        let owner_id = env::signer_account_id();

        if let Some(mut item_metadata) = self.get_item_metadata_by_item_id(item_id.clone()) {
            assert_eq!(
                item_metadata.owner_id, owner_id,
                "User does not own the item"
            );

            item_metadata.name = name;
            item_metadata.description = description;
            item_metadata.media = media;
            item_metadata.updated_at = env::block_timestamp_ms();

            self.item_metadata_by_id.insert(&item_id, &item_metadata);
            Some(item_metadata)
        } else {
            None
        }
    }

    fn delete_item(&mut self, item_id: ItemId) -> ItemMetadata {
        let item_found = self.item_metadata_by_id.get(&item_id).unwrap();
        let owner_id = env::signer_account_id();

        let mut set_items = self.items_per_user.get(&owner_id).unwrap();
        set_items.remove(&item_id);

        self.items_per_user.insert(&owner_id, &set_items);
        self.item_metadata_by_id.remove(&item_id);

        item_found
    }
}
