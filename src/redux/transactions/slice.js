import { createSlice } from "@reduxjs/toolkit";
import { addTransaction, fetchTransactions } from "./operations";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // Fix: access the nested data.data.transactions array
        state.items = payload.data;
      })
      .addCase(fetchTransactions.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(addTransaction.pending, (state, action) => {
        state.isLoading = true;
        // Оптимистично добавляем транзакцию во временное состояние
        const tempTransaction = {
          ...action.meta.arg,
          _id: "temp_" + Date.now(), // временный ID
          date: new Date().toISOString(),
        };
        state.items = [tempTransaction, ...state.items];
      })
      .addCase(addTransaction.fulfilled, (state) => {
        state.isLoading = false;
        // Актуальные данные придут через fetchTransactions
      })
      .addCase(addTransaction.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        // Удаляем оптимистично добавленную транзакцию в случае ошибки
        state.items = state.items.filter(
          (item) => !item._id.startsWith("temp_")
        );
      });
  },
});

export const transactionsReducer = slice.reducer;
