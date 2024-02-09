"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { Auction } from "@/app/@types/Auction.type";
import { BidTransaction } from "@/app/@types/BidTransaction.type";
import CountdownTimer from "@/app/components/CountdownTimer/CountdownTimer";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Root = styled.div`
  color: black;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  align-items: center;
  justify-content: center;
`;
const MainContainer = styled.div`
  padding: 30px;
  height: auto;
  max-width: 1300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 600px) {
    justify-content: center;
    align-items: center;
  }
`;

const TopImageContainer = styled.div`
  padding: 1em;
  background: #ffffff;
  width: 40%;
  min-width: 355px;
  border: 2px solid #cacdd5;
  margin-right: 40px;
  box-shadow: 2px 7px 22px rgba(28, 27, 28, 0.1);
  border-radius: 0.7em;
  & > img {
    width: 100%;
    max-height: 548px;
  }
`;

const HeaderText = styled.h1`
  font-size: 1.5rem;
`;

const PriceArea = styled.div`
  display: flex;
  align-items: center;
  color: #0d99ff;
  & > * {
    margin: 0px;
    padding: 0px;
  }
  & > h6 {
    font-weight: 700;
    margin-left: 5px;
    margin-top: 4px;
    margin-right: 3px;
    font-size: 1.3rem;
  }
  & > span {
    font-size: 1.2rem;
    margin: 0px;
  }
`;

const PriceBucket = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 30px;
  width: 100%;
`;

const RightSection = styled.div`
  width: 46%;
  min-width: 350px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
