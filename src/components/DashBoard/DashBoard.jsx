import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
// import { fetchDashboardData, updateBalance } from "../redux/actions/dashboard";
import styles from "./Dashboard.module.css";
import { fetchBalance, updateBalance } from "../../redux/balance/operations";
import {
  selectBalance,
  selectErrorBalance,
  selectLoadingBalance,
} from "../../redux/balance/selectors";

const Dashboard = () => {
  const [newBalance, setNewBalance] = useState("");
  const balance = useSelector(selectBalance);
  const isLoading = useSelector(selectLoadingBalance);
  const error = useSelector(selectErrorBalance);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const handleBalanceUpdate = () => {
    if (!newBalance) return;
    dispatch(updateBalance(Number(newBalance)))
      .unwrap()
      .then(() => setNewBalance(""))
      .catch((error) => {
        // Обработка ошибки, например показ уведомления
        console.error("Failed to update balance:", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.grid} ${styles.gridMd3}`}>
        <div className={styles.card}>
          <h2 className={styles.title}>Баланс</h2>
          <p className={styles.value}>
            {isLoading ? "Загрузка..." : `${balance} ₽`}
          </p>
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

        {/* <div className={styles.card}>
          <h2 className={styles.title}>Расходы</h2>
          <p className={`${styles.value} ${styles.valueRed}`}>-{expenses} ₽</p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.title}>До цели</h2>
          <p className={`${styles.value} ${styles.valueGreen}`}>
            {targetProgress} ₽
          </p>
        </div> */}
      </div>

      {/* <div className={`${styles.card} ${styles.chart}`}>
        <h2 className={styles.title}>Динамика расходов</h2>
        <LineChart width={800} height={300} data={spendingGraph}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </div> */}
    </div>
  );
};

export default Dashboard;
