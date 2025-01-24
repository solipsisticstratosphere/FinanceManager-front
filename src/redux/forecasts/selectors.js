export const selectBudgetForecast = (state) => state.forecasts.budgetForecasts;
export const selectGoalForecast = (state) => state.forecasts.goalForecast;
export const selectForecastsLoading = (state) => state.forecasts.isLoading;
export const selectForecastsError = (state) => state.forecasts.error;
export const selectForecastsLastUpdated = (state) =>
  state.forecasts.lastUpdated;
