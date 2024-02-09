use near_sdk::{
    collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet},
    json_types::Base64VecU8,
    near_bindgen,
    serde::{Deserialize, Serialize},
    AccountId, PanicOnDefault,
};

use crate::borsh::{self, BorshDeserialize, BorshSerialize};

use super::{
    auction::{AuctionId, AuctionMetadata},
    bid_transaction::BidTransaction,
    item::{ItemId, ItemMetadata},
    joint_auction::{JointAuctionId, JointAuctionMetadata},
    user::{UserId, UserMetadata},
};

/// The `AuctionContractMetadata` struct represents metadata for an auction contract.
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionContractMetadata {
    /// Specification associated with the auction contract.
    pub spec: String,

    /// Name of the auction contract.
    pub name: String,

    /// Symbol associated with the auction contract.
    pub symbol: String,

    /// Optional icon for the auction contract.
    pub icon: Option<String>,

    /// Optional base URI for the auction contract.
    pub base_uri: Option<String>,

    /// Optional reference string for the auction contract.
    pub reference: Option<String>,

    /// Optional hash of the reference, encoded in base64.
    pub reference_hash: Option<Base64VecU8>,
}

/// The `AuctionContract` struct represents an auction contract in the system.
#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct AuctionContract {
    /// Account ID of the owner of the contract.
    pub owner_id: AccountId,

    /// Metadata associated with the auction contract.
    pub metadata_contract: LazyOption<AuctionContractMetadata>,

    /// Map of `JsonUser` metadata by user ID.
    pub user_metadata_by_id: LookupMap<UserId, UserMetadata>,

    /// Map of auction host by user ID.
    pub auctions_host_per_user: LookupMap<UserId, UnorderedSet<AuctionId>>,

    // can use for both normal auction and joint auction
    pub transactions_per_user_have: LookupMap<UserId, UnorderedSet<BidTransaction>>,

    /// Map of user join auction by auction ID.
    pub auctions_join_per_user: UnorderedMap<AuctionId, UnorderedSet<UserId>>,

    /// Map of item owned by user
    pub items_per_user: LookupMap<UserId, UnorderedSet<ItemId>>,

    /// Map of `ItemMetadata` by item ID.
    pub item_metadata_by_id: LookupMap<ItemId, ItemMetadata>,

    /// Map of `AuctionMetadata` by auction ID.
    pub auction_metadata_by_id: LookupMap<AuctionId, AuctionMetadata>,

    pub all_auctions: UnorderedSet<AuctionId>,

    // Joint Auction above is normal auction
    pub joint_auction_metadata_by_id: LookupMap<JointAuctionId, JointAuctionMetadata>,

    pub all_joint_auctions: UnorderedSet<JointAuctionId>,

    pub all_users: UnorderedSet<UserId>,
}

/// The `ContractStorageKey` enum represents keys for different persistent collections in the contract storage.
#[derive(BorshSerialize)]
pub enum ContractStorageKey {
    ContractMetadata,
    UserMetadataById,
    ItemsPerUser,
    ItemMetadataById,
    AuctionsHostPerUser,
    AuctionsJoinPerUser,
    TransactionPerUserHave,
    AuctionMetadataById,
    AllAuctions,
    JointAuctionMetadataById,
    AllJointAuctions,
    AllUsers,
}
