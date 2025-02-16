import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./TransactionModal.module.css";
import { addTransaction } from "../../redux/transactions/operations";
import { deactivateGoal } from "../../redux/goals/operations";
import toast from "react-hot-toast";
import { selectActiveGoal } from "../../redux/goals/selectrors";
import { useState } from "react";

const TransactionModal = ({ onClose, currentBalance }) => {
  const dispatch = useDispatch();
  const activeGoal = useSelector(selectActiveGoal);
  const [isProcessing, setIsProcessing] = useState(false);

  const validationSchema = Yup.object({
    type: Yup.string().required("Виберіть тип транзакції"),
    amount: Yup.number()
      .required("Введіть суму")
      .positive("Сума повинна бути більше нуля")
      .test("check-balance", "Недостатньо коштів", function (value) {
        const numericValue = Number(value);
        const numericBalance = Number(currentBalance);
        return this.parent.type === "income" || numericValue <= numericBalance;
      }),
    category: Yup.string().required("Оберіть категорію"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      type: "expense",
      amount: "",
      category: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setIsProcessing(true);
      try {
        const initialGoalAmount = activeGoal?.currentAmount || 0;

        // Ensure proper number formatting
        const transactionData = {
          type: values.type,
          amount: Number(values.amount),
          category: values.category,
          description: values.description || "", // Ensure description is never undefined
        };

        const result = await dispatch(addTransaction(transactionData)).unwrap();

        if (values.type === "income" && activeGoal) {
          const newAmount = initialGoalAmount + Number(values.amount);

          if (newAmount >= activeGoal.targetAmount) {
            toast.success(`🎉 Вітаємо! Ціль "${activeGoal.title}" досягнуто!`, {
              duration: 4000,
              position: "top-center",
              style: {
                backgroundColor: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "16px 24px",
                borderRadius: "8px",
              },
            });

            await dispatch(deactivateGoal(activeGoal._id));
          }
        }

        onClose();
      } catch (err) {
        console.error("Transaction error:", err);
        toast.error(err.toString(), {
          duration: 4000,
          position: "top-center",
        });
        setErrors({ submit: err.toString() });
      } finally {
        setIsProcessing(false);
        setSubmitting(false);
      }
    },
  });
  const handleClose = (e) => {
    if (e.target.className.includes(styles.modalOverlay)) {
      if (!isProcessing) {
        onClose();
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Додати транзакцію</h2>

        {formik.errors.submit && (
          <div className={styles.errorMessage}>{formik.errors.submit}</div>
        )}

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.radioGroup}>
            <label
              className={`${styles.radioLabel} ${
                formik.values.type === "expense" ? styles.radioLabelActive : ""
              }`}
            >
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formik.values.type === "expense"}
                onChange={formik.handleChange}
                className={styles.radioInput}
              />
              Витрати
            </label>
            <label
              className={`${styles.radioLabel} ${
                formik.values.type === "income" ? styles.radioLabelActive : ""
              }`}
            >
              <input
                type="radio"
                name="type"
                value="income"
                checked={formik.values.type === "income"}
                onChange={formik.handleChange}
                className={styles.radioInput}
              />
              Дохід
            </label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              placeholder="Сума"
              className={`${styles.input} ${
                formik.errors.amount && formik.touched.amount
                  ? styles.inputError
                  : ""
              }`}
            />
            {formik.errors.amount && formik.touched.amount && (
              <div className={styles.errorMessage}>{formik.errors.amount}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              className={`${styles.select} ${
                formik.errors.category && formik.touched.category
                  ? styles.inputError
                  : ""
              }`}
            >
              <option value="">Оберіть категорію</option>
              {formik.values.type === "expense" ? (
                <>
                  <option value="Продукти">Продукти</option>
                  <option value="Транспорт">Транспорт</option>
                  <option value="Розваги">Розваги</option>
                  <option value="Комунальні платежі">Комунальні платежі</option>
                </>
              ) : (
                <>
                  <option value="Зарплата">Зарплата</option>
                  <option value="Стипендія">Стипендія</option>
                  <option value="Підробіток">Підробіток</option>
                  <option value="Інше">Інше</option>
                </>
              )}
            </select>
            {formik.errors.category && formik.touched.category && (
              <div className={styles.errorMessage}>
                {formik.errors.category}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Опис"
              className={styles.input}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="submit"
              disabled={formik.isSubmitting || isProcessing}
              className={`${styles.primaryButton} ${
                formik.isSubmitting || isProcessing ? styles.buttonDisabled : ""
              }`}
            >
              {isProcessing ? "Обробка..." : "Додати"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className={styles.secondaryButton}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
