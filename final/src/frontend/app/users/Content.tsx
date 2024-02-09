"use client";

import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { useEffect, useState } from "react";
import { User } from "../@types/User.type";
import Title from "../components/Title";
import Link from "next/link";
import axios from "axios";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const styles = {
  formrow: {
    marginBottom: "32px",
    color: "#fff",
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
  formwrap: {
    background: "#29244e",
    maxWidth: "700px",
    margin: "16px auto",
    borderRadius: "10px",
  },
};

const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:8080"

const Content = () => {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletReady(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    const getData = async () => {
      if (wallet) {
        // const result = await wallet.viewMethod({
        //   contractId: CONTRACT_ID,
        //   method: "get_all_users",
        // });
        // setUser(result.filter((user: User) => user.user_id === account)[0])
        // setData(result);
        // console.log(result);

        const result = await axios.get(`${webUrl}/api/v1/user/${wallet?.accountId}`)
        setUser(result.data.data)
      }
    };
    getData();
  }, [walletReady]);

  return (
    <>
      <Title name="Personal Information" />
      {account && !user && (
        <div style={{ textAlign: "center" }}>
          <Link href="/users/add">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create Account
            </button>
          </Link>
        </div>
      )}

      {account && user && (
        <>
          <div style={styles.formwrap}>
            <form style={styles.contentdiv}>
              <div style={styles.formrow}>
                <label>Name</label>
                <input
                  style={styles.textbox}
                  value={
                    user?.name !== null ? user?.name : ""
                  }
                  disabled
                />
                <label>Email</label>
                <input
                  style={styles.textbox}
                  value={
                    user?.email !== null ? user?.email : ""
                  }
                  disabled
                />
                <label>Phone</label>
                <input
                  style={styles.textbox}
                  value={
                    user?.phone !== null ? user?.phone : ""
                  }
                  disabled
                />
                <label>Address</label>
                <input
                  style={styles.textbox}
                  value={
                    user?.address ? user?.address : ""
                  }
                  disabled
                />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Content;
