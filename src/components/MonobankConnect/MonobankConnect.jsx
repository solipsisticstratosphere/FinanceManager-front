import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  connectMonobank,
  disconnectMonobank,
  getMonobankStatus,
  syncMonobankTransactions,
} from "../../redux/monobank/operations";
import {
  selectMonobankConnected,
  selectMonobankAccounts,
  selectMonobankLastSync,
  selectMonobankIsLoading,
  selectMonobankIsSyncing,
  selectMonobankError,
} from "../../redux/monobank/selectors";
import { resetMonobankError } from "../../redux/monobank/slice";
import { Banknote, RefreshCw, X, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./MonobankConnect.module.css";

const MonobankConnect = () => {
  const [monoToken, setMonoToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dispatch = useDispatch();
  const isConnected = useSelector(selectMonobankConnected);
  const accounts = useSelector(selectMonobankAccounts);
  const lastSync = useSelector(selectMonobankLastSync);
  const isLoading = useSelector(selectMonobankIsLoading);
  const isSyncing = useSelector(selectMonobankIsSyncing);
  const error = useSelector(selectMonobankError);

  useEffect(() => {
    dispatch(getMonobankStatus());
  }, [dispatch]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Сталася помилка при підключенні Монобанку";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
    }
  }, [error]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleConnect = async () => {
    if (!monoToken.trim()) {
      toast.error("Будь ласка, введіть токен Монобанка");
      return;
    }

    await dispatch(connectMonobank(monoToken));
    setMonoToken("");
    setShowTokenInput(false);
  };

  const handleDisconnect = async () => {
    if (window.confirm("Ви впевнені, що хочете відключити Монобанк?")) {
      await dispatch(disconnectMonobank());
    }
  };

  const handleSync = () => {
    dispatch(syncMonobankTransactions());
  };

  const handleTokenChange = (e) => {
    if (error) {
      dispatch(resetMonobankError());
    }
    setMonoToken(e.target.value);
  };

  const formatLastSync = (dateString) => {
    if (!dateString) return "Никогда";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className={styles.monobankCard}>
      <div className={styles.monobankHeader} onClick={toggleCollapse}>
        <h2 className={styles.monobankTitle}>
          <Banknote className={styles.bankIcon} />
          Монобанк
        </h2>
        <button className={styles.collapseButton}>
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className={styles.monobankContent}>
          {isConnected ? (
            <>
              <div className={styles.statusConnected}>
                ✓ Підключено до Монобанку
              </div>

              {accounts.length > 0 && (
                <div className={styles.accountsList}>
                  <h3>Рахунки:</h3>
                  <ul>
                    {accounts.map((account) => (
                      <li key={account.id} className={styles.accountItem}>
                        {account.name}: {account.balance.toFixed(2)} грн
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.syncInfo}>
                <p>Остання синхронізація: {formatLastSync(lastSync)}</p>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={styles.syncButton}
                >
                  <RefreshCw
                    className={`${styles.syncIcon} ${
                      isSyncing ? styles.rotating : ""
                    }`}
                  />
                  {isSyncing ? "Синхронізація..." : "Синхронізувати"}
                </button>
              </div>

              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className={styles.disconnectButton}
              >
                <X className={styles.disconnectIcon} />
                Відключити Монобанк
              </button>
            </>
          ) : (
            <>
              {showTokenInput ? (
                <div className={styles.connectForm}>
                  <p className={styles.tokenHelper}>
                    Токен можна отримати в додатку Монобанка:
                    <br />
                    <strong>
                      Налаштування → Інше → Розробникам → Отримати токен
                    </strong>
                  </p>

                  <input
                    type="text"
                    value={monoToken}
                    onChange={handleTokenChange}
                    placeholder="Введіть токен Монобанка"
                    className={styles.tokenInput}
                  />

                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => {
                        setShowTokenInput(false);
                        setMonoToken("");
                        if (error) dispatch(resetMonobankError());
                      }}
                      className={styles.cancelButton}
                    >
                      Скасування
                    </button>
                    <button
                      onClick={handleConnect}
                      disabled={isLoading || !monoToken.trim()}
                      className={styles.connectButton}
                    >
                      {isLoading ? "Підключення..." : "Підключити"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowTokenInput(true)}
                  className={styles.connectButton}
                >
                  <Banknote className={styles.connectIcon} />
                  Підключити Монобанк
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MonobankConnect;
