"use client";

import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios"

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const styles = {
  formrow: {
    marginBottom: "32px",
    color: "#fff"
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
    cursor: "pointer"
  },
};

const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:8080"

const Form = () => {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const isLoading = useAppSelector(selectIsLoading);

  const [name, setName] = useState<string>("");
  const [information, setInformation] = useState<{name : string, email : string, phone : string, address: string}>({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletReady(true);
    }
  }, [isLoading, wallet]);

  const createUser = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();

    const result = await axios.post(`${webUrl}/api/v1/user/add`, {
      id : wallet.accountId, 
      name: information.name, 
      email: information.email, 
      phone: information.phone, 
      address: information.address
    })

    if(result.data.status) {
      alert(result.data.message);
    }else{
      alert(result.data.message)
    }

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "create_user",
        args: { name },
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => window.location.reload());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, caseInput : Number) => {
    var typeInput : string = String(e.target.getAttribute("name"))

    setInformation(prev => ({
      ...prev,
      [typeInput] : e.target.value
    }))
  };

  return (
    <>
      <div style={styles.formwrap}>
        <div style={styles.pagename}>Create Account</div>

        <form style={styles.contentdiv} onSubmit={createUser}>
          <div style={styles.formrow}>
            <label>Name</label>
            <input
              style={styles.textbox}
              name="name"
              value={information.name}
              onChange={(e) => handleChange(e, 0)}
            />
            <label>Phone number</label>
            <input
              style={styles.textbox}
              name="phone"
              value={information.phone}
              onChange={(e) => handleChange(e, 1)}
            />
            <label>Email</label>
            <input
              style={styles.textbox}
              name="email"
              value={information.email}
              onChange={(e) => handleChange(e, 2)}
            />
            <label>Address</label>
            <input
              style={styles.textbox}
              name="address"
              value={information.address}
              onChange={(e) => handleChange(e, 3)}
            />
          </div>
          <div style={styles.btnrow}>
            <input style={styles.btn} type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
