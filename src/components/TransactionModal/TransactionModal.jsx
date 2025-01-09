import { useDispatch } from "react-redux";

import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./TransactionModal.module.css";
import { addTransaction } from "../../redux/transactions/operations";

const TransactionModal = ({ onClose, currentBalance }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    type: Yup.string().required("Виберіть тип транзакції"),
    amount: Yup.number()
      .required("Введіть суму")
      .positive("Сума повинна бути більше нуля")
      .test("check-balance", "Недостатньо коштів", function (value) {
        return this.parent.type === "income" || value <= currentBalance;
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
      try {
        await dispatch(
          addTransaction({
            type: values.type,
            amount: Number(values.amount),
            category: values.category,
            description: values.description,
          })
        ).unwrap();
        onClose();
      } catch (err) {
        setErrors({ submit: err.message || "Сталася помилка" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Додати транзакцію</h2>

        {formik.errors.submit && (
          <div className={styles.errorMessage}>{formik.errors.submit}</div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.radioLabel}>
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
            <label className={styles.radioLabel}>
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

          <div className={styles.fieldGroup}>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              placeholder="Сума"
              className={styles.input}
            />
            {formik.errors.amount && formik.touched.amount && (
              <div className={styles.errorMessage}>{formik.errors.amount}</div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              className={styles.select}
            >
              <option value="">Оберіть категорію</option>
              {formik.values.type === "expense" ? (
                <>
                  <option value="Продукти">Продукти</option>
                  <option value="Транспорт">Транспорт</option>
                  <option value="Розваги">Розваги</option>
                  <option value="Комунальні">Комунальні платежі</option>
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

          <div className={styles.fieldGroup}>
            <input
              type="text"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Опис"
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Відміна
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={styles.submitButton}
            >
              Додати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
