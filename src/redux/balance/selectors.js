export const selectBalance = (state) => state.balance.balance;
export const selectLoadingBalance = (state) => state.balance.isLoading;
export const selectErrorBalance = (state) => state.balance.error;
export const selectBalanceInitialized = (state) =>
  state.balance.isBalanceInitialized;
