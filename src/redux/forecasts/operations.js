import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const calculateBudgetForecast = createAsyncThunk(
  "forecasts/calculateBudgetForecast",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/forecasts");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const calculateGoalForecast = createAsyncThunk(
  "forecasts/calculateGoalForecast",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/forecasts");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
