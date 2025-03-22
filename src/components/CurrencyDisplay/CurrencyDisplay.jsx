// src/components/CurrencyDisplay/CurrencyDisplay.jsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrency } from "../../redux/auth/selectors";
import {
  fetchExchangeRates,
  convertCurrency,
  formatCurrency,
} from "../../utils/currencyService";

const CurrencyDisplay = ({ amount, originalCurrency = "UAH" }) => {
  const targetCurrency = useSelector(selectCurrency);
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch exchange rates when component mounts
    const loadRates = async () => {
      setIsLoading(true);
      try {
        const fetchedRates = await fetchExchangeRates();
        setRates(fetchedRates);
      } catch (error) {
        console.error("Failed to load exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, []);

  useEffect(() => {
    // Convert amount when currency or amount changes
    if (rates) {
      const converted = convertCurrency(
        amount,
        originalCurrency,
        targetCurrency,
        rates
      );
      setConvertedAmount(converted);
    }
  }, [amount, originalCurrency, targetCurrency, rates]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return <span>{formatCurrency(convertedAmount, targetCurrency)}</span>;
};

export default CurrencyDisplay;
