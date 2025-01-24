import { createSlice } from "@reduxjs/toolkit";
import { calculateBudgetForecast, calculateGoalForecast } from "./operations";

const initialState = {
  budgetForecasts: [],
  goalForecast: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const forecastsSlice = createSlice({
  name: "forecasts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculateBudgetForecast.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculateBudgetForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetForecasts = action.payload.budgetForecasts;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(calculateBudgetForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(calculateGoalForecast.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(calculateGoalForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goalForecast = action.payload.goalForecast;
      })
      .addCase(calculateGoalForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const forecastsReducer = forecastsSlice.reducer;
