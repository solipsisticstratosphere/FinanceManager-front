import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { selectTransactions } from "../../redux/transactions/selectors";
import styles from "./Analytics.module.css";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";

const Analytics = () => {
  const [viewType, setViewType] = useState("expense");
  const transactions = useSelector(selectTransactions);

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

  const chartData = processTransactionsByCategory();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.label}>{label}</p>
          <p className={styles.value}>
            <CurrencyDisplay amount={payload[0].value} />
          </p>
        </div>
      );
    }
    return null;
  };

  const barColor = viewType === "expense" ? "#FF6B6B" : "#2ECC71";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.chartHeader}>
          <h2 className={styles.title}>
            {viewType === "expenses" ? "Розподіл витрат" : "Розподіл доходів"}
          </h2>
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
        </div>
        <div className={styles.chartContainer}>
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
              <Bar dataKey="amount" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
