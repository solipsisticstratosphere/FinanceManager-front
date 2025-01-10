import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/goal");
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalData, thunkAPI) => {
    try {
      const response = await axios.post("/goal", goalData);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const setActiveGoal = createAsyncThunk(
  "goals/setActive",
  async (goalId, thunkAPI) => {
    try {
      const response = await axios.patch(`/goal/${goalId}/activate`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deactivateGoal = createAsyncThunk(
  "goals/deactivate",
  async (goalId, thunkAPI) => {
    try {
      const response = await axios.patch(`/goal/${goalId}/deactivate`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (goalId, thunkAPI) => {
    try {
      const response = await axios.delete(`/goal/${goalId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
