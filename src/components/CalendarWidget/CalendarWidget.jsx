import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./CalendarWidget.module.css";
import { selectTransactions } from "../../redux/transactions/selectors";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";

const CalendarWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const transactions = useSelector(selectTransactions);

  // Memoize transaction processing
  const calendarData = useMemo(() => {
    const data = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toISOString().split("T")[0];
      if (!data[date]) {
        data[date] = { income: 0, expenses: 0 };
      }

      if (transaction.type === "income") {
        data[date].income += Number(transaction.amount);
      } else {
        data[date].expenses += Number(transaction.amount);
      }
    });
    return data;
  }, [transactions]);

  // Memoize highlight effect setup
  useEffect(() => {
    const highlightInterval = setInterval(() => {
      setShouldHighlight(true);
      const timeoutId = setTimeout(() => setShouldHighlight(false), 2000);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(highlightInterval);
      };
    }, 120000);

    return () => clearInterval(highlightInterval);
  }, []);


  const getDayColor = useCallback((income, expenses) => {
    if (!income && !expenses) return styles.dayEmpty;
    const ratio = (income - expenses) / Math.max(income, expenses);
    if (ratio > 0.2) return styles.dayGreen;
    if (ratio < -0.2) return styles.dayRed;
    return styles.dayOrange;
  }, []);


  const navigateMonth = useCallback((direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  }, []);


  const generateCalendarDays = useMemo(() => {
    const days = [];
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const firstDayOfWeek = monthStart.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    for (
      let d = new Date(monthStart);
      d <= monthEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const date = d.toISOString().split("T")[0];
      const dayData = calendarData[date] || { income: 0, expenses: 0 };

      days.push(
        <div key={date} className={styles.dayWrapper}>
          <div
            className={`${styles.day} ${getDayColor(
              dayData.income,
              dayData.expenses
            )}`}
          >
            {d.getDate()}
          </div>

          <div className={styles.tooltip}>
            <p>
              Доходи: <CurrencyDisplay amount={dayData.income} />
              <br />
              Витрати: <CurrencyDisplay amount={dayData.expenses} />
            </p>
          </div>
        </div>
      );
    }

    return days;
  }, [currentDate, calendarData, getDayColor]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December", 
    
  ];

  return (
    <div className={styles.container}>
      <button
        className={`${styles.iconButton} ${
          shouldHighlight ? styles.highlight : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className={styles.icon} />
      </button>

      {isOpen && (
        <div className={styles.popup}>
          <div className={styles.calendarCard}>
            <div className={styles.monthNavigation}>
              <button
                onClick={() => navigateMonth(-1)}
                className={styles.navigationButton}
              >
                <ChevronLeft />
              </button>
              <div className={styles.monthTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button
                onClick={() => navigateMonth(1)}
                className={styles.navigationButton}
              >
                <ChevronRight />
              </button>
            </div>
            <div className={styles.weekDays}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.daysGrid}>{generateCalendarDays}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
