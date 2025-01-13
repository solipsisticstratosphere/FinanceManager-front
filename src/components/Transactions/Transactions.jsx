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

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoadingTransactions = useSelector(selectLoadingTransactions);
  const transactionsError = useSelector(selectTransactionsError);
  const transactions = useSelector(selectTransactions);
  const balance = useSelector(selectBalance);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <>
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
