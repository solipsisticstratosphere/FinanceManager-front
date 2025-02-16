// redux/monobank/slice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  connectMonobank,
  disconnectMonobank,
  getMonobankStatus,
  syncMonobankTransactions,
} from "./operations";

const initialState = {
  connected: false,
  accounts: [],
  lastSync: null,
  isLoading: false,
  error: null,
  isSyncing: false,
};

const monobankSlice = createSlice({
  name: "monobank",
  initialState,
  reducers: {
    resetMonobankError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect Monobank
      .addCase(connectMonobank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectMonobank.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.connected = payload.connected;
        state.accounts = payload.accounts || [];
        state.error = null;
      })
      .addCase(connectMonobank.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // Disconnect Monobank
      .addCase(disconnectMonobank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disconnectMonobank.fulfilled, (state) => {
        state.isLoading = false;
        state.connected = false;
        state.accounts = [];
        state.lastSync = null;
        state.error = null;
      })
      .addCase(disconnectMonobank.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })

      // Sync Transactions
      .addCase(syncMonobankTransactions.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncMonobankTransactions.fulfilled, (state, { payload }) => {
        state.isSyncing = false;
        state.lastSync = payload.lastSync;
        // Обновляем счета из ответа API
        if (payload.accounts && payload.accounts.length > 0) {
          state.accounts = payload.accounts;
        }
        state.error = null;
      })
      .addCase(syncMonobankTransactions.rejected, (state, { payload }) => {
        state.isSyncing = false;
        state.error = payload;
      })

      // Get Status
      .addCase(getMonobankStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMonobankStatus.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.connected = payload.connected;
        state.accounts = payload.accounts || [];
        state.lastSync = payload.lastSync;
        state.error = null;
      })
      .addCase(getMonobankStatus.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { resetMonobankError } = monobankSlice.actions;
export const monobankReducer = monobankSlice.reducer;
