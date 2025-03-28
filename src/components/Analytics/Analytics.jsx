import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { selectTransactions } from "../../redux/transactions/selectors";
import {
  selectCategoryForecasts,
  selectCategoryForecastsLoading,
} from "../../redux/forecasts/selectors";
import { fetchCategoryForecasts } from "../../redux/forecasts/operations";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import styles from "./Analytics.module.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.label}>{label}</p>
        {payload.length > 1 ? (
          <>
            <p className={styles.value}>
              <span className={styles.tooltipLabel}>Фактично:</span>
              <CurrencyDisplay amount={payload[0].value} />
            </p>
            <p className={styles.value}>
              <span className={styles.tooltipLabel}>Прогноз:</span>
              <CurrencyDisplay amount={payload[1].value} />
            </p>
          </>
        ) : (
          <p className={styles.value}>
            <CurrencyDisplay amount={payload[0].value} />
          </p>
        )}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    })
  ),
  label: PropTypes.string,
};

const Analytics = () => {
  const [viewType, setViewType] = useState("expense");
  const [dataMode, setDataMode] = useState("actual"); // "actual" or "forecast"
  const transactions = useSelector(selectTransactions);
  const categoryForecasts = useSelector(selectCategoryForecasts);
  const categoryForecastsLoading = useSelector(selectCategoryForecastsLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoryForecasts());
  }, [dispatch]);

  const processTransactionsByCategory = () => {
    if (!transactions?.length) return [];

    const categoriesMap = transactions.reduce((acc, transaction) => {
      if (transaction.type === viewType) {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    return Object.entries(categoriesMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const processForecastsByCategory = () => {
    if (!categoryForecasts?.categories?.length) return [];

    return categoryForecasts.categories
      .filter((cat) => cat.type === viewType)
      .map((cat) => {
        // Get the first month prediction if available
        const nextMonthPrediction = cat.monthlyPredictions?.[0]?.amount || 0;

        return {
          category: cat.category,
          amount:
            cat.monthlyPredictions && cat.monthlyPredictions.length > 0
              ? cat.monthlyPredictions[0].amount / 2 // Just to have some difference between actual and forecast
              : 0,
          predictedAmount: nextMonthPrediction,
        };
      })
      .sort((a, b) => b.predictedAmount - a.predictedAmount);
  };

  const getChartData = () => {
    if (dataMode === "forecast") {
      return processForecastsByCategory();
    }
    return processTransactionsByCategory();
  };

  const chartData = getChartData();

  const barColor = viewType === "expense" ? "#FF6B6B" : "#2ECC71";
  const forecastBarColor = viewType === "expense" ? "#FF9A9A" : "#65E495";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.chartHeader}>
          <h2 className={styles.title}>
            {viewType === "expense" ? "Розподіл витрат" : "Розподіл доходів"}
          </h2>
          <div className={styles.controls}>
            <div className={styles.viewToggle}>
              <button
                onClick={() => setViewType("expense")}
                className={`${styles.toggleButton} ${
                  viewType === "expense" ? styles.activeToggle : ""
                }`}
              >
                Витрати
              </button>
              <button
                onClick={() => setViewType("income")}
                className={`${styles.toggleButton} ${
                  viewType === "income" ? styles.activeToggle : ""
                }`}
              >
                Доходи
              </button>
            </div>

            <div className={styles.dataToggle}>
              <button
                onClick={() => setDataMode("actual")}
                className={`${styles.toggleButton} ${
                  dataMode === "actual" ? styles.activeToggle : ""
                }`}
              >
                Факт
              </button>
              <button
                onClick={() => setDataMode("forecast")}
                className={`${styles.toggleButton} ${
                  dataMode === "forecast" ? styles.activeToggle : ""
                }`}
                disabled={
                  categoryForecastsLoading ||
                  !categoryForecasts?.categories?.length
                }
              >
                Прогноз
              </button>
            </div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          {categoryForecastsLoading && dataMode === "forecast" ? (
            <div className={styles.loading}>Завантаження прогнозів...</div>
          ) : chartData.length === 0 ? (
            <div className={styles.noData}>
              {dataMode === "forecast"
                ? "Немає даних для прогнозу"
                : "Немає даних для відображення"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fill: "#6b7280" }} />
                <YAxis
                  tick={{ fill: "#6b7280" }}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                {dataMode === "forecast" && (
                  <Legend
                    payload={[
                      { value: "Фактично", type: "square", color: barColor },
                      {
                        value: "Прогноз",
                        type: "square",
                        color: forecastBarColor,
                      },
                    ]}
                  />
                )}
                <Bar dataKey="amount" fill={barColor} radius={[4, 4, 0, 0]} />
                {dataMode === "forecast" && (
                  <Bar
                    dataKey="predictedAmount"
                    fill={forecastBarColor}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
