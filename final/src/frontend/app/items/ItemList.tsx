'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Item } from '../@types/Item.type';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAppSelector } from '@/context/store';
import { selectAccountId, selectIsLoading, selectWallet } from '@/features/walletSlice';
import Title from '../components/Title';

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';
const LINK_API = process.env.NEXT_PUBLIC_WEB_URL || '';

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

interface ItemListProps {
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
}

export default function ItemList(props: ItemListProps) {
    const { items, setItems } = props;
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const wallet = useAppSelector(selectWallet);
    const account = useAppSelector(selectAccountId);
    const [walletReady, setWalletready] = useState(false);
    const isLoading = useAppSelector(selectIsLoading);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && wallet) {
            setWalletready(true);
        }
    }, [isLoading, wallet]);

    const finishDeleteItem = async (e: any) => {
        if (!wallet) {
            console.error('Wallet is not initialized');
            return;
        }
        setWalletready(false);
        e.preventDefault();

        if (currentItem == null) return;
        const deleteProduct = async () => {
            try {
                const response = await fetch(`${LINK_API}/api/v1/product/delete/${currentItem.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data?.code == 200) {
                    setCurrentItem(null);
                    setWalletready(true);
                    // window.location.reload();
                }

                console.log('Data:', data);
            } catch (error) {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
            }
        };

        await deleteProduct();
        await wallet
            .callMethod({
                contractId: CONTRACT_ID,
                method: "delete_item",
                args: { item_id: currentItem?.item_id },
                gas: "300000000000000",
            })
            .then(() => setWalletready(true))
            .then(() => setCurrentItem(null))
            .then(() => {
                window.location.reload();
            });
    };

    const startDeleteItem = (id: string) => {
        let itemFound = items.find((item) => item.id === id);
        if (itemFound) {
            setCurrentItem(itemFound);
        }
        setIsShowModal(true);
    };

    return (
        <>
            <Title name="Your Inventory" />
            <div>
                <Link href="/items/add">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded text-white"
                        style={{ margin: '0 auto', display: 'block' }}
                    >
                        Add item
                    </button>
                </Link>
            </div>
            {items.length === 0 && (
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: 'black', marginTop: '1rem' }}>You do not have any items</h1>
                </div>
            )}
            <Cards>
                {items.map((item) => (
                    <Card key={item.item_id}>
                        <ImageCard>
                            <Link href={`/items/detail?id=${item.item_id}`}>
                                <img src={item.media} alt="..." />
                            </Link>
                        </ImageCard>
                        <div className="card-body p-2 mt-3" style={{ textAlign: 'center' }}>
                            <CardHeading>{item.name}</CardHeading>
                            <Text className="ps-2  pb-3 text-secondary">{item.description}</Text>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    startDeleteItem(item.id);
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                style={{ marginRight: '0.5rem' }}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    router.push('/items/edit?id=' + item.id);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    </Card>
                ))}
            </Cards>
            <Modal isShowModal={isShowModal} setIsShowModal={setIsShowModal} finishDelete={finishDeleteItem} />
        </>
    );
}
