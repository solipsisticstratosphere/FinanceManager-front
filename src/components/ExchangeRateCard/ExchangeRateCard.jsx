import { useEffect, useState } from "react";
import { fetchExchangeRates } from "../../utils/currencyService";
import styles from "./ExchangeRateCard.module.css";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const ExchangeRateCard = () => {
  const [rates, setRates] = useState(null);
  const [prevRates, setPrevRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const displayCurrencies = [
    { code: "USD", flag: "🇺🇸" },
    { code: "EUR", flag: "🇪🇺" },
    { code: "GBP", flag: "🇬🇧" },
  ];

  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      try {
        const fetchedRates = await fetchExchangeRates();

        if (rates) {
          setPrevRates(rates);
        } else {
          setPrevRates(fetchedRates);
        }

        setRates(fetchedRates);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError("Не вдалося завантажити курси валют");
        console.error("Помилка завантаження курсів валют:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();

    const intervalId = setInterval(loadRates, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getExchangeRate = (currency) => {
    if (!rates || !rates[currency]) return null;

    const ratePerUAH = rates[currency];
    if (ratePerUAH <= 0 || isNaN(ratePerUAH)) return null;

    const uahPerUnit = 1 / ratePerUAH;
    return uahPerUnit.toFixed(2);
  };

  const getRateChange = (currency) => {
    if (!rates || !prevRates || !rates[currency] || !prevRates[currency])
      return null;

    const currentRate = 1 / rates[currency];
    const previousRate = 1 / prevRates[currency];
    const change = currentRate - previousRate;

    return {
      value: Math.abs(change).toFixed(2),
      isPositive: change > 0,
      isNeutral: Math.abs(change) < 0.01,
    };
  };

  const formatLastUpdated = (date) => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Курс валют</h3>
        {!isLoading && lastUpdated && (
          <span className={styles.updateInfo}>
            {formatLastUpdated(lastUpdated)}
          </span>
        )}
      </div>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loading}></div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {!isLoading && !error && rates && (
        <div className={styles.ratesContainer}>
          {displayCurrencies
            .map((currency) => {
              const rate = getExchangeRate(currency.code);
              const change = getRateChange(currency.code);
              if (!rate) return null;

              return (
                <div key={currency.code} className={styles.rateItem}>
                  <span className={styles.currencyCode}>
                    <span className={styles.currencyFlag}>{currency.flag}</span>
                    {currency.code}
                  </span>
                  <div className={styles.rateInfo}>
                    <span className={styles.rateValue}>{rate}</span>
                    {change && !change.isNeutral && (
                      <span
                        className={`${styles.rateChange} ${
                          change.isPositive ? styles.positive : styles.negative
                        }`}
                      >
                        {change.isPositive ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        {change.value} ₴
                      </span>
                    )}
                  </div>
                </div>
              );
            })
            .filter(Boolean)}
        </div>
      )}
    </div>
  );
};

export default ExchangeRateCard;
