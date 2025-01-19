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

  const processTransactionsForChart = () => {
    if (!transactions?.length) return [];

    const dailyTotals = new Map();

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("ru-RU");

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

    // Convert map to array and sort by date
    return Array.from(dailyTotals.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Get last 7 days
  };

  const calculateAmountToGoal = () => {
    if (!activeGoal) return 0;
    return activeGoal.targetAmount - activeGoal.currentAmount;
  };

  const chartData = processTransactionsForChart();

  // Custom tooltip formatter for the chart
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Привіт, {userName}</h1>
      </div>
      {/* создать развилку если нет имени то с ссылкой на настройки где можно установить */}
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
                  "Загрузка..."
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
              placeholder="Новый баланс"
              disabled={isLoading}
            />
            <button
              onClick={handleBalanceUpdate}
              className={styles.button}
              disabled={isLoading || !newBalance}
            >
              {isLoading ? "Обновление..." : "Обновить баланс"}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statsCard}>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperRed}`}>
              <TrendingDown className={`${styles.icon} ${styles.iconRed}`} />
            </div>
            <div className={styles.statsContent}>
              <p className={styles.statsLabel}>Расходы</p>
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
              <p className={styles.statsLabel}>До цели</p>
              <p className={`${styles.statsValue} ${styles.valueGreen}`}>
                <CurrencyDisplay
                  amount={calculateAmountToGoal().toLocaleString()}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h2 className={styles.title}>Динамика за последние 7 дней</h2>
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
              name="Расходы"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              name="Доходы"
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
