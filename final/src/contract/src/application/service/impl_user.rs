use crate::models::contract::AuctionContractExt;
use crate::models::user::{JsonUser, UserId, UserMetadata};
use crate::models::{contract::AuctionContract, user::ImplUser};
use near_sdk::{env, near_bindgen};

#[near_bindgen]
/// Implement function for user
impl ImplUser for AuctionContract {
    fn create_user(
        &mut self,
        name: String,
        avatar: Option<String>,
        email: Option<String>,
        phone: Option<String>,
        description: Option<String>,
    ) {
        let owner_id = env::signer_account_id();
        assert!(
            !self.user_metadata_by_id.contains_key(&owner_id),
            "Account exists"
        );
        let user = UserMetadata {
            user_id: owner_id.clone(),
            name,
            avatar,
            email,
            phone,
            description,
        };
        self.user_metadata_by_id.insert(&owner_id, &user);
        self.all_users.insert(&owner_id);
    }

    fn get_user_metadata_by_user_id(&self, user_id: &UserId) -> Option<UserMetadata> {
        self.user_metadata_by_id.get(user_id)
    }

    fn update_user_information(
        &mut self,
        name: String,
        avatar: Option<String>,
        email: Option<String>,
        phone: Option<String>,
        description: Option<String>,
    ) -> UserMetadata {
        let owner_id = env::signer_account_id();

        let mut user_account = self
            .get_user_metadata_by_user_id(&owner_id)
            .expect("Account does not exists");

        user_account.name = name;
        user_account.avatar = avatar;
        user_account.email = email;
        user_account.phone = phone;
        user_account.description = description;

        self.user_metadata_by_id.insert(&owner_id, &user_account);
        user_account
    }

    fn get_all_users(&self) -> Vec<UserMetadata> {
        let mut result = Vec::new();
        for user_id in self.all_users.iter() {
            result.push(self.get_user_metadata_by_user_id(&user_id).unwrap());
        }
        result
    }
}
