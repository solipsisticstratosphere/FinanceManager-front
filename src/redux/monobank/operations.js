// redux/monobank/operations.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchTransactions } from "../transactions/operations";
import { fetchBalance } from "../balance/operations";

// В операции connectMonobank
export const connectMonobank = createAsyncThunk(
  "monobank/connect",
  async (token, thunkAPI) => {
    try {
      const { data } = await axios.post("/api/monobank/connect", { token });

      // После успешного подключения загружаем обновленные данные
      await Promise.all([
        thunkAPI.dispatch(fetchTransactions()),
        thunkAPI.dispatch(fetchBalance()),
      ]);

      return data.data;
    } catch (error) {
      console.error("Error connecting Monobank:", error);

      // Специфическая обработка ошибки "токен уже используется"
      if (
        error.response &&
        error.response.data &&
        error.response.data.code === "TOKEN_ALREADY_IN_USE"
      ) {
        return thunkAPI.rejectWithValue(
          "Этот токен уже используется в другом аккаунте. Сначала отключите его там."
        );
      }

      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const disconnectMonobank = createAsyncThunk(
  "monobank/disconnect",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.delete("/api/monobank/disconnect");
      return data.data;
    } catch (error) {
      console.error("Error disconnecting Monobank:", error);
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const syncMonobankTransactions = createAsyncThunk(
  "monobank/sync",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.post("/api/monobank/sync");

      // После успешной синхронизации загружаем обновленные данные
      await Promise.all([
        thunkAPI.dispatch(fetchTransactions()),
        thunkAPI.dispatch(fetchBalance()),
      ]);

      return {
        lastSync: data.data.lastSync,
        accounts: data.data.accounts || [], // Получаем обновленные счета с сервера
      };
    } catch (error) {
      console.error("Error syncing Monobank transactions:", error);
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getMonobankStatus = createAsyncThunk(
  "monobank/status",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/api/monobank/status");
      return data.data;
    } catch (error) {
      console.error("Error getting Monobank status:", error);
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
