import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  className = "",
  color,
}) => {
  const buttonClasses = [
    styles.button,
    styles[size],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Создаем объект со стилями на основе переданного цвета
  const buttonStyle = color
    ? {
        "--button-bg": color,
        "--button-hover-bg": adjustColor(color, -10), // Немного темнее для ховера
        "--button-text": getContrastColor(color),
        "--button-border": color,
      }
    : {};

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

// Вспомогательная функция для определения контрастного цвета текста
const getContrastColor = (hexColor) => {
  // Удаляем # если есть
  const hex = hexColor.replace("#", "");

  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Вычисляем яркость
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Возвращаем белый или черный в зависимости от яркости фона
  return brightness > 128 ? "#000000" : "#ffffff";
};

// Вспомогательная функция для изменения яркости цвета
const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export default Button;
