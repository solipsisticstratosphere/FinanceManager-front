import { createSlice } from "@reduxjs/toolkit";
import { logIn, logout, refreshUser, register } from "./operations";

const initialState = {
  user: {
    name: null,
    email: null,
    avatarUrl: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
  isRegistered: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      //Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.data.user;
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRegistered = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      //LogIn
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logIn.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.data.user;
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(logIn.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      //Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        return initialState;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.error = true;
      })
      //Refresh
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
        state.error = action.payload;
      });
  },
});

export const authReducer = slice.reducer;
