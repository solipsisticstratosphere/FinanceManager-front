import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBalance, updateBalance } from "../../redux/balance/operations";
import {
  selectBalance,
  selectErrorBalance,
  selectLoadingBalance,
} from "../../redux/balance/selectors";
import {
  selectTotalExpenses,
  selectTransactions,
} from "../../redux/transactions/selectors";
import { fetchTransactions } from "../../redux/transactions/operations";
import styles from "./Dashboard.module.css";

import { useNavigate } from "react-router-dom";
import { selectActiveGoal } from "../../redux/goals/selectrors";
import { fetchGoals } from "../../redux/goals/operations";
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
import { DollarSign, Target, TrendingDown } from "lucide-react";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import { selectUserName } from "../../redux/auth/selectors";

const Dashboard = () => {
  const [newBalance, setNewBalance] = useState("");
  const [timeRange, setTimeRange] = useState("7d"); // Додаємо стан для періоду

  const transactions = useSelector(selectTransactions);
  const userName = useSelector(selectUserName);
  const totalExpenses = useSelector(selectTotalExpenses);
  const balance = useSelector(selectBalance);
  const isLoading = useSelector(selectLoadingBalance);
  const error = useSelector(selectErrorBalance);

  const activeGoal = useSelector(selectActiveGoal);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
    console.log("Dashboard mounted, dispatching fetch actions");
    dispatch(fetchTransactions()).then((result) => {
      console.log("Fetch transactions result:", result);
    });
    dispatch(fetchBalance());
  }, [dispatch]);

  const handleBalanceUpdate = () => {
    if (!newBalance) return;
    dispatch(updateBalance(Number(newBalance)))
      .unwrap()
      .then(() => setNewBalance(""))
      .catch((err) => console.error("Failed to update balance:", err));
  };

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

    return Array.from(dailyTotals.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  const calculateAmountToGoal = () => {
    if (!activeGoal) return 0;
    return activeGoal.targetAmount - activeGoal.currentAmount;
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Привіт, {userName}</h1>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.statsCard}>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperBlue}`}>
              <DollarSign className={`${styles.icon} ${styles.iconBlue}`} />
            </div>
            <div className={styles.statsContent}>
              <p className={styles.statsLabel}>Баланс</p>
              <p className={styles.statsValue}>
                {isLoading ? (
                  "Завантаження..."
                ) : (
                  <CurrencyDisplay amount={balance} />
                )}
              </p>
            </div>
          </div>
          <div>
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className={styles.input}
              placeholder="Новий баланс"
              disabled={isLoading}
            />
            <button
              onClick={handleBalanceUpdate}
              className={styles.button}
              disabled={isLoading || !newBalance}
            >
              {isLoading ? "Оновлення..." : "Оновити баланс"}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsCard}>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperRed}`}>
              <TrendingDown className={`${styles.icon} ${styles.iconRed}`} />
            </div>
            <div className={styles.statsContent}>
              <p className={styles.statsLabel}>Витрати</p>
              <p className={`${styles.statsValue} ${styles.valueRed}`}>
                <CurrencyDisplay amount={totalExpenses} />
              </p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsCard}>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperGreen}`}>
              <Target className={`${styles.icon} ${styles.iconGreen}`} />
            </div>
            <div className={styles.statsContent}>
              <p className={styles.statsLabel}>До цілі</p>
              <p className={`${styles.statsValue} ${styles.valueGreen}`}>
                {activeGoal ? (
                  <CurrencyDisplay amount={calculateAmountToGoal()} />
                ) : (
                  <p className={styles.statsValue}>Ціль не обрана</p>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.chartHeader}>
          <h2 className={styles.title}>Динаміка за період</h2>
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
    </div>
  );
};

export default Dashboard;
