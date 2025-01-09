export const selectTransactions = (state) => state.transactions.items;
export const selectTotalExpenses = (state) => {
  const transactions = state.transactions?.items || [];
  return transactions
    .filter((t) => t && t.type === "expense") // Add extra check for valid transaction
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0); // Convert to number and handle invalid amounts
};
export const selectLoadingTransactions = (state) =>
  state.transactions.isLoading;
export const selectTransactionsError = (state) => state.transactions.error;
