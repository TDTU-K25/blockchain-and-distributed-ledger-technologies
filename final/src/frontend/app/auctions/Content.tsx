"use client";

import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { useEffect, useState } from "react";
import { Auction } from "../@types/Auction.type";
import AuctionList from "./AuctionList";
import { JointAuction } from "../@types/JointAuction.type";
import JointAuctionList from "./JointAuctionList";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Content = () => {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const [data, setData] = useState<Auction[]>([]);
  const [jointAuctions, setJointAuctions] = useState<JointAuction[]>([]);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletReady(true);
    }
  }, [isLoading, wallet]);

  useEffect(() => {
    const getData = async () => {
      if (wallet) {
        const result = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_auctions",
        });

        const jointAuctionsGet = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_joint_auctions",
        });

        const newJointAuctionGet = await Promise.all(
          jointAuctionsGet.map(async (jointAuction: JointAuction) => {
            return {
              ...jointAuction,
              items: await Promise.all(
                jointAuction.set_item_id.map(async (item_id) => {
                  const item = await wallet.viewMethod({
                    contractId: CONTRACT_ID,
                    method: "get_item_metadata_by_item_id",
                    args: {
                      item_id: item_id,
                    },
                  });
                  return item;
                })
              ),
            };
          })
        );

        const newResult = await Promise.all(
          result.map(async (auction: Auction) => {
            const item = await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_item_metadata_by_item_id",
              args: {
                item_id: auction.item_id,
              },
            });
            let newAuction = {
              ...auction,
              item_metadata: item,
            };
            return newAuction;
          })
        );

        await setData(newResult);
        setJointAuctions(newJointAuctionGet);
        console.log(newResult);
        console.log(newJointAuctionGet);
      }
    };
    getData();
  }, [walletReady]);

  return (
    <>
      <AuctionList auctions={data} setAuctions={setData} />
      <JointAuctionList
        jointAuctions={jointAuctions}
        setJointAuctions={setJointAuctions}
      />
    </>
  );
};

export default Content;
