export const selectGoals = (state) => state.goals.items || [];
export const selectActiveGoal = (state) => {
  const items = state.goals.items || [];
  return items.find((goal) => goal.isActive);
};
export const selectGoalsLoading = (state) => state.goals.isLoading;
export const selectGoalsError = (state) => state.goals.error;
