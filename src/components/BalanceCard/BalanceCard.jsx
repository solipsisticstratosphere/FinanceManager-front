import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance } from "../../redux/balance/operations";
import {
  selectBalance,
  selectBalanceInitialized,
  selectLoadingBalance,
} from "../../redux/balance/selectors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import styles from "./BalanceCard.module.css";
import { DollarSign } from "lucide-react";

const BalanceCard = () => {
  const [newBalance, setNewBalance] = useState("");
  const balance = useSelector(selectBalance);
  const isLoading = useSelector(selectLoadingBalance);
  const isBalanceInitialized = useSelector(selectBalanceInitialized);
  const dispatch = useDispatch();

  const handleBalanceUpdate = () => {
    if (!newBalance || isBalanceInitialized) return;
    dispatch(updateBalance(Number(newBalance)))
      .unwrap()
      .then(() => setNewBalance(""))
      .catch((err) => console.error("Failed to update balance:", err));
  };

  // Only show input and button if balance hasn't been initialized
  return (
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
      {!isBalanceInitialized && (
        <div>
          <input
            type="number"
            value={newBalance}
            onChange={(e) => {
              const value = e.target.value;
              setNewBalance(value === "" ? "" : Math.max(0, Number(value)));
            }}
            min="0"
            className={styles.input}
            placeholder="Новий баланс"
            disabled={isLoading}
          />
          <button
            onClick={handleBalanceUpdate}
            className={styles.button}
            disabled={isLoading || !newBalance}
          >
            {isLoading ? "Оновлення..." : "Встановити баланс"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
