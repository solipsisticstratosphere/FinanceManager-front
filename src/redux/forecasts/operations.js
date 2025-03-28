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

// New operations for the additional forecast endpoints

export const fetchGoalForecasts = createAsyncThunk(
  "forecasts/fetchGoalForecasts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/forecasts/goals");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchCategoryForecasts = createAsyncThunk(
  "forecasts/fetchCategoryForecasts",
  async (category, thunkAPI) => {
    try {
      const url = category
        ? `/forecasts/categories?category=${encodeURIComponent(category)}`
        : "/forecasts/categories";

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
