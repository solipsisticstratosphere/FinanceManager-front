import { createSlice } from "@reduxjs/toolkit";
import {
  calculateBudgetForecast,
  calculateGoalForecast,
  fetchGoalForecasts,
  fetchCategoryForecasts,
} from "./operations";

const initialState = {
  budgetForecasts: [],
  goalForecast: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  // New state properties for the additional forecast types
  detailedGoalForecasts: {
    data: null,
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
  categoryForecasts: {
    data: null,
    allCategories: [], // Store all categories separately
    selectedCategory: null, // Track what category is currently selected
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
};

const forecastsSlice = createSlice({
  name: "forecasts",
  initialState,
  reducers: {
    clearForecasts: (state) => {
      state.detailedGoalForecasts.data = null;
      state.categoryForecasts.data = null;
    },
  },
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
        state.goalForecast = action.payload.goalForecast || null;
      })
      .addCase(calculateGoalForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add handlers for the new forecast operations
      .addCase(fetchGoalForecasts.pending, (state) => {
        state.detailedGoalForecasts.isLoading = true;
        state.detailedGoalForecasts.error = null;
      })
      .addCase(fetchGoalForecasts.fulfilled, (state, action) => {
        state.detailedGoalForecasts.isLoading = false;

        // Handle the updated API response structure
        if (action.payload && action.payload.data) {
          // Store the entire response data object
          state.detailedGoalForecasts.data = action.payload.data;

          // If we have a specific goalForecast object in the response
          if (action.payload.data.goalForecast) {
            // Make sure it's accessible through our state
            state.detailedGoalForecasts.data.goalForecast =
              action.payload.data.goalForecast;
          }

          // Also update the lastUpdated timestamp
          state.detailedGoalForecasts.lastUpdated =
            action.payload.meta?.lastUpdated || null;
        } else {
          // If no data, set to null
          state.detailedGoalForecasts.data = null;
          state.detailedGoalForecasts.lastUpdated = null;
        }
      })
      .addCase(fetchGoalForecasts.rejected, (state, action) => {
        state.detailedGoalForecasts.isLoading = false;
        state.detailedGoalForecasts.error = action.payload;
      })

      .addCase(fetchCategoryForecasts.pending, (state, action) => {
        state.categoryForecasts.isLoading = true;
        state.categoryForecasts.error = null;
        // Store which category is being fetched (can be empty string or undefined)
        state.categoryForecasts.selectedCategory = action.meta.arg || null;
      })
      .addCase(fetchCategoryForecasts.fulfilled, (state, action) => {
        state.categoryForecasts.isLoading = false;
        const categoryData = action.payload.data || { categories: [] };

        // Update current data
        state.categoryForecasts.data = categoryData;
        state.categoryForecasts.lastUpdated =
          action.payload.meta?.lastUpdated || null;

        // If this was a request for all categories, update the allCategories array and clear selectedCategory
        if (
          !state.categoryForecasts.selectedCategory &&
          categoryData.categories?.length > 0
        ) {
          state.categoryForecasts.allCategories = categoryData.categories;
        } else if (state.categoryForecasts.selectedCategory === "") {
          // If an empty string was passed (all categories), reset the selectedCategory to null
          state.categoryForecasts.selectedCategory = null;

          // Also update allCategories if we got categories back
          if (categoryData.categories?.length > 0) {
            state.categoryForecasts.allCategories = categoryData.categories;
          }
        }
      })
      .addCase(fetchCategoryForecasts.rejected, (state, action) => {
        state.categoryForecasts.isLoading = false;
        state.categoryForecasts.error = action.payload;
      });
  },
});

export const { clearForecasts } = forecastsSlice.actions;
export const forecastsReducer = forecastsSlice.reducer;
