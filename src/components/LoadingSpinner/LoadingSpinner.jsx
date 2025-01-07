import { Loader2 } from "lucide-react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrapper}>
        <Loader2 className={styles.spinner} />
        <p className={styles.text}>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
