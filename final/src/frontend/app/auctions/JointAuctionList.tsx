"use client";

import styled from "styled-components";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { Auction } from "../@types/Auction.type";
import Title from "../components/Title";
import CountdownTimer from "../components/CountdownTimer/CountdownTimer";
import Link from "next/link";
import Modal from "../components/Modal";
import { JointAuction } from "../@types/JointAuction.type";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Cards = styled.div`
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 4rem;
`;

const Card = styled.div`
  width: 25%;
  min-width: 250px;
  display: flex;
  flex-flow: column nowrap;
  -ms-flex-flow: column nowrap;
  align-items: center;
  //  background-color:#09011a;
  border-radius: 10px;
  border: 1.41429px solid rgba(28, 27, 28, 0.1);
  box-shadow: 5.65714px 5.65714px 11.3143px rgba(28, 27, 28, 0.04);
  padding: 8px;
  //  color: #fff;
  margin: 0 auto;
  max-width: 400px;
  flex: 1;
  &:hover img {
    transform: scale(1.05);
  }
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }
`;

const CardHeading = styled.h5`
  font-size: 1.25rem;
  font-weight: 500;
  color: #09011a;
`;

const Text = styled.div`
  opacity: 0.6;
`;

const ImageCard = styled.div`
  height: 200px;
  width: 100%;
  border-radius: inherit;
  overflow: hidden;
  margin-bottom: 0.5rem;
  & > img {
    object-fit: cover;
    transition: all 0.3s ease-in-out;
  }
  & > img:hover {
    transform: scale(1.05);
  }
`;

interface JointAuctionListProps {
  jointAuctions: JointAuction[];
  setJointAuctions: Dispatch<SetStateAction<JointAuction[]>>;
}

export default function JointAuctionList(props: JointAuctionListProps) {
  const { jointAuctions, setJointAuctions } = props;

  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const isLoading = useAppSelector(selectIsLoading);
  const [walletReady, setWalletReady] = useState(false);

  const [currentAuction, setCurrentAuction] = useState<Auction | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletReady(true);
    }
  }, [isLoading, wallet]);

  const finishDeleteAuction = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "delete_auction",
        args: { auction_id: currentAuction?.auction_id },
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => setCurrentAuction(null))
      .then(() => {
        window.location.reload();
      });
  };

  const startDeleteAuction = (auctionId: string) => {
    // let auctionFound = auctions.find(
    //   (auction) => auction.auction_id === auctionId
    // );
    // if (auctionFound) {
    //   setCurrentAuction(auctionFound);
    // }
    setIsShowModal(true);
  };

  const acceptInvitation = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "accept_invitation",
        args: { joint_auction_id: e.target.value },
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => setCurrentAuction(null))
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <>
      <Title name="Joint Auctions" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link href="/joint-auction/add">
          <button
            className="bg-gray-500 hover:bg-gray-700 font-bold py-2 px-4 rounded text-white"
            style={{ margin: "0 auto", display: "inline-block" }}
          >
            Add joint auction
          </button>
        </Link>
      </div>
      {jointAuctions.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "black", marginTop: "1rem" }}>
            There are not any auctions
          </h1>
        </div>
      )}
      <Cards>
        {jointAuctions.map((jointAuction) => (
          <Card key={jointAuction.joint_auction_id}>
            {jointAuction.items.map((item) => (
              <>
                <ImageCard>
                  <a
                    href={
                      "/joint-auction/detail?id=" +
                      jointAuction.joint_auction_id
                    }
                  >
                    <img src={item?.media} alt="..." />
                  </a>
                </ImageCard>
                <div
                  className="card-body p-2 mt-3"
                  style={{ textAlign: "center" }}
                >
                  <CardHeading>{item.name}</CardHeading>
                  <Text className="ps-2  pb-3 text-secondary">
                    {item.description}
                  </Text>
                </div>
              </>
            ))}
            <div style={{ textAlign: "center", color: "purple" }}>
              Host
              <Text className="ps-2  pb-3 font-bold">
                {jointAuction.set_host_id.join(", ")}
              </Text>
            </div>

            {jointAuction.is_finish ? (
              <b style={{ color: "black" }}>The auction has finished</b>
            ) : (
              <CountdownTimer timestamp={jointAuction.closed_at} />
            )}

            {account !== undefined && !jointAuction.set_host_id.includes(account) &&
              !jointAuction.is_finish &&
              jointAuction.is_open && (
                <div style={{ marginTop: "1rem" }}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Bid
                  </button>

                </div>
              )}
            {account !== undefined && jointAuction.set_host_id.includes(account) &&
              !jointAuction.is_finish && (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    // onClick={() => {
                    //   startDeleteAuction(auction.auction_id);
                    // }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    style={{ marginRight: "0.5rem" }}
                  >
                    Delete
                  </button>
                  <button
                    // onClick={() => {
                    //   startDeleteAuction(auction.auction_id);
                    // }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                </div>
              )}
            {account !== undefined && jointAuction.set_host_id.includes(account) &&
              jointAuction.pool.map[account as keyof typeof jointAuction.pool.map] != undefined &&
              !jointAuction.pool.map[account as keyof typeof jointAuction.pool.map] && (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    value={jointAuction.joint_auction_id}
                    onClick={acceptInvitation}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Accept Invitation
                  </button>
                </div>
              )}
          </Card>
        ))}
      </Cards>
      <Modal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        finishDelete={finishDeleteAuction}
      />
    </>
  );
}
