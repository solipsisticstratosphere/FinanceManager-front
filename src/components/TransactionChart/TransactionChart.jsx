import { useState } from "react";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../redux/transactions/selectors";
import {
  CartesianAxis,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./TransactionChart.module.css";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";

const TransactionChart = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [showForecast, setShowForecast] = useState(false);
  const transactions = useSelector(selectTransactions);

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

  const chartData = processTransactionsForChart();

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

  const timeRangeButtons = [
    { value: "7d", label: "7 днів" },
    { value: "1m", label: "1 місяць" },
    { value: "6m", label: "6 місяців" },
    { value: "1y", label: "1 рік" },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.chartHeader}>
        <div className={styles.chartControls}>
          <h2 className={styles.title}>Динаміка за період</h2>
          <label
            className={`${styles.forecastToggle} ${
              timeRange !== "6m" ? styles.forecastToggleDisabled : ""
            }`}
          >
            <input
              type="checkbox"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
              disabled={timeRange !== "6m"}
            />
            Показати прогноз
          </label>
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
        <LineChart
          width={800}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            name="Витрати"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            name="Доходи"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default TransactionChart;
