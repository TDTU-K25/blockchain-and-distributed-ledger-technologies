use std::collections::HashMap;

use crate::models::bid_transaction::BidTransaction;
use crate::models::contract::AuctionContract;
use crate::models::contract::AuctionContractExt;
use crate::models::item::ItemId;
use crate::models::item::ItemMetadata;
use crate::models::joint_auction;
use crate::models::joint_auction::Pool;
use crate::models::joint_auction::{ImplJointAuction, JointAuctionId, JointAuctionMetadata};
use crate::models::user::UserId;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, near_bindgen, Balance, Promise, ONE_NEAR};

#[near_bindgen]
/// Implement function for auction
impl ImplJointAuction for AuctionContract {
    fn check_collaboration_of_auction(&self, joint_auction_id: JointAuctionId) -> bool {
        let joint_auction = self
            .joint_auction_metadata_by_id
            .get(&joint_auction_id)
            .unwrap();
        let users_invited = joint_auction.pool.map;
        let mut is_all_accept = true;
        for user_accept in users_invited.into_iter() {
            if !user_accept.1 {
                is_all_accept = false;
            }
        }
        is_all_accept
    }

    fn create_joint_auction(
        &mut self,
        users_invited: Vec<UserId>,
        set_item_id: Vec<ItemId>,
        closed_at: u64,
        floor_price: Option<Balance>,
    ) -> JointAuctionMetadata {
        let mut pool = Pool {
            map: HashMap::new(),
        };

        // do not need to save the one who invites in pool
        let mut set_host_id = Vec::new();
        for user_id in users_invited.iter() {
            pool.map.insert(user_id.clone(), false); // why need to use clone here?
            set_host_id.push(user_id.clone());
        }

        let host_id = env::signer_account_id();
        set_host_id.push(host_id); // include the user who invites

        // temp solution for joint_auction_id
        let temp_id = self.all_joint_auctions.len() + 1;
        let joint_auction_id = temp_id.to_string();

        let joint_auction = JointAuctionMetadata {
            joint_auction_id: joint_auction_id.clone(), // need to create this id
            set_host_id,
            created_at: env::block_timestamp_ms(),
            closed_at,
            floor_price,
            winner: None,
            highest_bid: None,
            set_item_id,
            is_finish: false,
            pool,
            is_open: false,
        };

        self.joint_auction_metadata_by_id
            .insert(&joint_auction_id, &joint_auction);
        self.all_joint_auctions.insert(&joint_auction_id);

        joint_auction

        // is necessary ?
        // let mut set_auction_user_host = self
        //     .auctions_host_per_user
        //     .get(&owner_id)
        //     .or_else(|| {
        //         let key = String::from("auctions_host_") + &owner_id.to_string();
        //         Some(UnorderedSet::new(key.into_bytes()))
        //     })
        //     .unwrap();
        // set_auction_user_host.insert(&auction_id);
        // self.auctions_host_per_user.insert(&owner_id, &set_auction_user_host);
    }

    fn accept_invitation(&mut self, joint_auction_id: JointAuctionId) {
        let user_invited_id = env::signer_account_id();
        let mut joint_auction = self
            .joint_auction_metadata_by_id
            .get(&joint_auction_id)
            .unwrap();

        assert!(
            !joint_auction.pool.map.get(&user_invited_id).is_none(),
            "You are not invited to this auction"
        );

        joint_auction.pool.map.insert(user_invited_id, true);

        self.joint_auction_metadata_by_id
            .insert(&joint_auction_id, &joint_auction);

        // need to update joint_auction_metadata_by_id first
        // before call this func because this func use the joint_auction_metadata_by_id
        if self.check_collaboration_of_auction(joint_auction_id.clone()) {
            joint_auction.is_open = true;
            self.joint_auction_metadata_by_id
                .insert(&joint_auction_id, &joint_auction); // save
        }
    }

