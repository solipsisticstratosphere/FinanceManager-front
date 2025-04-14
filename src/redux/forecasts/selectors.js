export const selectBudgetForecast = (state) => state.forecasts.budgetForecasts;
export const selectGoalForecast = (state) => state.forecasts.goalForecast;
export const selectForecastsLoading = (state) => state.forecasts.isLoading;
export const selectForecastsError = (state) => state.forecasts.error;
export const selectForecastsLastUpdated = (state) =>
  state.forecasts.lastUpdated;
export const selectBudgetForecastForMonth = (state) =>
  state.forecasts.budgetForecasts[0];

// New selector for the budget forecast data structure
export const selectBudgetForecastData = (state) => state.forecasts.budgetForecastData;

// New selectors for detailed goal forecasts
export const selectDetailedGoalForecasts = (state) =>
  state.forecasts.detailedGoalForecasts.data;
export const selectDetailedGoalForecastsLoading = (state) =>
  state.forecasts.detailedGoalForecasts.isLoading;
export const selectDetailedGoalForecastsError = (state) =>
  state.forecasts.detailedGoalForecasts.error;
export const selectDetailedGoalForecastsLastUpdated = (state) =>
  state.forecasts.detailedGoalForecasts.lastUpdated;
export const selectGoalForecastDetails = (state) =>
  state.forecasts.detailedGoalForecasts.data?.goalForecast || null;

// New selectors for category forecasts
export const selectCategoryForecasts = (state) =>
  state.forecasts.categoryForecasts.data;
export const selectCategoryForecastsLoading = (state) =>
  state.forecasts.categoryForecasts.isLoading;
export const selectCategoryForecastsError = (state) =>
  state.forecasts.categoryForecasts.error;
export const selectCategoryForecastsLastUpdated = (state) =>
  state.forecasts.categoryForecasts.lastUpdated;
export const selectAllCategories = (state) =>
  state.forecasts.categoryForecasts.allCategories;
export const selectSelectedCategory = (state) =>
  state.forecasts.categoryForecasts.selectedCategory;
