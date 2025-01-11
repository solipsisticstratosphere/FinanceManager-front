import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionModal from "../TransactionModal/TransactionModal";
import { fetchBalance, updateBalance } from "../../redux/balance/operations";
import {
  selectBalance,
  selectErrorBalance,
  selectLoadingBalance,
} from "../../redux/balance/selectors";
import {
  selectLoadingTransactions,
  selectTotalExpenses,
  selectTransactions,
  selectTransactionsError,
} from "../../redux/transactions/selectors";
import { fetchTransactions } from "../../redux/transactions/operations";
import styles from "./Dashboard.module.css";
import { logout } from "../../redux/auth/operations";
import Button from "../Buttons/Button/Button";
import { useNavigate } from "react-router-dom";
import {
  selectActiveGoal,
  selectGoals,
  selectGoalsError,
  selectGoalsLoading,
} from "../../redux/goals/selectrors";
import {
  createGoal,
  deactivateGoal,
  deleteGoal,
  fetchGoals,
  setActiveGoal,
} from "../../redux/goals/operations";
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

const Dashboard = () => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  const isLoadingTransactions = useSelector(selectLoadingTransactions);
  const transactionsError = useSelector(selectTransactionsError);
  const transactions = useSelector(selectTransactions);

  const totalExpenses = useSelector(selectTotalExpenses);
  const balance = useSelector(selectBalance);
  const isLoading = useSelector(selectLoadingBalance);
  const error = useSelector(selectErrorBalance);

  const goals = useSelector(selectGoals);
  const activeGoal = useSelector(selectActiveGoal);
  const isLoadingGoals = useSelector(selectGoalsLoading);
  const goalsError = useSelector(selectGoalsError);

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
  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        console.log("Успешный выход из системы");

        navigate("/signin");
      })
      .catch((err) => {
        console.error("Ошибка при выходе из системы:", err);
      });
  };
  const handleBalanceUpdate = () => {
    if (!newBalance) return;
    dispatch(updateBalance(Number(newBalance)))
      .unwrap()
      .then(() => setNewBalance(""))
      .catch((err) => console.error("Failed to update balance:", err));
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) return;

    dispatch(createGoal(newGoal))
      .unwrap()
      .then(() => {
        setIsGoalModalOpen(false);
        setNewGoal({ title: "", targetAmount: "", deadline: "" });
      })
      .catch((err) => console.error("Failed to create goal:", err));
  };

  const handleGoalAction = (goalId, action) => {
    switch (action) {
      case "activate":
        dispatch(setActiveGoal(goalId));
        break;
      case "deactivate":
        dispatch(deactivateGoal(goalId));
        break;
      case "delete":
        dispatch(deleteGoal(goalId));
        break;
      default:
        break;
    }
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
              {entry.name}: {entry.value.toLocaleString()} ₽
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <Button variant="primary" size="large" onClick={handleLogout}>
        Выход
      </Button>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.statsCard}>
            <div className={`${styles.iconWrapper} ${styles.iconWrapperBlue}`}>
              <DollarSign className={`${styles.icon} ${styles.iconBlue}`} />
            </div>
            <div className={styles.statsContent}>
              <p className={styles.statsLabel}>Баланс</p>
              <p className={styles.statsValue}>
                {isLoading ? "Загрузка..." : `${balance} ₽`}
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
                {totalExpenses} ₽
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
                {calculateAmountToGoal().toLocaleString()} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.transactionsCard}>
        <div className={styles.transactionsHeader}>
          <h2 className={styles.transactionsTitle}>Транзакции</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
          >
            Добавить
          </button>
        </div>
        <div className={styles.transactionsList}>
          {isLoadingTransactions ? (
            <p>Загрузка транзакций</p>
          ) : transactionsError ? (
            <p>Ошибка: {transactionsError}</p>
          ) : transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className={`
                ${styles.transactionItem} 
                ${
                  transaction.type === "expense"
                    ? styles.expense
                    : styles.income
                }
              `}
              >
                <div className={styles.transactionContent}>
                  <h3 className={styles.transactionCategory}>
                    {transaction.category}
                  </h3>
                  <p className={styles.transactionDescription}>
                    {transaction.description}
                  </p>
                </div>
                <div className={styles.transactionDetails}>
                  <p
                    className={`
                    ${styles.transactionAmount} 
                    ${
                      transaction.type === "expense"
                        ? styles.amountRed
                        : styles.amountGreen
                    }
                  `}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {transaction.amount} ₽
                  </p>
                  <p className={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Транзакции не найдены</p>
          )}
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
              tickFormatter={(value) => `${value.toLocaleString()} ₽`}
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
      <div className={styles.goalsCard}>
        <div className={styles.goalsHeader}>
          <h2 className={styles.goalsTitle}>Мои цели</h2>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className={styles.addButton}
          >
            Добавить цель
          </button>
        </div>

        <div className={styles.goalsList}>
          {isLoadingGoals ? (
            <p>Загрузка целей...</p>
          ) : goalsError ? (
            <p>Ошибка: {goalsError}</p>
          ) : goals && goals.length > 0 ? (
            goals.map((goal) => (
              <div
                key={goal._id}
                className={`${styles.goalItem} ${
                  goal.isActive ? styles.activeGoal : ""
                }`}
              >
                <div className={styles.goalContent}>
                  <h3 className={styles.goalTitle}>{goal.title}</h3>
                  <div className={styles.goalProgress}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${
                          (goal.currentAmount / goal.targetAmount) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className={styles.goalAmount}>
                    {goal.currentAmount} ₽ / {goal.targetAmount} ₽
                  </p>
                  <p className={styles.goalDeadline}>
                    До: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.goalActions}>
                  {!goal.isActive ? (
                    <button
                      onClick={() => handleGoalAction(goal._id, "activate")}
                      className={styles.activateButton}
                    >
                      Активировать
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGoalAction(goal._id, "deactivate")}
                      className={styles.deactivateButton}
                    >
                      Деактивировать
                    </button>
                  )}
                  <button
                    onClick={() => handleGoalAction(goal._id, "delete")}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Цели не найдены</p>
          )}
        </div>
      </div>
      {isGoalModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Новая цель</h2>
            <input
              type="text"
              placeholder="Название цели"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Сумма цели"
              value={newGoal.targetAmount}
              onChange={(e) =>
                setNewGoal({ ...newGoal, targetAmount: e.target.value })
              }
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) =>
                setNewGoal({ ...newGoal, deadline: e.target.value })
              }
            />
            <div className={styles.modalActions}>
              <button onClick={handleCreateGoal}>Создать</button>
              <button onClick={() => setIsGoalModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <TransactionModal
          onClose={() => setIsModalOpen(false)}
          currentBalance={balance}
        />
      )}
    </div>
  );
};

export default Dashboard;
