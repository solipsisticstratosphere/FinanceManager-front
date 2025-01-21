import { useDispatch, useSelector } from "react-redux";
import {
  selectLoadingTransactions,
  selectTransactions,
  selectTransactionsError,
} from "../../redux/transactions/selectors";
import { useEffect, useState } from "react";
import { fetchTransactions } from "../../redux/transactions/operations";
import TransactionModal from "../TransactionModal/TransactionModal";
import { selectBalance } from "../../redux/balance/selectors";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import styles from "./Transactions.module.css";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import { fetchBalance } from "../../redux/balance/operations";

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoadingTransactions = useSelector(selectLoadingTransactions);
  const transactionsError = useSelector(selectTransactionsError);
  const transactions = useSelector(selectTransactions);
  const balance = useSelector(selectBalance);

  const dispatch = useDispatch();

  useEffect(() => {
    // Загружаем и транзакции, и баланс при монтировании компонента
    const initializeData = async () => {
      try {
        await Promise.all([
          dispatch(fetchTransactions()),
          dispatch(fetchBalance()),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [dispatch]);

  // Добавим проверку на готовность баланса
  const handleOpenModal = () => {
    if (balance !== undefined) {
      setIsModalOpen(true);
    } else {
      // Если баланс еще не загружен, сначала загрузим его
      dispatch(fetchBalance()).then(() => {
        setIsModalOpen(true);
      });
    }
  };
  return (
    <>
      <div className={styles.transactionsCard}>
        <div className={styles.transactionsHeader}>
          <h2 className={styles.transactionsTitle}>Транзакції</h2>
          <button onClick={handleOpenModal} className={styles.addButton}>
            Додати
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
                  <div className={styles.iconWrapper}>
                    {transaction.type === "expense" ? (
                      <ArrowDownRight className={styles.expenseIcon} />
                    ) : (
                      <ArrowUpRight className={styles.incomeIcon} />
                    )}
                  </div>
                  <div>
                    <h3 className={styles.transactionCategory}>
                      {transaction.category}
                    </h3>
                    <p className={styles.transactionDescription}>
                      {transaction.description}
                    </p>
                  </div>
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
                    <CurrencyDisplay amount={transaction.amount} />
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
        {isModalOpen && (
          <TransactionModal
            onClose={() => setIsModalOpen(false)}
            currentBalance={balance}
          />
        )}
      </div>
    </>
  );
};

export default Transactions;
