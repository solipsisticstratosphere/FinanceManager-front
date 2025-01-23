import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchForecast = createAsyncThunk(
  "forecasts/fetchForecast",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/forecast");
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const calculateBudgetForecast = createAsyncThunk(
  "forecasts/calculateBudgetForecast",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const transactions = state.transactions.items;

    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const recentTransactions = transactions.filter(
      (t) => new Date(t.date) >= sixMonthAgo
    );

    const monthlyStats = recentTransactions.reduce(
      (acc, t) => {
        if (t.type === "expense") {
          acc.avgExpense += t.amount / 6;
        } else {
          acc.avgIncome += t.amount / 6;
        }
        return acc;
      },
      { avgExpense: 0, avgIncome: 0 }
    );

    const forecast = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return {
        date: date.toISOString().slice(0, 7),
        projectedExpense: monthlyStats.avgExpense,
        projectedIncome: monthlyStats.avgIncome,
        projectedBalance: monthlyStats.avgIncome - monthlyStats.avgExpense,
      };
    });

    return forecast;
  }
);

export const calculateGoalForecast = createAsyncThunk(
  "forecasts/calculateGoal",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const activeGoal = state.goals.items.find((g) => g.isActive);
    const transactions = state.transactions.items;

    if (!activeGoal) return null;

    // Calculate average monthly savings
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentTransactions = transactions.filter(
      (t) => new Date(t.date) >= threeMonthsAgo
    );

    const monthlySavings =
      recentTransactions.reduce(
        (acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount),
        0
      ) / 3;

    // Calculate months to goal
    const remaining = activeGoal.targetAmount - activeGoal.currentAmount;
    const monthsToGoal = Math.ceil(remaining / monthlySavings);

    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + monthsToGoal);

    return {
      monthsToGoal,
      projectedDate: projectedDate.toISOString(),
      monthlySavings,
      probability:
        monthlySavings > 0
          ? Math.min((monthlySavings / remaining) * 100, 100)
          : 0,
    };
  }
);
