"use client";

import { Item } from "@/app/@types/Item.type";
import { User } from "@/app/@types/User.type";
import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { useEffect, useState } from "react";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const styles = {
  formrow: {
    marginBottom: "32px",
  },
  label: {
    display: "block",
    color: "#fff",
    fontSize: "16px",
    position: "relative",
    paddingRight: "5px",
    marginBottom: "10px",
  },
  textbox: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minHeight: "46px",
    color: "#fff",
    fontSize: "14px",
    borderRadius: "6px",
    width: "100%",
    padding: "4px 11px",
  },
  textarea: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minHeight: "100px",
    color: "#fff",
    fontSize: "14px",
    borderRadius: "6px",
    width: "100%",
    padding: "4px 11px",
    resize: "none",
  },
  contentdiv: {
    padding: "32px",
    background: "#29244e",
    borderRadius: "0px 0px 10px 10px",
  },
  pagename: {
    color: "#fff",
    padding: "16px",
    fontSize: "22px",
    backgroundColor: "#231D4B",
    fontWeight: 600,
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
  },
  formwrap: {
    background: "#29244e",
    maxWidth: "700px",
    margin: "16px auto",
    borderRadius: "10px",
  },
  btnrow: {
    display: "flex",
    justifyContent: "center",
  },
  btnback: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "16px",
    padding: "5px 16px",
    fontWeight: 400,
    background: "none",
    backgroundColor: "rgba(60, 53, 109, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02)",
    height: "40px",
    borderRadius: "40px",
    lineHeight: "29px",
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
  },

  btn: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "16px",
    padding: "5px 16px",
    fontWeight: 400,
    background: "none",
    backgroundImage:
      "linear-gradient(145deg, #016EDA, #6C1ECF, #016EDA, #6C1ECF)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02)",
    height: "40px",
    borderRadius: "40px",
    lineHeight: "29px",
    letterSpacing: "0.01em",
    display: "flex",
    alignItems: "center",
    marginLeft: "16px",
    justifyContent: "center",
    maxWidth: "200px",
  },
};

const Form = () => {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const isLoading = useAppSelector(selectIsLoading);

  // Form input
  const [unixTimestamp, setUnixTimeStamp] = useState<number>(0);
  const [timeClose, setTimeClose] = useState<string>("");
  const [floorPrice, setFloorPrice] = useState<number>(0);
  const [itemId, setItemId] = useState<string>();

  const [userItems, setUserItems] = useState<Item[]>([]);

  const [users, setUsers] = useState<User[]>([
    {
      address: "",
      user_id: "",
      avatar: null,
      description: null,
      email: null,
      name: null,
      phone: null,
      items: [],
    },
  ]);

  const [usersChoose, setUsersChoose] = useState<string[]>([""]);
  const [itemsChoose, setItemsChoose] = useState<string[]>([""]);

  useEffect(() => {
    const getData = async () => {
      if (wallet) {
        const usersGet = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_users",
        });

        const usersWithItems = await Promise.all(
          usersGet.map(async (user: User) => {
            const items = await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_all_items_per_user_own",
              args: {
                user_id: user.user_id,
              },
            });

            return {
              ...user,
              items,
            };
          })
        );

        // get auction_host_per_user to remove item from select because that item
        // are used for auction

        setUsers(usersWithItems);
        console.log(users);
      }
    };
    getData();
  }, [walletReady]);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletReady(true);
    }
  }, [isLoading, wallet]);

  const createJointAuction = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "create_joint_auction",
        args: {
          users_invited: usersChoose,
          set_item_id: itemsChoose,
          closed_at: unixTimestamp,
          floor_price: parseFloat(floorPrice.toString()),
        },
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => window.location.reload());
  };

  const handleChange = (setState: any) => (event: any) => {
    let { value, type } = event.target;
    if (type === "datetime-local") {
      setUnixTimeStamp(Date.parse(value));
      setTimeClose(value)
    }
    setState(value);
    console.log(value)
  };

  const handleChangeUserChoose = (event: any, index: any) => {
    const list = [...usersChoose];
    list[index] = event.target.value;
    setUsersChoose(list);
    console.log(usersChoose);
  };

  const handleChangeItemChoose = (event: any, index: any) => {
    const list = [...itemsChoose];
    list[index] = event.target.value;
    setItemsChoose(list);
    console.log(itemsChoose);
  };

  const handleUserItemChoose = (event: any) => {
    const list = [...itemsChoose];
    list.push(event.target.value);
    setItemsChoose(list);
  };

  const addUser = () => {
    setUsersChoose((prev) => [...prev, ""]);
  };

  return (
    <>
      <div style={styles.formwrap}>
        <div style={styles.pagename}>Add Joint auction</div>
        <form style={styles.contentdiv}>
          <div style={styles.formrow}>
            <label>User invited</label>
            {usersChoose.map((userChoose, index) => {
              return (
                <>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <select
                      style={styles.textbox}
                      value={userChoose}
                      onChange={(event) => handleChangeUserChoose(event, index)}
                    >
                      <option selected defaultValue="">
                        Choose users
                      </option>
                      {users.map((user) => {
                        if (user.user_id !== account)
                          return (
                            <option
                              style={{ color: "black" }}
                              key={user.user_id}
                              value={user.user_id}
                            >
                              {user.user_id}
                            </option>
                          );
                      })}
                    </select>
                  </div>
                  {usersChoose[index] !== "" && (
                    <div style={{ marginBottom: "1rem" }}>
                      <select
                        style={styles.textbox}
                        value={itemsChoose[index]}
                        onChange={(event) => {
                          handleChangeItemChoose(event, index);
                        }}
                      >
                        <option selected defaultValue={""}>
                          Choose items
                        </option>
                        {users
                          .filter((user) => user.user_id === usersChoose[index])
                          .map((user) => {
                            return user.items.map((item) => (
                              <option
                                style={{ color: "black" }}
                                value={item.item_id}
                              >
                                {item.name}
                              </option>
                            ));
                          })}
                      </select>
                    </div>
                  )}

                  {index === usersChoose.length - 1 && (
                    <button onClick={addUser}>Add more user</button>
                  )}
                </>
              );
            })}
          </div>
          <div style={styles.formrow}>
            <label>Your Item</label>
            <select
              name=""
              id=""
              style={styles.textbox}
              value={itemId}
              onChange={handleUserItemChoose}
            >
              <option selected defaultValue={""} disabled>
                Choose your item
              </option>
              {users.map((user) => {
                if (user.user_id === account) {
                  return user.items.map((item) => (
                    <option
                      style={{ color: "black" }}
                      key={item.item_id}
                      value={item.item_id}
                    >
                      {item.name}
                    </option>
                  ));
                }
              })}
            </select>
          </div>
          <div style={styles.formrow}>
            <label>Closed at</label>
            <input
              style={styles.textbox}
              type="datetime-local"
              value={timeClose}
              onChange={handleChange(setTimeClose)}
            />
          </div>
          <div style={styles.formrow}>
            <label>Floor price</label>
            <input
              style={styles.textbox}
              type="number"
              value={floorPrice}
              onChange={handleChange(setFloorPrice)}
            />
          </div>

          <div style={styles.btnrow}>
            <input
              style={styles.btn}
              type="submit"
              value="Submit"
              onClick={createJointAuction}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
