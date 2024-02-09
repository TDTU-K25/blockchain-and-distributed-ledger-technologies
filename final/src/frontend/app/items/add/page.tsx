'use client';

import { useAppSelector } from '@/context/store';
import { selectAccountId, selectIsLoading, selectWallet } from '@/features/walletSlice';
import { useEffect, useState } from 'react';

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';
const LINK_API = process.env.NEXT_PUBLIC_WEB_URL || '';

const styles = {
    formrow: {
        marginBottom: '32px',
    },
    label: {
        display: 'block',
        color: '#fff',
        fontSize: '16px',
        position: 'relative',
        paddingRight: '5px',
        marginBottom: '10px',
    },
    textbox: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '46px',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '6px',
        width: '100%',
        padding: '4px 11px',
    },
    textarea: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '100px',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '6px',
        width: '100%',
        padding: '4px 11px',
        resize: 'none',
    },
    contentdiv: {
        padding: '32px',
        background: '#29244e',
        borderRadius: '0px 0px 10px 10px',
    },
    pagename: {
        color: '#fff',
        padding: '16px',
        fontSize: '22px',
        backgroundColor: '#231D4B',
        fontWeight: 600,
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
    },
    formwrap: {
        background: '#29244e',
        maxWidth: '700px',
        margin: '16px auto',
        borderRadius: '10px',
    },
    btnrow: {
        display: 'flex',
        justifyContent: 'center',
    },
    btnback: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '16px',
        padding: '5px 16px',
        fontWeight: 400,
        background: 'none',
        backgroundColor: 'rgba(60, 53, 109, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
        height: '40px',
        borderRadius: '40px',
        lineHeight: '29px',
        letterSpacing: '0.01em',
        display: 'flex',
        alignItems: 'center',
    },

    btn: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '16px',
        padding: '5px 16px',
        fontWeight: 400,
        background: 'none',
        backgroundImage: 'linear-gradient(145deg, #016EDA, #6C1ECF, #016EDA, #6C1ECF)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
        height: '40px',
        borderRadius: '40px',
        lineHeight: '29px',
        letterSpacing: '0.01em',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '16px',
        justifyContent: 'center',
        maxWidth: '200px',
    },
};

const Form = () => {
    const wallet = useAppSelector(selectWallet);
    const account = useAppSelector(selectAccountId);
    const [walletReady, setWalletReady] = useState(false);
    const isLoading = useAppSelector(selectIsLoading);

    const [name, setName] = useState<string>('');
    const [media, setMedia] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        if (!isLoading && wallet) {
            setWalletReady(true);
        }
    }, [isLoading, wallet]);

    const createItem = async (e: any) => {
        if (!wallet) {
            console.error('Wallet is not initialized');
            return;
        }
        setWalletReady(false);
        e.preventDefault();
        const product = {
            name,
            media,
            description,
            userWalletId: account,
        };

        // Make a POST request
        await fetch(`${LINK_API}/api/v1/product/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Adjust the content type based on your API's requirements
            },
            body: JSON.stringify(product),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setWalletReady(true);
                alert('Add product submitted successfully!');
                // window.location.reload();
                return response.json();
            })
            .then((data) => {
                console.log('Data:', data);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });

        await wallet
            .callMethod({
                contractId: CONTRACT_ID,
                method: "create_item",
                args: { name, media, description },
                gas: "300000000000000",
            })
            .then(() => setWalletReady(true))
            .then(() => window.location.reload());
    };

    const handleChange = (setState: any) => (event: any) => {
        setState(event.target.value);
    };

    return (
        <>
            <div style={styles.formwrap}>
                <div style={styles.pagename}>Add item</div>

                <form style={styles.contentdiv} onSubmit={createItem}>
                    <div style={styles.formrow}>
                        <label>Name</label>
                        <input style={styles.textbox} name="myInput" value={name} onChange={handleChange(setName)} />
                    </div>
                    <div style={styles.formrow}>
                        <label>Media</label>
                        <input style={styles.textbox} name="myInput" value={media} onChange={handleChange(setMedia)} />
                    </div>
                    <div style={styles.formrow}>
                        <label>Description</label>
                        <textarea
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                minHeight: '100px',
                                color: '#fff',
                                fontSize: '14px',
                                borderRadius: '6px',
                                width: '100%',
                                padding: '4px 11px',
                                resize: 'none',
                            }}
                            rows={4}
                            cols={50}
                            value={description}
                            onChange={handleChange(setDescription)}
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
