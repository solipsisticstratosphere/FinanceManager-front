import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clearAuthState } from "./slice";
axios.defaults.baseURL = "https://financemanager-back.onrender.com/";
axios.defaults.withCredentials = true;

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = "";
};

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/register", credentials);
      setAuthHeader(data.token);
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post("/auth/login", credentials);
      setAuthHeader(data.token);
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.post("/auth/logout");

    clearAuthHeader();

    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data || { message: "Failed to logout" }
    );
  }
});

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue("No token found");
    }

    try {
      setAuthHeader(persistedToken);
      const { data } = await axios.get("/users/current");
      return data.data;
    } catch (error) {
      clearAuthHeader();
      if (error.response?.status === 401) {
        thunkAPI.dispatch(clearAuthState());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      return !state.auth.isRefreshing;
    },
  }
);

export const updateUserSettings = createAsyncThunk(
  "auth/updateSettings",
  async (updateData, thunkAPI) => {
    try {
      const { data } = await axios.patch("/users/settings", updateData);
      return data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/googleLogin",
  async (code, thunkAPI) => {
    try {
      const response = await axios.post("/auth/confirm-oauth", { code });

      if (!response.data?.data?.accessToken) {
        throw new Error("Invalid response format from server");
      }

      const { accessToken } = response.data.data;
      setAuthHeader(accessToken);

      const { data: userResponse } = await axios.get("/users/current");

      if (!userResponse?.data && !userResponse?.email) {
        throw new Error("Invalid user data received");
      }

      const userData = userResponse.data || userResponse;

      return {
        token: accessToken,
        user: {
          name: userData.name || "",
          email: userData.email || "",
          balance: userData.balance || 0,
          avatarUrl: userData.avatarUrl || "",
        },
      };
    } catch (error) {
      // Improve error handling
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to login with Google";

      console.error("Google login error:", {
        message: errorMessage,
        response: error.response?.data,
        status: error.response?.status,
      });

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
