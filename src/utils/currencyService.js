// src/services/currencyService.js

// Fallback exchange rates (используются если API недоступно)
const fallbackRates = {
  UAH: 1,
  USD: 0.025, // 1 UAH = 0.025 USD
  EUR: 0.023, // 1 UAH = 0.023 EUR
};

/**
 * Fetches current exchange rates from free API
 * @returns {Promise<Object>} Exchange rates with UAH as base currency
 */
export const fetchExchangeRates = async () => {
  try {
    // Получаем сохраненные курсы и время последнего обновления
    const savedRates = localStorage.getItem("exchangeRates");
    const lastUpdate = localStorage.getItem("ratesLastUpdate");

    // Проверяем, прошло ли больше 1 часа с последнего обновления
    const ONE_HOUR = 60 * 60 * 1000;
    const shouldUpdate =
      !lastUpdate || Date.now() - parseInt(lastUpdate) > ONE_HOUR;

    // Если есть сохраненные курсы и прошло меньше часа, используем их
    if (savedRates && !shouldUpdate) {
      return JSON.parse(savedRates);
    }

    // Вариант 1: Exchange Rate API - бесплатно до 1500 запросов в месяц
    const response = await fetch("https://open.er-api.com/v6/latest/UAH");
    const data = await response.json();

    if (data.rates) {
      const rates = {
        UAH: 1,
        USD: data.rates.USD,
        EUR: data.rates.EUR,
      };

      // Сохраняем курсы и время обновления
      localStorage.setItem("exchangeRates", JSON.stringify(rates));
      localStorage.setItem("ratesLastUpdate", Date.now().toString());

      return rates;
    }

    // Если не удалось получить данные, пробуем альтернативное API
    throw new Error("Failed to fetch from first API source");
  } catch (error) {
    try {
      // Вариант 2: FreeCurrencyAPI - бесплатно до 300 запросов в месяц
      const response = await fetch(
        "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_olU9S7rwPkEvpqVAF52eXfpXH96TJGDGMk3rQ76U&base_currency=UAH&currencies=USD,EUR"
      );
      const data = await response.json();

      if (data.data) {
        const rates = {
          UAH: 1,
          USD: data.data.USD,
          EUR: data.data.EUR,
        };

        localStorage.setItem("exchangeRates", JSON.stringify(rates));
        localStorage.setItem("ratesLastUpdate", Date.now().toString());

        return rates;
      }
      throw new Error("Failed to fetch from second API source");
    } catch (secondError) {
      console.warn(
        "Error fetching exchange rates, using fallback rates:",
        secondError
      );

      // Проверяем наличие сохраненных ранее курсов
      if (savedRates) {
        return JSON.parse(savedRates);
      }

      // Используем стандартные курсы если ничего не доступно
      return fallbackRates;
    }
  }
};

/**
 * Converts an amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} rates - Exchange rates object
 * @returns {number} Converted amount
 */
export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
  rates = fallbackRates
) => {
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to UAH first (as it's our base currency)
  const amountInUAH =
    fromCurrency === "UAH" ? amount : amount / rates[fromCurrency];

  // Then convert from UAH to target currency
  return toCurrency === "UAH" ? amountInUAH : amountInUAH * rates[toCurrency];
};

/**
 * Format amount according to currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted amount with currency symbol
 */
export const formatCurrency = (amount, currency) => {
  const formattedNumber = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  switch (currency) {
    case "USD":
      return `$${formattedNumber}`;
    case "EUR":
      return `€${formattedNumber}`;
    case "UAH":
      return `${formattedNumber} ₴`;
    default:
      return `${formattedNumber} ${currency}`;
  }
};
