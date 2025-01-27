import { createSlice } from "@reduxjs/toolkit";
import {
  logIn,
  loginWithGoogle,
  logout,
  refreshUser,
  register,
  updateUserSettings,
} from "./operations";

const initialState = {
  user: {
    name: null,
    email: null,
    avatarUrl: null,
    currency: "UAH",
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
  isRegistered: false,
  failedRefresh: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isRefreshing = false;
      state.error = null;
      state.failedRefresh = false;
    },
  },
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
        state.failedRefresh = false;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
        state.failedRefresh = true;
        state.error = action.payload;
      })
      //UpdateSettings
      .addCase(updateUserSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
        state.error = null;
      })
      .addCase(updateUserSettings.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.token = action.payload.token;

        state.user = {
          ...state.user,
          ...action.payload.user,
        };
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = false;
      })
      .addCase(loginWithGoogle.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = true;
      });
  },
});
export const { clearAuthState } = slice.actions;
export const authReducer = slice.reducer;
