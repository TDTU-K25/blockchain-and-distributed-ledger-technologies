'use client';

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { Item } from "@/app/@types/Item.type";
import { useQRCode } from 'next-qrcode';

const LINK_API = process.env.NEXT_PUBLIC_WEB_URL || '';
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';
const LINK_WEB = process.env.WEBSITE_LINK || "https://locust-amused-openly.ngrok-free.app/";

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

const CloseButton = styled.button`
    background-color: white;
    color: #0d99ff;
    margin-top: 20px;
    padding: 5px 15px;
    border: 1px solid #0d99ff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
`;

const MarketplaceListed = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    & > span {
        font-size: 14px;
        color: #525c76;
    }
    & > p {
        margin: 0;
        font-size: 14px;
    }
`;

export default function page() {
    const wallet = useAppSelector(selectWallet);
    const account = useAppSelector(selectAccountId);
    const [walletReady, setWalletready] = useState(false);
    const isLoading = useAppSelector(selectIsLoading);

    const [item, setItem] = useState<Item | null>(null);

    const searchParams = useSearchParams();

    const id = searchParams.get('id');

  const { SVG } = useQRCode();


  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

    useEffect(() => {
        // const getData = async () => {
        //     fetch(`${LINK_API}/api/v1/product/${id}`)
        //         .then((response) => {
        //             if (!response.ok) {
        //                 throw new Error(`HTTP error! Status: ${response.status}`);
        //             }
        //             const data: any = response.json();
        //             if (data.data) {
        //                 setItem(data.data);
        //             }
        //             // Parse the JSON response
        //             return response.json();
        //         })
        //         .then((data) => {
        //             console.log('Data:', data);
        //         })
        //         .catch((error) => {
        //             // Hndle any errors that occurred during the fetch
        //             console.error('Fetch error:', error);
        //         });
        // };
        // getData();

        const getData = async () => {
          if (wallet) {
            const result = await wallet.viewMethod({
              contractId: CONTRACT_ID,
              method: "get_item_metadata_by_item_id",
              args: {
                item_id: id,
              },
            });
            setItem(result);
          }
        };
        getData();
    }, [walletReady]);

    return (
        <Root>
            <MainContainer>
                <TopSection>
                    <CloseNFT>
                        <img src="https://cdn-icons-png.flaticon.com/256/109/109618.png" alt="" />
                    </CloseNFT>
                    <TopImageContainer>
                        <HeaderText>{item?.name}</HeaderText>
                        <img src={item?.media} width="100%" height="100%" className="rounded-3" />
                        <div
                            style={{
                                display: 'flex',
                                marginTop: '10px',
                                justifyContent: 'space-between',
                            }}
                        >
                            <p
                                style={{
                                    marginBottom: '0.5em',
                                    fontSize: '0.85rem',
                                    color: '#0d99ff',
                                }}
                            >
                                Owned by
                            </p>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item?.owner_id}</span>
                        </div>
                    </TopImageContainer>
                    <RightSection>
                        <Description>
                            <h6>Description</h6>
                            <span>{item?.description}</span>
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
                {item?.created_at !== undefined && new Date(item?.created_at).toLocaleString()}
              </MintDetails>
              <MintDetails>
                <span>Updated at</span>
                {item?.updated_at !== undefined && new Date(item?.updated_at).toLocaleString()}
              </MintDetails>
            </Description>
            <Description>
              <h6>QR code</h6>
              <center>
                <SVG
                  text={`${LINK_WEB}/items/detail?id=${id}`}
                  options={{
                    margin: 2,
                    width: 200,
                    color: {
                      dark: '#000000',
                      light: '#FFFFFF',
                    },
                  }}
                />
              </center>
            </Description>
          </RightSection>
        </TopSection>
      </MainContainer>
    </Root>
  );
}
