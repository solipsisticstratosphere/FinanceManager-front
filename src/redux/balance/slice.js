import { createSlice } from "@reduxjs/toolkit";
import { fetchBalance, updateBalance } from "./operations";

const initialState = {
  balance: 0,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "balance",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.balance = payload.data.balance;
      })
      .addCase(fetchBalance.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBalance.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.balance = payload.data.balance;
      })
      .addCase(updateBalance.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const balanceReducer = slice.reducer;
