import { useState } from "react";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../redux/transactions/selectors";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";
import styles from "./TransactionChart.module.css";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import { selectBudgetForecast } from "../../redux/forecasts/selectors";
import { TrendingUp } from "lucide-react";

const TransactionChart = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [showForecast, setShowForecast] = useState(false);
  const transactions = useSelector(selectTransactions);
  const forecasts = useSelector(selectBudgetForecast);
  const getDateRangeLimit = () => {
    const now = new Date();
    switch (timeRange) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "1m":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "6m":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  };

  const processTransactionsForChart = () => {
    if (!transactions?.length) return [];
    const dailyTotals = new Map();
    const dateLimit = getDateRangeLimit();
    const sortedTransactions = [...transactions]
      .filter((transaction) => new Date(transaction.date) >= dateLimit)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("uk-UA");
      if (!dailyTotals.has(date)) {
        dailyTotals.set(date, {
          date,
          expenses: 0,
          income: 0,
        });
      }
      const daily = dailyTotals.get(date);
      if (transaction.type === "expense") {
        daily.expenses += transaction.amount;
      } else {
        daily.income += transaction.amount;
      }
    });

    return Array.from(dailyTotals.values()).sort((a, b) => {
      const dateA = new Date(a.date.split(".").reverse().join("-"));
      const dateB = new Date(b.date.split(".").reverse().join("-"));
      return dateA - dateB;
    });
  };
  const processForecastData = () => {
    if (!forecasts?.length) return [];

    // Отримуємо останню дату з фактичних даних
    const lastActualDate =
      chartData.length > 0
        ? new Date(
            chartData[chartData.length - 1].date.split(".").reverse().join("-")
          )
        : new Date();

    // Фільтруємо прогнози, залишаючи тільки ті, що після останньої фактичної дати
    return forecasts
      .filter((forecast) => new Date(forecast.date) > lastActualDate)
      .map((forecast) => ({
        date: new Date(forecast.date).toLocaleDateString("uk-UA"),
        projectedExpense: forecast.projectedExpense,
        projectedIncome: forecast.projectedIncome,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split(".").reverse().join("-"));
        const dateB = new Date(b.date.split(".").reverse().join("-"));
        return dateA - dateB;
      });
  };
  const chartData = processTransactionsForChart();
  const forecastData = processForecastData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipText}>{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className={styles.tooltipEntry}
              style={{ color: entry.color }}
            >
              {entry.name}: <CurrencyDisplay amount={entry.value} />
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.number,
      })
    ),
    label: PropTypes.string,
  };

  const timeRangeButtons = [
    { value: "7d", label: "7 днів" },
    { value: "1m", label: "1 місяць" },
    { value: "6m", label: "6 місяців" },
    { value: "1y", label: "1 рік" },
  ];

  const handleToggleForecast = () => {
    if (timeRange === "6m") {
      setShowForecast(!showForecast);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.chartHeader}>
        <div className={styles.chartControls}>
          <h2 className={styles.title}>Динаміка за період</h2>
          <button
            className={`${styles.forecastToggleButton} ${
              timeRange !== "6m" ? styles.forecastToggleDisabled : ""
            }`}
            onClick={handleToggleForecast}
            disabled={timeRange !== "6m"}
            title={
              timeRange !== "6m"
                ? "Доступно тільки для періоду 6 місяців"
                : "Показати/приховати прогноз"
            }
          >
            <TrendingUp size={16} />
            <span>Прогноз</span>
            <div
              className={`${styles.toggleSwitch} ${
                showForecast ? styles.toggleActive : ""
              }`}
            >
              <div className={styles.toggleSlider}></div>
            </div>
          </button>
        </div>
        <div className={styles.timeRangeButtons}>
          {timeRangeButtons.map((button) => (
            <button
              key={button.value}
              onClick={() => setTimeRange(button.value)}
              className={`${styles.timeRangeButton} ${
                timeRange === button.value ? styles.timeRangeButtonActive : ""
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chartWrapper}>
          <LineChart
            width={1400}
            height={400}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              data={chartData}
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              name="Витрати"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              data={chartData}
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              name="Доходи"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            {showForecast && timeRange === "6m" && forecastData.length > 0 && (
              <>
                <Line
                  data={forecastData}
                  type="monotone"
                  dataKey="projectedExpense"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  name="Прогноз витрат"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  data={forecastData}
                  type="monotone"
                  dataKey="projectedIncome"
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  name="Прогноз доходів"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </>
            )}
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