    fn get_all_joint_auctions(&self) -> Vec<JointAuctionMetadata> {
        let mut result = Vec::new();
        if self.all_joint_auctions.is_empty() {
            return result;
        }
        for joint_auction_id in self.all_joint_auctions.iter() {
            let joint_auction = self
                .joint_auction_metadata_by_id
                .get(&joint_auction_id)
                .unwrap();
            result.push(joint_auction);
        }
        result
    }

    fn get_joint_auction_metadata_by_joint_auction_id(
        &self,
        joint_auction_id: JointAuctionId,
    ) -> Option<JointAuctionMetadata> {
        assert!(
            self.joint_auction_metadata_by_id
                .contains_key(&joint_auction_id),
            "Auction does not exist"
        );
        self.joint_auction_metadata_by_id.get(&joint_auction_id)
    }

    fn delete_joint_auction(&mut self, joint_auction_id: JointAuctionId) {
        // let owner_id = env::signer_account_id();
        // let auction = self.auction_metadata_by_id.get(&auction_id).unwrap();
        // assert_eq!(
        //     owner_id, auction.host_id,
        //     "You do not have permission to delete"
        // );
        // self.all_auctions.remove(&auction_id);
        // self.auction_metadata_by_id.remove(&auction_id);
        // self.auctions_host_per_user
    }

    #[payable]
    fn bid_joint_auction(&mut self, joint_auction_id: JointAuctionId) {
        let mut joint_auction = self
            .get_joint_auction_metadata_by_joint_auction_id(joint_auction_id.clone())
            .unwrap();

        assert!(!joint_auction.is_finish, "The auction had finished");

        let highest_bid = joint_auction
            .highest_bid
            .or_else(|| joint_auction.floor_price)
            .unwrap();

        let mut near_send = env::attached_deposit() / ONE_NEAR;

        let user_bid_id = env::signer_account_id();

        // like normal auction
        // each joint auction if user join will have one bid transaction
        // if user want to bid higher in that joint auction than the previous we will update that old transaction

        // same to set joint auctions user join
        let mut set_transactions_user_have = self
            .transactions_per_user_have
            .get(&user_bid_id)
            .or_else(|| {
                let key = String::from("transactions_") + &user_bid_id.to_string();
                Some(UnorderedSet::new(key.into_bytes()))
            })
            .unwrap();

        let transaction_found = set_transactions_user_have.iter().find(|transaction| {
            transaction.owner_id == user_bid_id && transaction.auction_id == joint_auction_id
        });

        if !transaction_found.is_none() {
            let old_transaction = transaction_found.unwrap();
            let mut updated_transaction = old_transaction.clone();

            let near_send_clone = near_send.clone();
            near_send += updated_transaction.total_bid;
            updated_transaction.total_bid += near_send_clone;
            updated_transaction.updated_at = env::block_timestamp_ms();

            set_transactions_user_have.remove(&old_transaction);
            set_transactions_user_have.insert(&updated_transaction);
        } else {
            let bid_transaction = BidTransaction {
                updated_at: env::block_timestamp_ms(),
                total_bid: near_send,
                owner_id: user_bid_id.clone(),
                auction_id: joint_auction_id.clone(),
            };
            set_transactions_user_have.insert(&bid_transaction);
        }

        // check condition
        // near_send stands for both case in if statement above
        assert!(
            near_send > highest_bid,
            "You need to pay more than the highest bid"
        );
        assert!(
            env::block_timestamp_ms() < joint_auction.closed_at,
            "The auction is closed"
        );

        // save joint auction and the normal auction in auctions_join_per_user (temp solution)
        let mut set_joint_auctions_user_bid = self
            .auctions_join_per_user
            .get(&joint_auction_id)
            .or_else(|| {
                let key = String::from("users_bid_") + &joint_auction_id;
                Some(UnorderedSet::new(key.into_bytes()))
            })
            .unwrap();
        set_joint_auctions_user_bid.insert(&user_bid_id);

        joint_auction.winner = Some(env::signer_account_id());
        joint_auction.highest_bid = Some(near_send);

        self.joint_auction_metadata_by_id
            .insert(&joint_auction_id, &joint_auction);

        self.transactions_per_user_have
            .insert(&env::signer_account_id(), &set_transactions_user_have);

        self.auctions_join_per_user
            .insert(&joint_auction_id, &set_joint_auctions_user_bid);

        Promise::new(env::current_account_id()).transfer(env::attached_deposit());
    }

