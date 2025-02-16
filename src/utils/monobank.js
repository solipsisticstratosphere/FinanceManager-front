// utils/monobank.js

/**
 * Форматирует дату последней синхронизации в читаемый вид
 */
export const formatLastSync = (dateString) => {
  if (!dateString) return "Никогда";
  const date = new Date(dateString);

  // Проверка на валидность даты
  if (isNaN(date.getTime())) return "Некорректная дата";

  // Если синхронизация была сегодня, показываем только время
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Сегодня, ${date.toLocaleTimeString()}`;
  }

  // Если синхронизация была вчера
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Вчера, ${date.toLocaleTimeString()}`;
  }

  // В остальных случаях показываем полную дату
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

/**
 * Проверяет, истек ли срок действия токена Монобанка
 * (токены действительны 1 год с момента создания)
 */
export const isTokenExpired = (lastSync) => {
  if (!lastSync) return false;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const syncDate = new Date(lastSync);
  return syncDate < oneYearAgo;
};

/**
 * Определяет источник транзакции (ручной ввод или Монобанк)
 */
export const getTransactionSourceLabel = (source) => {
  return source === "monobank" ? "Монобанк" : "Вручную";
};

/**
 * Генерирует уникальный идентификатор для оптимистично добавленной транзакции
 */
export const generateTempTransactionId = () => {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};
