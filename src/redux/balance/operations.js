import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBalance = createAsyncThunk(
  "balance/fetchBalance",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/balance");
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBalance = createAsyncThunk(
  "balance/updateBalance",
  async (amount, thunkAPI) => {
    try {
      const { data } = await axios.put("/balance", { balance: amount });
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