`;

const Description = styled.div`
  width: 100%;
  border-radius: 1em;
  background: #ffffff;
  border: 2px solid #eeeff2;
  padding: 1em;
  margin-top: 40px;
  box-shadow: 2px 7px 22px rgba(28, 27, 28, 0.1);
  & > h6 {
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Attribute = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5em;
  border-radius: 0.5em;
  width: 206px;
  background: #fafafb;
  margin-bottom: 20px;
  border: 1px solid #86ccff;
  border-radius: 10.6849px;
  & > *span {
    padding: 0;
    color: #b2b7c2;
  }
`;

const TransactionTable = styled.div`
  width: 100%;
  max-width: 70%;
  background: #ffffff;
  border: 2px solid #eeeff2;
  box-shadow: 2px 7px 22px rgba(28, 27, 28, 0.1);
  border-radius: 16px;
  margin-bottom: 40px;
`;

const TableHeader = styled.div`
  width: 100%;
  padding: 0.5em;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 0.5em;
  display: flex;
  justify-content: flex-start;
  gap: 1em;
  background: #f5f6f7;
  border-radius: 14px 14px 0px 0px;
  & > h1 {
    font-size: 24px;
  }
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5em;
  justify-content: space-between;
  border-bottom: 1px solid #dde1e6;
  a {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    padding-left: 7px;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    span {
      font-size: 12px;
    }
  }
`;

const RowBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-left: 7px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  span {
    font-size: 12px;
  }
`;

const MintDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #525c76;
  & > span {
    font-size: 14px;
  }
  & > a {
    cursor: pointer;
  }
`;

const CloseNFT = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: flex-start !important;
  justify-content: space-between !important;
  img {
    width: 40px;
    cursor: pointer;
    align-self: flex-start;
  }
`;

export default function page() {
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletReady] = useState(false);
  const isLoading = useAppSelector(selectIsLoading);

  const [bid, setBid] = useState<number>(0);
  const [currentUserTransaction, setCurrentUserTransaction] =
    useState<BidTransaction | null>(null);
  const [transactionsOfAuction, setTransactionOfAuction] = useState<
    BidTransaction[]
  >([]);
  const [auction, setAuction] = useState<Auction | null>(null);

  const searchParams = useSearchParams();

  const id = searchParams.get("id");

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
          method: "get_auction_metadata_by_auction_id",
          args: {
            auction_id: id,
          },
        });

        const transactionFound = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_user_bid_transaction_by_auction_id",
          args: {
            auction_id: id,
            user_id: account,
          },
        });

        const allTransactions = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_all_transaction_by_auction_id",
          args: {
            auction_id: id,
          },
        });

        const item = await wallet.viewMethod({
          contractId: CONTRACT_ID,
          method: "get_item_metadata_by_item_id",
          args: {
            item_id: result?.item_id,
          },
        });

        let newResult: Auction = {
          ...result,
          item_metadata: item,
        };

        setAuction(newResult);
        setCurrentUserTransaction(transactionFound);
        setTransactionOfAuction(allTransactions);
      }
    };
    getData();
  }, [walletReady]);

  const joinAuction = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();

    // just accept integer bid
    const tenPow24 = "000000000000000000000000";
    const bidInYoctoNear = bid + tenPow24;

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "join_auction",
        args: { auction_id: id },
        deposit: bidInYoctoNear,
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => window.location.reload());
  };

  const finishAuction = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletReady(false);
    e.preventDefault();

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "finish_auction",
        args: { auction_id: id },
        gas: "300000000000000",
      })
      .then(() => setWalletReady(true))
      .then(() => window.location.reload());
  };

  const handleChange = (event: any) => {
    setBid(event.target.value);
  };

  return (
    <Root>
      <MainContainer>
        <TopSection>
          <CloseNFT>
            <img
              src="https://cdn-icons-png.flaticon.com/256/109/109618.png"
              alt=""
            />
          </CloseNFT>
          <TopImageContainer>
            <HeaderText>{auction?.item_metadata.name}</HeaderText>
            <img
              src={auction?.item_metadata.media}
              width="100%"
              height="100%"
              className="rounded-3"
            />
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  marginBottom: "0.5em",
                  fontSize: "0.85rem",
                  color: "#0d99ff",
                }}
              >
                Host by
              </p>
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                {auction?.host_id}
              </span>
            </div>
          </TopImageContainer>
          <RightSection>
            <PriceBucket>
              <div>
                <p style={{ color: "#b2b7c2", marginBottom: 0 }}>Current bid</p>
                <PriceArea>
                  {auction?.highest_bid
                    ? auction?.highest_bid
                    : auction?.floor_price}{" "}
                  (NEAR)
                </PriceArea>
              </div>
              <div>
                <PriceArea>
                  {auction?.host_id === account && !auction?.is_finish && (
                    <button onClick={finishAuction}>Finish auction</button>
                  )}
                  {auction?.host_id !== account && (
                    <p>
                      Your previous bid:{" "}
                      {currentUserTransaction
                        ? currentUserTransaction.total_bid
                        : 0}{" "}
                      NEAR
                    </p>
                  )}
                </PriceArea>
                <PriceArea>
                  {auction?.host_id !== account && !auction?.is_finish && (
                    <form onSubmit={joinAuction}>
                      <label>Enter the amount you want to bid</label> (NEAR)
                      <input
                        type="number"
                        value={bid}
                        onChange={handleChange}
                        style={{ marginRight: "0.5rem", color: "black" }}
                      />
                      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                        Bid
                      </button>
                    </form>
                  )}
                </PriceArea>
              </div>
            </PriceBucket>
            <Description>
              <h6>Description</h6>
              <span>{auction?.item_metadata.description}</span>
            </Description>
            <Description>
              <h6>Attributes</h6>

              {/* later */}
              <AttributeContainer>
                <Attribute>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>File Type</span>
                    <p style={{ marginTop: "10px" }}>image/png</p>
                  </div>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>Rarity</span>
                    <p style={{ marginTop: "10px" }}>1%</p>
                  </div>
                </Attribute>
                <Attribute>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>Category</span>
                    <p style={{ marginTop: "10px" }}>Digital Graphic</p>
                  </div>
                  <div>
                    <span style={{ color: "#b2b7c2" }}>Rarity</span>
                    <p style={{ marginTop: "10px" }}>1%</p>
                  </div>
                </Attribute>
              </AttributeContainer>
            </Description>
            <Description>
              <h6>Details</h6>
              <MintDetails>
                <span>Created at</span>
                {auction?.created_at !== undefined && new Date(auction?.created_at).toLocaleString()}
              </MintDetails>
              <MintDetails>
                <span>Closed at</span>
                {auction?.closed_at !== undefined && new Date(auction?.closed_at).toLocaleString()}
              </MintDetails>
              {auction?.closed_at && (
                <div style={{ marginTop: "0.5rem" }}>
                  {!auction.is_finish && (
                    <CountdownTimer timestamp={auction?.closed_at} />
                  )}
                </div>
              )}
            </Description>
          </RightSection>
        </TopSection>
      </MainContainer>
      <TransactionTable>
        <TableHeader>
          <h1>Auction History</h1>
        </TableHeader>
        {transactionsOfAuction &&
          transactionsOfAuction
            .sort((a, b) => {
              if (a.total_bid < b.total_bid) return 1;
              else if (a.total_bid > b.total_bid) return -1;
              else return 0;
            })
            .map((transaction) => (
              <TableBody key={transaction.owner_id}>
                <a>
                  <RowBody>
                    <span>Account ID</span>
                    <p>{transaction.owner_id.substring(0, 5)}</p>
                    <span>Bid</span>
                    <p>{transaction.total_bid}</p>
                    <span>Time</span>
                    <p>{new Date(transaction.updated_at).toLocaleString()}</p>
                  </RowBody>
                </a>
              </TableBody>
            ))}
      </TransactionTable>
    </Root>
  );
}
