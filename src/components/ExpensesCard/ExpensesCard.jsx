import { useSelector } from "react-redux";
import { selectTotalExpenses } from "../../redux/transactions/selectors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import styles from "./ExpensesCard.module.css";
import { TrendingDown } from "lucide-react";

const ExpensesCard = () => {
  const totalExpenses = useSelector(selectTotalExpenses);

  return (
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
  );
};

export default ExpensesCard;
