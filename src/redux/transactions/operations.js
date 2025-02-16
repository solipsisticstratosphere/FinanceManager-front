import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchBalance } from "../balance/operations";
import { fetchGoals } from "../goals/operations";

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
      const response = await axios.post("/transactions", transaction);

      // Check if the response has the expected structure
      if (
        response.data?.status === "success" &&
        response.data?.data?.transaction
      ) {
        // Only dispatch other actions if the transaction was successful
        await Promise.all([
          thunkAPI.dispatch(fetchTransactions()),
          thunkAPI.dispatch(fetchBalance()),
          thunkAPI.dispatch(fetchGoals()),
        ]);

        return response.data.data.transaction;
      } else {
        return thunkAPI.rejectWithValue("Unexpected response format");
      }
    } catch (error) {
      console.error("Transaction error:", error.response || error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else if (error.response?.status === 400) {
        return thunkAPI.rejectWithValue("Invalid transaction data");
      } else if (error.response?.status === 401) {
        return thunkAPI.rejectWithValue("Authentication required");
      } else {
        return thunkAPI.rejectWithValue("Could not process transaction");
      }
    }
  }
);
