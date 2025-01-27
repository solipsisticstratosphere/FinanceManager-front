import { useSelector } from "react-redux";
import { selectActiveGoal } from "../../redux/goals/selectrors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import styles from "./GoalCard.module.css";
import { Target } from "lucide-react";

const GoalCard = () => {
  const activeGoal = useSelector(selectActiveGoal);

  const calculateAmountToGoal = () => {
    if (!activeGoal) return 0;
    return activeGoal.targetAmount - activeGoal.currentAmount;
  };

  return (
    <div className={styles.card}>
      <div className={styles.statsCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperGreen}`}>
          <Target className={`${styles.icon} ${styles.iconGreen}`} />
        </div>
        <div className={styles.statsContent}>
          <p className={styles.statsLabel}>До цілі</p>
          <div className={`${styles.statsValue} ${styles.valueGreen}`}>
            {activeGoal ? (
              <CurrencyDisplay amount={calculateAmountToGoal()} />
            ) : (
              "Ціль не обрана"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
