// src/hooks/useCurrency.js

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrency } from "../redux/auth/selectors";
import {
  fetchExchangeRates,
  convertCurrency,
  formatCurrency,
} from "../utils/currencyService";

const useCurrency = () => {
  const currentCurrency = useSelector(selectCurrency);
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      try {
        const fetchedRates = await fetchExchangeRates();
        setRates(fetchedRates);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load exchange rates");
        console.error("Error loading exchange rates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, []);

  const convert = (
    amount,
    fromCurrency = "UAH",
    toCurrency = currentCurrency
  ) => {
    if (!rates) return amount; // Return original amount if rates not loaded
    return convertCurrency(amount, fromCurrency, toCurrency, rates);
  };

  const format = (amount, currency = currentCurrency) => {
    return formatCurrency(amount, currency);
  };

  const convertAndFormat = (amount, fromCurrency = "UAH") => {
    const converted = convert(amount, fromCurrency);
    return format(converted);
  };

  return {
    currentCurrency,
    convert,
    format,
    convertAndFormat,
    isLoading,
    error,
    rates,
  };
};

export default useCurrency;