    fn get_user_bid_transaction_by_joint_auction_id(
        &self,
        joint_auction_id: JointAuctionId,
        user_id: UserId,
    ) -> Option<BidTransaction> {
        if let Some(set_transactions_user_have) = self.transactions_per_user_have.get(&user_id) {
            for transaction in set_transactions_user_have.iter() {
                if transaction.owner_id == user_id && transaction.auction_id == joint_auction_id {
                    return Some(transaction);
                }
            }
        }
        None
    }

    fn get_all_transaction_by_joint_auction_id(
        &self,
        joint_auction_id: JointAuctionId,
    ) -> Vec<BidTransaction> {
        let mut result = Vec::new();
        if self.auctions_join_per_user.get(&joint_auction_id).is_none() {
            return result;
        }
        let set_user_join_this_auction =
            self.auctions_join_per_user.get(&joint_auction_id).unwrap();
        if set_user_join_this_auction.is_empty() {
            return result;
        }
        for user_id in set_user_join_this_auction.iter() {
            result.push(
                self.get_user_bid_transaction_by_joint_auction_id(
                    joint_auction_id.clone(),
                    user_id,
                )
                .unwrap(),
            )
        }
        result
    }

    // send back money to others after auction finish & change the owner of item to the winner
    #[payable]
    fn finish_joint_auction(&mut self, joint_auction_id: JointAuctionId) {
        // update auction
        let mut joint_auction = self
            .get_joint_auction_metadata_by_joint_auction_id(joint_auction_id.clone())
            .unwrap();

        assert!(!joint_auction.is_finish, "The auction had finished");

        joint_auction.is_finish = true;
        self.joint_auction_metadata_by_id
            .insert(&joint_auction_id, &joint_auction);

        // update owner_item
        let set_items_auction = joint_auction.set_item_id;
        let winner = joint_auction.winner.unwrap();
        let set_host_auction = joint_auction.set_host_id;
        for item_id in set_items_auction {
            let mut item = self.item_metadata_by_id.get(&item_id).unwrap();
            item.owner_id = winner.clone();
            self.item_metadata_by_id.insert(&item.item_id, &item);

            for host_id in set_host_auction.iter() {
                let mut set_items_host = self.items_per_user.get(host_id).unwrap();
                set_items_host.remove(&item.item_id);
                self.items_per_user.insert(host_id, &set_items_host);
            }

            let mut set_items_winner = self
                .items_per_user
                .get(&winner)
                .or_else(|| {
                    let key = String::from("items_") + &winner.to_string(); // in case user do not have any items before
                    Some(UnorderedSet::new(key.into_bytes()))
                }) // convert string to byte string
                .unwrap();
            set_items_winner.insert(&item.item_id);
            self.items_per_user.insert(&winner, &set_items_winner);
        }

        // send back money
        let transactions = self.get_all_transaction_by_joint_auction_id(joint_auction_id.clone());
        for transaction in transactions.iter() {
            if transaction.owner_id != winner {
                Promise::new(transaction.owner_id.clone())
                    .transfer(transaction.total_bid.clone() * ONE_NEAR);
            }
        }

        // send money to host
        // suppose we will divide equally to all host
        // divide by percentage (later)
        let number_host = set_host_auction.len() as u128;
        for host_id in set_host_auction {
            Promise::new(host_id)
                .transfer((joint_auction.highest_bid.unwrap() / number_host) * ONE_NEAR);
        }
    }
}
