pub mod application;
pub mod models;

use crate::models::contract::AuctionContractExt;
use models::contract::{AuctionContract, AuctionContractMetadata, ContractStorageKey};
use models::user::UserId;
use near_sdk::borsh::{self, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::{env, near_bindgen};

#[near_bindgen]
impl AuctionContract {
    #[init]
    pub fn init() -> Self {
        let owner_id = env::signer_account_id();
        Self::new(
            owner_id,
            AuctionContractMetadata {
                spec: "auction-1.0.0".to_string(),
                name: "auction".to_string(),
                symbol: "Auction".to_string(),
                icon: None,
                base_uri: None,
                reference: None,
                reference_hash: None,
            },
        )
    }

    #[init]
    pub fn new(owner_id: UserId, metadata: AuctionContractMetadata) -> Self {
        Self {
            owner_id,
            metadata_contract: LazyOption::new(
                ContractStorageKey::ContractMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
            auctions_host_per_user: LookupMap::new(
                ContractStorageKey::AuctionsHostPerUser
                    .try_to_vec()
                    .unwrap(),
            ),
            transactions_per_user_have: LookupMap::new(
                ContractStorageKey::TransactionPerUserHave
                    .try_to_vec()
                    .unwrap(),
            ),
            auctions_join_per_user: UnorderedMap::new(
                ContractStorageKey::AuctionsJoinPerUser
                    .try_to_vec()
                    .unwrap(),
            ),
            items_per_user: LookupMap::new(ContractStorageKey::ItemsPerUser.try_to_vec().unwrap()),
            item_metadata_by_id: LookupMap::new(
                ContractStorageKey::ItemMetadataById.try_to_vec().unwrap(),
            ),
            auction_metadata_by_id: LookupMap::new(
                ContractStorageKey::AuctionMetadataById
                    .try_to_vec()
                    .unwrap(),
            ),
            joint_auction_metadata_by_id: LookupMap::new(
                ContractStorageKey::JointAuctionMetadataById
                    .try_to_vec()
                    .unwrap(),
            ),
            user_metadata_by_id: LookupMap::new(
                ContractStorageKey::UserMetadataById.try_to_vec().unwrap(),
            ),
            all_auctions: UnorderedSet::new(ContractStorageKey::AllAuctions.try_to_vec().unwrap()),
            all_joint_auctions: UnorderedSet::new(
                ContractStorageKey::AllJointAuctions.try_to_vec().unwrap(),
            ),
            all_users: UnorderedSet::new(ContractStorageKey::AllUsers.try_to_vec().unwrap()),
        }
    }
}
