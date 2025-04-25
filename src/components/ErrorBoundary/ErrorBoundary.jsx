import React from "react";
import PropTypes from "prop-types";
import styles from "./ErrorBoundary.module.css";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ошибка в ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>Oops!</h1>
            <p className={styles.errorMessage}>Щось пішло не так.</p>
            <p className={styles.errorDescription}>
              При завантаженні програми виникла помилка.
            </p>
            <button
              className={styles.homeButton}
              onClick={() => this.props.navigate("/home")}
              aria-label="Вернуться на главную страницу"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  this.props.navigate("/home");
                }
              }}
            >
              Повернутись додому
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  navigate: PropTypes.func.isRequired,
};

function ErrorBoundaryWithNavigate(props) {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
}

export default ErrorBoundaryWithNavigate;
