import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  selectDetailedGoalForecasts,
  selectDetailedGoalForecastsLoading,
  selectCategoryForecasts,
  selectCategoryForecastsLoading,
  selectDetailedGoalForecastsLastUpdated,
  selectCategoryForecastsLastUpdated,
  selectAllCategories,
  selectSelectedCategory,
  selectGoalForecastDetails,
} from "../../redux/forecasts/selectors";
import { fetchCategoryForecasts } from "../../redux/forecasts/operations";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import {
  X,
  Calendar,
  TrendingUp,
  PieChart,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Droplets,
  Clock,
  TrendingDown,
} from "lucide-react";
import styles from "./DetailedForecastModal.module.css";

const DetailedForecastModal = ({ isOpen, onClose, initialTab = "goals" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedGoalDetails, setExpandedGoalDetails] = useState(false);

  const dispatch = useDispatch();

  const goalForecasts = useSelector(selectDetailedGoalForecasts);
  const goalForecastDetails = useSelector(selectGoalForecastDetails);
  const goalForecastsLoading = useSelector(selectDetailedGoalForecastsLoading);
  const goalForecastsLastUpdated = useSelector(
    selectDetailedGoalForecastsLastUpdated
  );

  const categoryForecasts = useSelector(selectCategoryForecasts);
  const categoryForecastsLoading = useSelector(selectCategoryForecastsLoading);
  const categoryForecastsLastUpdated = useSelector(
    selectCategoryForecastsLastUpdated
  );
  const allCategories = useSelector(selectAllCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
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
  // Initialize the modal to fetch all categories on first open
  useEffect(() => {
    if (isOpen && activeTab === "categories") {
      dispatch(fetchCategoryForecasts());
    }
  }, [dispatch, isOpen, activeTab]);

  // Reset expanded category when changing tabs or categories
  useEffect(() => {
    setExpandedCategory(null);
    setExpandedGoalDetails(false);
  }, [activeTab, selectedCategory]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      month: "long",
      year: "numeric",
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    dispatch(fetchCategoryForecasts(value));
  };

  const toggleCategoryExpand = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const toggleGoalDetails = () => {
    setExpandedGoalDetails(!expandedGoalDetails);
  };

  // Check if we have any goal forecast data (either in goals or goalForecast)
  const hasGoalData =
    goalForecasts &&
    ((goalForecasts.goals && goalForecasts.goals.length > 0) ||
      goalForecastDetails);

  // Determine which categories to display
  const categoriesToDisplay = selectedCategory
    ? categoryForecasts?.categories || []
    : allCategories.length > 0
    ? allCategories
    : categoryForecasts?.categories || [];

  // Get risk icon based on type
  const getRiskIcon = (type) => {
    switch (type) {
      case "high_variability":
        return <Droplets size={16} className={styles.riskIcon} />;
      case "declining_savings":
        return <TrendingDown size={16} className={styles.riskIcon} />;
      default:
        return <AlertTriangle size={16} className={styles.riskIcon} />;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Детальні прогнози</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "goals" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("goals")}
          >
            <TrendingUp size={18} />
            Прогнози цілей
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "categories" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <PieChart size={18} />
            Прогнози категорій
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "goals" ? (
            <div className={styles.goalsTab}>
              {goalForecastsLoading ? (
                <div className={styles.loading}>Завантаження прогнозів...</div>
              ) : !hasGoalData ? (
                <div className={styles.noData}>
                  <Info size={24} className={styles.infoIcon} />
                  <p>Немає активних цілей для прогнозування</p>
                  <p className={styles.noDataHint}>
                    Створіть фінансову ціль, щоб отримати прогноз досягнення
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles.lastUpdated}>
                    <Calendar size={16} />
                    <span>
                      Останнє оновлення: {formatDate(goalForecastsLastUpdated)}
                    </span>
                  </div>

                  {goalForecasts.goals?.map((goal, index) => (
                    <div key={index} className={styles.forecastCard}>
                      <h3 className={styles.goalName}>{goal.name}</h3>
                      <div className={styles.forecastDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Ціль:</span>
                          <span className={styles.detailValue}>
                            <CurrencyDisplay amount={goal.targetAmount} />
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Поточний прогрес:
                          </span>
                          <span className={styles.detailValue}>
                            <CurrencyDisplay amount={goal.currentAmount} />
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Прогнозована дата досягнення:
                          </span>
                          <span className={styles.detailValue}>
                            {goal.projectedCompletionDate
                              ? formatDate(goal.projectedCompletionDate)
                              : "Недостатньо даних"}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Ймовірність досягнення:
                          </span>
                          <span className={styles.detailValue}>
                            {goal.probability !== undefined
                              ? `${goal.probability.toFixed(1)}%`
                              : "Недостатньо даних"}
                          </span>
                        </div>
                        <div className={styles.progressBarContainer}>
                          <div
                            className={styles.progressBar}
                            style={{
                              width: `${Math.min(
                                100,
                                (goal.currentAmount / goal.targetAmount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {goalForecastDetails && (
                    <div className={styles.forecastCard}>
                      <div className={styles.forecastHeader}>
                        <h3 className={styles.forecastTitle}>
                          Детальний прогноз
                        </h3>
                      </div>
                      <div className={styles.forecastDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Очікуваний час до досягнення:
                          </span>
                          <span className={styles.detailValue}>
                            {goalForecastDetails.expectedMonthsToGoal}{" "}
                            {formatMonthWord(
                              goalForecastDetails.expectedMonthsToGoal
                            )}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Прогнозована дата:
                          </span>
                          <span className={styles.detailValue}>
                            {formatDate(goalForecastDetails.projectedDate)}
                          </span>
                        </div>

                        <div className={styles.scenariosContainer}>
                          <div className={styles.scenarioItem}>
                            <div className={styles.scenarioLabel}>
                              <Clock
                                size={16}
                                className={styles.scenarioIcon}
                              />
                              Оптимістичний сценарій
                            </div>
                            <div className={styles.scenarioValue}>
                              {goalForecastDetails.bestCaseMonthsToGoal}{" "}
                              {formatMonthWord(
                                goalForecastDetails.bestCaseMonthsToGoal
                              )}
                            </div>
                          </div>

                          <div className={styles.scenarioItem}>
                            <div className={styles.scenarioLabel}>
                              <Clock
                                size={16}
                                className={styles.scenarioIcon}
                              />
                              Песимістичний сценарій
                            </div>
                            <div className={styles.scenarioValue}>
                              {goalForecastDetails.worstCaseMonthsToGoal}{" "}
                              {formatMonthWord(
                                goalForecastDetails.worstCaseMonthsToGoal
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Щомісячні заощадження:
                          </span>
                          <span className={styles.detailValue}>
                            <CurrencyDisplay
                              amount={goalForecastDetails.monthlySavings}
                            />
                          </span>
                        </div>

                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            Волатильність заощаджень:
                          </span>
                          <span className={styles.detailValue}>
                            <CurrencyDisplay
                              amount={goalForecastDetails.savingsVariability}
                            />
                          </span>
                        </div>

                        <button
                          className={styles.expandButton}
                          onClick={toggleGoalDetails}
                        >
                          {expandedGoalDetails ? (
                            <>
                              <span>Сховати фактори ризику</span>
                              <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              <span>Показати фактори ризику</span>
                              <ChevronDown size={16} />
                            </>
                          )}
                        </button>

                        {expandedGoalDetails &&
                          goalForecastDetails.riskFactors && (
                            <div className={styles.riskFactors}>
                              <h4 className={styles.riskFactorsTitle}>
                                Фактори ризику:
                              </h4>
                              <div className={styles.risksList}>
                                {goalForecastDetails.riskFactors.map(
                                  (risk, idx) => (
                                    <div key={idx} className={styles.riskItem}>
                                      <div className={styles.riskHeader}>
                                        {getRiskIcon(risk.type)}
                                        <span className={styles.riskType}>
                                          {risk.description}
                                        </span>
                                      </div>
                                      <div
                                        className={styles.riskSeverity}
                                        style={{
                                          width: `${risk.severity}%`,
                                          backgroundColor:
                                            risk.severity > 75
                                              ? "#ef4444"
                                              : risk.severity > 50
                                              ? "#f97316"
                                              : risk.severity > 25
                                              ? "#eab308"
                                              : "#22c55e",
                                        }}
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className={styles.categoriesTab}>
              <div className={styles.categorySelector}>
                <label htmlFor="categorySelect" className={styles.selectLabel}>
                  Оберіть категорію:
                </label>
                <select
                  id="categorySelect"
                  value={selectedCategory || ""}
                  onChange={handleCategoryChange}
                  className={styles.categorySelect}
                >
                  <option value="">Всі категорії</option>
                  {allCategories.map((cat, index) => (
                    <option key={index} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              {categoryForecastsLoading ? (
                <div className={styles.loading}>Завантаження прогнозів...</div>
              ) : !categoriesToDisplay.length ? (
                <div className={styles.noData}>
                  <Info size={24} className={styles.infoIcon} />
                  <p>Немає даних про прогнози категорій</p>
                  <p className={styles.noDataHint}>
                    Для отримання прогнозів додайте транзакції за різними
                    категоріями
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles.lastUpdated}>
                    <Calendar size={16} />
                    <span>
                      Останнє оновлення:{" "}
                      {formatDate(categoryForecastsLastUpdated)}
                    </span>
                  </div>

                  {categoriesToDisplay
                    .filter(
                      (category) =>
                        !selectedCategory ||
                        category.category === selectedCategory
                    )
                    .map((category, index) => (
                      <div key={index} className={styles.forecastCard}>
                        <div className={styles.categoryHeader}>
                          <h3 className={styles.categoryName}>
                            {category.category}
                          </h3>
                          <span className={styles.categoryType}>
                            {category.type === "income" ? "Дохід" : "Витрата"}
                          </span>
                        </div>
                        <div className={styles.forecastDetails}>
                          {category.monthlyPredictions &&
                            category.monthlyPredictions[0] && (
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  Прогноз на наступний місяць:
                                </span>
                                <span className={styles.detailValue}>
                                  <CurrencyDisplay
                                    amount={
                                      category.monthlyPredictions[0].amount
                                    }
                                  />
                                </span>
                              </div>
                            )}

                          <button
                            className={styles.expandButton}
                            onClick={() => toggleCategoryExpand(index)}
                          >
                            {expandedCategory === index ? (
                              <>
                                <span>Сховати детальний прогноз</span>
                                <ChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                <span>Показати детальний прогноз</span>
                                <ChevronDown size={16} />
                              </>
                            )}
                          </button>

                          {expandedCategory === index &&
                            category.monthlyPredictions && (
                              <div className={styles.monthlyPredictions}>
                                <h4 className={styles.predictionsTitle}>
                                  Прогноз по місяцях:
                                </h4>
                                <div className={styles.predictionsTable}>
                                  <div className={styles.predictionsHeader}>
                                    <div>Місяць</div>
                                    <div>Сума</div>
                                  </div>
                                  {category.monthlyPredictions.map(
                                    (prediction, idx) => (
                                      <div
                                        key={idx}
                                        className={`${styles.predictionRow} ${
                                          idx === 0 ? styles.currentMonth : ""
                                        }`}
                                      >
                                        <div>
                                          {formatMonthYear(prediction.date)}
                                        </div>
                                        <div>
                                          <CurrencyDisplay
                                            amount={prediction.amount}
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DetailedForecastModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(["goals", "categories"]),
};

export default DetailedForecastModal;
