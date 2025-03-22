import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBalance } from "../../redux/balance/operations";
import { fetchTransactions } from "../../redux/transactions/operations";
import { fetchGoals } from "../../redux/goals/operations";
import {
  calculateBudgetForecast,
  calculateGoalForecast,
} from "../../redux/forecasts/operations";
import styles from "./Dashboard.module.css";
import { selectUserName } from "../../redux/auth/selectors";
import BalanceCard from "../BalanceCard/BalanceCard";
import ExpensesCard from "../ExpensesCard/ExpensesCard";
import GoalCard from "../GoalCard/GoalCard";
import ForecastSection from "../ForecastSection/ForecastSection";
import TransactionChart from "../TransactionChart/TransactionChart";
import ExchangeRateCard from "../ExchangeRateCard/ExchangeRateCard";
const Dashboard = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchTransactions());
    dispatch(fetchBalance());
    dispatch(calculateBudgetForecast());
    dispatch(calculateGoalForecast());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {userName ? (
            `Привіт, ${userName}`
          ) : (
            <Link to="/settings" className={styles.setupNameLink}>
              Встановіть ім'я в налаштуваннях
            </Link>
          )}
        </h1>
      </div>
      <div className={styles.grid}>
        <BalanceCard />
        <ExpensesCard />
        <GoalCard />
        <ExchangeRateCard />
      </div>
      <ForecastSection />
      <TransactionChart />
    </div>
  );
};

export default Dashboard;
