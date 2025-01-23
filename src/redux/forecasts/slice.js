import { createSlice } from "@reduxjs/toolkit";
import {
  calculateBudgetForecast,
  calculateGoalForecast,
  fetchForecast,
} from "./operations";

const initialState = {
  budgetForecast: [],
  goalForecast: null,
  isLoading: false,
  error: null,
};

const forecastSlice = createSlice({
  name: "forecasts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForecast.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetForecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(calculateBudgetForecast.fulfilled, (state, action) => {
        state.budgetForecast = action.payload;
      })
      .addCase(calculateGoalForecast.fulfilled, (state, action) => {
        state.goalForecast = action.payload;
      });
  },
});

export const forecastsReducer = forecastSlice.reducer;
