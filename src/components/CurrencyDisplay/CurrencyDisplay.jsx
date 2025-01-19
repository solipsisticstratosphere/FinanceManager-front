import { useSelector } from "react-redux";
import { selectCurrency } from "../../redux/auth/selectors";

const CurrencyDisplay = ({ amount }) => {
  const currency = useSelector(selectCurrency);

  const formatAmount = (value) => {
    const formattedNumber = value.toLocaleString();

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

  return <span>{formatAmount(amount)}</span>;
};

export default CurrencyDisplay;
