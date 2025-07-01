import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectBudgetForecastData,
  selectForecastsLoading,
  selectGoalForecast,
} from "../../redux/forecasts/selectors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import DetailedForecastModal from "../DetailedForecastModal/DetailedForecastModal";
import styles from "./ForecastSection.module.css";
import {
  Calculator,
  TrendingUp,
  ChevronRight,
  Plus,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const ForecastSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState("goals");
  const [activeTab, setActiveTab] = useState("budget");

  const forecastsLoading = useSelector(selectForecastsLoading);
  const budgetForecast = useSelector(selectBudgetForecastData);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleOpenModal = (tab) => {
    setInitialModalTab(tab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const calculateGoalProgress = () => {
    if (
      !goalForecast ||
      !goalForecast.goalAmount ||
      goalForecast.goalAmount <= 0
    ) {
      return 0;
    }

    const savedAmount = goalForecast.currentAmount || 0;
    const progress = (savedAmount / goalForecast.goalAmount) * 100;
    return Math.min(Math.max(0, progress), 100);
  };

  const goalProgress = calculateGoalProgress();

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Calculator
            size={18}
            style={{ marginRight: "8px", verticalAlign: "text-bottom" }}
          />
          Прогнози
        </h2>
      </div>

      <div className={styles.forecastSection}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "budget" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("budget")}
          >
            <Calculator size={18} />
            <span>Бюджет</span>
          </button>

          {budgetForecast?.quickEstimates?.length > 0 && (
            <button
              className={`${styles.tabButton} ${
                activeTab === "quick" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("quick")}
            >
              <Calendar size={18} />
              <span>Швидкі прогнози</span>
            </button>
          )}

          <button
            className={`${styles.tabButton} ${
              activeTab === "goals" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("goals")}
          >
            <TrendingUp size={18} />
            <span>Цілі</span>
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "budget" && (
            <div className={styles.card}>
              <div className={styles.statsCard}>
                <div
                  className={`${styles.iconWrapper} ${styles.iconWrapperPurple}`}
                >
                  <Calculator
                    className={`${styles.icon} ${styles.iconPurple}`}
                  />
                </div>
                <div className={styles.statsContent}>
                  <p className={styles.statsLabel}>Прогноз балансу (30 днів)</p>
                  {forecastsLoading ? (
                    <p className={styles.statsValue}>Завантаження...</p>
                  ) : budgetForecast?.thirtyDayBudget ? (
                    <p className={styles.statsValue}>
                      <CurrencyDisplay
                        amount={budgetForecast.thirtyDayBudget.projectedBalance}
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
          )}

          {activeTab === "quick" &&
            budgetForecast?.quickEstimates?.length > 0 && (
              <div className={styles.card}>
                <div className={styles.statsCard}>
                  <div
                    className={`${styles.iconWrapper} ${styles.iconWrapperTeal}`}
                  >
                    <Calendar className={`${styles.icon} ${styles.iconTeal}`} />
                  </div>
                  <div className={styles.statsContent}>
                    <p className={styles.statsLabel}>Швидкі прогнози</p>
                    <div className={styles.quickEstimates}>
                      {budgetForecast.quickEstimates.map((estimate, index) => (
                        <div key={index} className={styles.estimateItem}>
                          <div className={styles.estimateHeader}>
                            <span className={styles.estimateMonth}>
                              {new Date(estimate.monthStr).toLocaleDateString(
                                "uk-UA",
                                {
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className={styles.estimateConfidence}>
                              {estimate.confidence}% впевненості
                            </span>
                          </div>
                          <div className={styles.estimateDetails}>
                            <div className={styles.estimateRow}>
                              <span>Доходи:</span>
                              <CurrencyDisplay
                                amount={estimate.projectedIncome}
                              />
                            </div>
                            <div className={styles.estimateRow}>
                              <span>Витрати:</span>
                              <CurrencyDisplay
                                amount={estimate.projectedExpense}
                              />
                            </div>
                            <div className={styles.estimateRow}>
                              <span>Баланс:</span>
                              <CurrencyDisplay
                                amount={estimate.projectedBalance}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.lastUpdated}>
                      Оновлено:{" "}
                      {formatDate(
                        budgetForecast.quickEstimates[0]?.lastCalculated
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {activeTab === "goals" && (
            <>
              {goalForecast ? (
                <div className={styles.card}>
                  <div className={styles.statsCard}>
                    <div
                      className={`${styles.iconWrapper} ${styles.iconWrapperTeal}`}
                    >
                      <TrendingUp
                        className={`${styles.icon} ${styles.iconTeal}`}
                      />
                    </div>
                    <div className={styles.statsContent}>
                      <p className={styles.statsLabel}>
                        Прогноз досягнення цілі
                      </p>
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
                      <TrendingUp
                        className={`${styles.icon} ${styles.iconTeal}`}
                      />
                    </div>
                    <div className={styles.statsContent}>
                      <p className={styles.statsLabel}>
                        Прогноз досягнення цілі
                      </p>
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
            </>
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
