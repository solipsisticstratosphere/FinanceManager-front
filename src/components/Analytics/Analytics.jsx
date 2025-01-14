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

const Analytics = () => {
  const transactions = useSelector(selectTransactions);

  const processExpensesByCategory = () => {
    if (!transactions?.length) return [];

    const expensesByCategory = transactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  const chartData = processExpensesByCategory();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.label}>{label}</p>
          <p className={styles.value}>{payload[0].value.toLocaleString()} ₽</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Распределение расходов</h2>
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
              <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
