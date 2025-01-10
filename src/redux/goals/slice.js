import { createSlice } from "@reduxjs/toolkit";
import {
  createGoal,
  deactivateGoal,
  deleteGoal,
  fetchGoals,
  setActiveGoal,
} from "./operations";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    updateGoalProgress: (state, action) => {
      const { goalId, currentAmount, isActive } = action.payload;
      const goal = state.items.find((goal) => goal._id === goalId);
      if (goal) {
        goal.currentAmount = currentAmount;
        goal.isActive = isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setActiveGoal.fulfilled, (state, action) => {
        state.items = state.items.map((goal) => ({
          ...goal,
          isActive: goal._id === action.payload._id,
        }));
      })
      .addCase(deactivateGoal.fulfilled, (state, action) => {
        const goal = state.items.find(
          (goal) => goal._id === action.payload._id
        );
        if (goal) {
          goal.isActive = false;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (goal) => goal._id !== action.payload._id
        );
      });
  },
});

export const { updateGoalProgress } = slice.actions;

export const goalsReducer = slice.reducer;
