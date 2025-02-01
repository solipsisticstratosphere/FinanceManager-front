import { useSelector } from "react-redux";
import {
  selectBudgetForecast,
  selectForecastsLoading,
  selectGoalForecast,
} from "../../redux/forecasts/selectors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import styles from "./ForecastSection.module.css";
import { Calculator, TrendingUp } from "lucide-react";

const ForecastSection = () => {
  const forecastsLoading = useSelector(selectForecastsLoading);
  const budgetForecast = useSelector(selectBudgetForecast);
  const goalForecast = useSelector(selectGoalForecast);

  const formatMonthWord = (number) => {
    const absNumber = Math.abs(number);
    const lastDigit = absNumber % 10;
    const lastTwoDigits = absNumber % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "місяців";
    }

    switch (lastDigit) {
      case 1:
        return "місяць";
      case 2:
      case 3:
      case 4:
        return "місяці";
      default:
        return "місяців";
    }
  };

  return (
    <div className={styles.forecastSection}>
      <div className={styles.card}>
        <div className={styles.statsCard}>
          <div className={`${styles.iconWrapper} ${styles.iconWrapperPurple}`}>
            <Calculator className={`${styles.icon} ${styles.iconPurple}`} />
          </div>
          <div className={styles.statsContent}>
            <p className={styles.statsLabel}>Прогноз балансу (30 днів)</p>
            {forecastsLoading ? (
              <p className={styles.statsValue}>Завантаження...</p>
            ) : budgetForecast?.length ? (
              <p className={styles.statsValue}>
                <CurrencyDisplay amount={budgetForecast[0].projectedBalance} />
              </p>
            ) : (
              <p className={styles.statsValue}>Немає даних</p>
            )}
          </div>
        </div>
      </div>

      {goalForecast && (
        <div className={styles.card}>
          <div className={styles.statsCard}>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperTeal}`}>
              <TrendingUp className={`${styles.icon} ${styles.iconTeal}`} />
            </div>
            <div className={styles.statsContent}>
              <p className={styles.statsLabel}>Прогноз досягнення цілі</p>
              <div className={styles.goalForecast}>
                <p className={styles.statsValue}>
                  {goalForecast.monthsToGoal}{" "}
                  {formatMonthWord(goalForecast.monthsToGoal)}
                </p>
                <p className={styles.probability}>
                  Ймовірність: {goalForecast.probability.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastSection;
