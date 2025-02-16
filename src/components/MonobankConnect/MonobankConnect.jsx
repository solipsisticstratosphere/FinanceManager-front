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
          : error.message || "Произошла ошибка при подключении Монобанка";
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
      toast.error("Пожалуйста, введите токен Монобанка");
      return;
    }

    await dispatch(connectMonobank(monoToken));
    setMonoToken("");
    setShowTokenInput(false);
  };

  const handleDisconnect = async () => {
    if (window.confirm("Вы уверены, что хотите отключить Монобанк?")) {
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
                ✓ Подключено к Монобанку
              </div>

              {accounts.length > 0 && (
                <div className={styles.accountsList}>
                  <h3>Счета:</h3>
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
                <p>Последняя синхронизация: {formatLastSync(lastSync)}</p>
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
                  {isSyncing ? "Синхронизация..." : "Синхронизировать"}
                </button>
              </div>

              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className={styles.disconnectButton}
              >
                <X className={styles.disconnectIcon} />
                Отключить Монобанк
              </button>
            </>
          ) : (
            <>
              {showTokenInput ? (
                <div className={styles.connectForm}>
                  <p className={styles.tokenHelper}>
                    Токен можно получить в приложении Монобанка:
                    <br />
                    <strong>
                      Настройки → Другое → Разработчикам → Получить токен
                    </strong>
                  </p>

                  <input
                    type="text"
                    value={monoToken}
                    onChange={handleTokenChange}
                    placeholder="Введите токен Монобанка"
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
                      Отмена
                    </button>
                    <button
                      onClick={handleConnect}
                      disabled={isLoading || !monoToken.trim()}
                      className={styles.connectButton}
                    >
                      {isLoading ? "Подключение..." : "Подключить"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowTokenInput(true)}
                  className={styles.connectButton}
                >
                  <Banknote className={styles.connectIcon} />
                  Подключить Монобанк
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
