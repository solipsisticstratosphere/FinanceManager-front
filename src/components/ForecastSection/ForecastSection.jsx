import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectBudgetForecast,
  selectForecastsLoading,
  selectGoalForecast,
} from "../../redux/forecasts/selectors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import DetailedForecastModal from "../DetailedForecastModal/DetailedForecastModal";
import styles from "./ForecastSection.module.css";
import { Calculator, TrendingUp, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const ForecastSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState("goals");

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

  const handleOpenModal = (tab) => {
    setInitialModalTab(tab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.forecastSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Прогнози</h2>
        </div>
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <div className={styles.statsCard}>
              <div
                className={`${styles.iconWrapper} ${styles.iconWrapperPurple}`}
              >
                <Calculator className={`${styles.icon} ${styles.iconPurple}`} />
              </div>
              <div className={styles.statsContent}>
                <p className={styles.statsLabel}>Прогноз балансу (30 днів)</p>
                {forecastsLoading ? (
                  <p className={styles.statsValue}>Завантаження...</p>
                ) : budgetForecast?.length ? (
                  <p className={styles.statsValue}>
                    <CurrencyDisplay
                      amount={budgetForecast[0].projectedBalance}
                    />
                  </p>
                ) : (
                  <p className={styles.statsValue}>Немає даних</p>
                )}
                <button
                  className={styles.cardDetailButton}
                  onClick={() => handleOpenModal("categories")}
                >
                  Прогнози категорій <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {goalForecast ? (
            <div className={styles.card}>
              <div className={styles.statsCard}>
                <div
                  className={`${styles.iconWrapper} ${styles.iconWrapperTeal}`}
                >
                  <TrendingUp className={`${styles.icon} ${styles.iconTeal}`} />
                </div>
                <div className={styles.statsContent}>
                  <p className={styles.statsLabel}>Прогноз досягнення цілі</p>
                  <div className={styles.goalForecast}>
                    <p className={styles.statsValue}>
                      {goalForecast.bestCaseMonthsToGoal}{" "}
                      {formatMonthWord(goalForecast.bestCaseMonthsToGoal)}
                    </p>
                    <p className={styles.probability}>
                      Ймовірність: {goalForecast.probability.toFixed(1)}%
                    </p>
                  </div>
                  <button
                    className={styles.cardDetailButton}
                    onClick={() => handleOpenModal("goals")}
                  >
                    Детальний прогноз <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.statsCard}>
                <div
                  className={`${styles.iconWrapper} ${styles.iconWrapperTeal}`}
                >
                  <TrendingUp className={`${styles.icon} ${styles.iconTeal}`} />
                </div>
                <div className={styles.statsContent}>
                  <p className={styles.statsLabel}>Прогноз досягнення цілі</p>
                  <div className={styles.noGoalMessage}>
                    <p>Немає активних цілей</p>
                    <Link to="/goals" className={styles.createGoalLink}>
                      <Plus size={16} />
                      Створити ціль
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DetailedForecastModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialTab={initialModalTab}
      />
    </>
  );
};

export default ForecastSection;
