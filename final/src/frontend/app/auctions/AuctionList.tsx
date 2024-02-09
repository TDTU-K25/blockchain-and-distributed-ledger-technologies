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

interface AuctionListProps {
  auctions: Auction[];
  setAuctions: Dispatch<SetStateAction<Auction[]>>;
}

export default function AuctionList(props: AuctionListProps) {
  const { auctions, setAuctions } = props;

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
    let auctionFound = auctions.find(
      (auction) => auction.auction_id === auctionId
    );
    if (auctionFound) {
      setCurrentAuction(auctionFound);
    }
    setIsShowModal(true);
  };

  return (
    <>
      <Title name="List Auctions" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link href="/auctions/add">
          <button
            className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded text-white"
            style={{
              margin: "0 auto",
              display: "inline-block",
              marginRight: "0.5rem",
            }}
          >
            Add auction
          </button>
        </Link>
      </div>
      {auctions.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "black", marginTop: "1rem" }}>
            There are not any auctions
          </h1>
        </div>
      )}
      <Cards>
        {auctions.map((auction) => (
          <Card key={auction.auction_id}>
            <ImageCard>
              <a href={"/auctions/detail?id=" + auction.auction_id}>
                <img src={auction?.item_metadata?.media} alt="..." />
              </a>
            </ImageCard>
            <div className="card-body p-2 mt-3" style={{ textAlign: "center" }}>
              <CardHeading>{auction.item_metadata.name}</CardHeading>
              <Text className="ps-2  pb-3 text-secondary">
                {auction.item_metadata.description}
              </Text>
              <div style={{ textAlign: "center", color: "purple" }}>
                Host
                <Text className="ps-2  pb-3 font-bold">{auction.host_id}</Text>
              </div>
            </div>

            {auction.is_finish ? (
              <b style={{ color: "black" }}>The auction has finished</b>
            ) : (
              <CountdownTimer timestamp={auction.closed_at} />
            )}

            {account !== auction.host_id && !auction.is_finish && (
              <div style={{ marginTop: "1rem" }}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Bid
                </button>
              </div>
            )}

            {account === auction.host_id && !auction.is_finish && (
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
