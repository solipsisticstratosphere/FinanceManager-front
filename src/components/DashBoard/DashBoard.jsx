import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBalance } from "../../redux/balance/operations";
import { fetchTransactions } from "../../redux/transactions/operations";
import { fetchGoals } from "../../redux/goals/operations";
import {
  calculateBudgetForecast,
  calculateGoalForecast,
  fetchGoalForecasts,
  fetchCategoryForecasts,
} from "../../redux/forecasts/operations";
import styles from "./Dashboard.module.css";
import { selectUserName } from "../../redux/auth/selectors";
import BalanceCard from "../BalanceCard/BalanceCard";
import ExpensesCard from "../ExpensesCard/ExpensesCard";
import GoalCard from "../GoalCard/GoalCard";
import ForecastSection from "../ForecastSection/ForecastSection";
import TransactionChart from "../TransactionChart/TransactionChart";
import ExchangeRateCard from "../ExchangeRateCard/ExchangeRateCard";
import DetailedForecastModal from "../DetailedForecastModal/DetailedForecastModal";
import { BarChart3, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);
  const [forecastModalTab, setForecastModalTab] = useState("goals");

  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchTransactions());
    dispatch(fetchBalance());
    dispatch(calculateBudgetForecast());
    dispatch(calculateGoalForecast());
    dispatch(fetchGoalForecasts());
    dispatch(fetchCategoryForecasts());
  }, [dispatch]);

  const handleOpenForecastModal = (tab = "goals") => {
    setForecastModalTab(tab);
    setIsForecastModalOpen(true);
  };

  const handleCloseForecastModal = () => {
    setIsForecastModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {userName ? (
            `Привіт, ${userName}`
          ) : (
            <Link to="/settings" className={styles.setupNameLink}>
              Встановіть ім&apos;я в налаштуваннях
            </Link>
          )}
        </h1>
        <button
          className={styles.forecastButton}
          onClick={() => handleOpenForecastModal("categories")}
        >
          <BarChart3 size={18} />
          Детальні прогнози
        </button>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <LayoutDashboard
            size={18}
            style={{ marginRight: "8px", verticalAlign: "text-bottom" }}
          />
          Основні показники
        </h2>
      </div>
      <div className={styles.grid}>
        <BalanceCard />
        <ExpensesCard />
        <GoalCard />
        <ExchangeRateCard />
      </div>

      <ForecastSection />
      <TransactionChart />

      <DetailedForecastModal
        isOpen={isForecastModalOpen}
        onClose={handleCloseForecastModal}
        initialTab={forecastModalTab}
      />
    </div>
  );
};

export default Dashboard;
