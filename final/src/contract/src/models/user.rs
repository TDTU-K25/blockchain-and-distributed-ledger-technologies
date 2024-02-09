use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Balance};

use super::auction::AuctionId;
use super::item::ItemId;

pub type UserId = AccountId;

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct UserMetadata {
    pub user_id: UserId,

    pub name: String,

    pub avatar: Option<String>,

    pub email: Option<String>,

    pub phone: Option<String>,

    pub description: Option<String>,
}

// is necessary?
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonUser {
    /// Unique identifier for the user, of type `UserId`.
    pub user_id: UserId,

    /// Detailed metadata about the user, of type `UserMetadata`.
    pub metadata: UserMetadata,

    /// Map of items that the user has owned.
    /// Keys are of type `ItemId`, and values are of type `ItemMetadata`.
    // pub items: HashMap<ItemId, ItemMetadata>,
    pub items: Vec<ItemId>,

    /// Map of auctions associated with the user.
    /// Keys are of type `AuctionId`, and values are of type `AuctionMetadata`.
    // pub auctions: HashMap<AuctionId, AuctionMetadata>,
    pub auctions_host: Vec<AuctionId>,

    pub auctions_join: Vec<(AuctionId, Balance)>, // bid in that auction
}

/// The `ImplUser` trait defines a set of behaviors associated with a user in the system.
pub trait ImplUser {
    /// Creates a new user with the provided ...
    /// The fields ... are optional.
    fn create_user(
        &mut self,

        name: String,

        avatar: Option<String>,

        email: Option<String>,

        phone: Option<String>,

        description: Option<String>,
    );

    /// Returns a `JsonUser` representation of the user's metadata for the given user ID.
    fn get_user_metadata_by_user_id(&self, user_id: &UserId) -> Option<UserMetadata>;

    /// Update user information
    fn update_user_information(
        &mut self,
        name: String,
        avatar: Option<String>,
        email: Option<String>,
        phone: Option<String>,
        description: Option<String>,
    ) -> UserMetadata;

    fn get_all_users(&self) -> Vec<UserMetadata>;
}
