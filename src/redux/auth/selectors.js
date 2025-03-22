export const selectUser = (state) => state.auth.user;
export const selectIsRefreshing = (state) => state.auth.isRefreshing;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectIsRegistered = (state) => state.auth.isRegistered;
export const selectCurrency = (state) => state.auth.user?.currency || "UAH";
export const selectUserName = (state) => state.auth.user.name;
