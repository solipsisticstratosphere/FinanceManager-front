import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchBalance } from "../balance/operations";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, thunkAPI) => {
    try {
      console.log("Fetching transactions...");
      const { data } = await axios.get("/transactions");
      console.log("Received data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction, thunkAPI) => {
    try {
      const { data } = await axios.post("/transactions", transaction);

      // Выполним запросы параллельно
      await Promise.all([
        thunkAPI.dispatch(fetchTransactions()),
        thunkAPI.dispatch(fetchBalance()),
      ]);

      return data;
    } catch (error) {
      console.error("Error in addTransaction:", error);
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
