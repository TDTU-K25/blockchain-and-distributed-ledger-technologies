"use client";

import { initWallet } from "@/features/walletSlice";
import { ThemeProvider } from "next-themes";
import { memo, useEffect } from "react";
import { useAppDispatch } from "./store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      initWallet({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        network: "testnet",
      })
    );
  }, []);

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default memo(Providers);
