import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Network, NetworkId } from "@near-wallet-selector/core";
import { RootState } from "@/context/store";
import { Wallet } from "@/utils/near-wallet";

type WalletState = {
  wallet: Wallet | null;
  isLoading: boolean;
};

const initialState: WalletState = {
  wallet: null,
  isLoading: true,
};

export const initWallet = createAsyncThunk(
  "wallet/init",
  async ({
    contractId,
    network,
  }: {
    contractId: string | undefined;
    network: Network | NetworkId;
  }) => {
    const wallet = new Wallet({
      createAccessKeyFor: contractId,
      network,
    });

    await wallet.startUp().catch((e) => {
      console.error("Wallet start up failed", e);
    });

    return wallet;
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    logout: (state) => {
      state.wallet = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initWallet.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(initWallet.fulfilled, (state, action) => {
      if (!state.wallet) state.wallet = action.payload;

      state.isLoading = false;
    });
    builder.addCase(initWallet.rejected, (state) => {
      state.wallet = null;
    });
  },
});


export const { logout } = walletSlice.actions;
export default walletSlice.reducer;

export const selectWallet = (state: RootState): Wallet | null =>
  state.wallet.wallet;
export const selectAccountId = (state: RootState): string | undefined =>
  state.wallet.wallet?.accountId;
export const selectIsConnected = (state: RootState): boolean =>
  !!state.wallet.wallet?.accountId;
export const selectIsLoading = (state: RootState): boolean =>
  state.wallet.isLoading;
