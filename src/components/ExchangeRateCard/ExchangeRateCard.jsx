// src/components/ExchangeRateCard/ExchangeRateCard.jsx

import React, { useEffect, useState } from "react";
import { fetchExchangeRates } from "../../utils/currencyService";
import styles from "./ExchangeRateCard.module.css";

const ExchangeRateCard = () => {
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Currencies to display
  const displayCurrencies = ["USD", "EUR", "GBP"];
  const baseCurrency = "UAH";

  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      try {
        const fetchedRates = await fetchExchangeRates();
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

    // Refresh rates every 30 minutes
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
              const rate = getExchangeRate(currency);
              if (!rate) return null;

              return (
                <div key={currency} className={styles.rateItem}>
                  <span className={styles.currencyCode}>{currency}</span>
                  <span className={styles.rateValue}>{rate}</span>
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
