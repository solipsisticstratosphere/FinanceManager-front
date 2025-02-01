import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  createGoal,
  deactivateGoal,
  deleteGoal,
  fetchGoals,
  setActiveGoal,
} from "../../redux/goals/operations";
import {
  selectActiveGoal,
  selectGoals,
  selectGoalsError,
  selectGoalsLoading,
} from "../../redux/goals/selectrors";
import styles from "./Goals.module.css";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import toast from "react-hot-toast";

// Validation schema
const GoalSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Назва цілі занадто коротка")
    .max(50, "Назва цілі занадто довга")
    .required("Обов'язкове поле"),
  targetAmount: Yup.number()
    .positive("Сума має бути більше 0")
    .required("Обов'язкове поле"),
  deadline: Yup.date()
    .min(new Date(), "Дата не може бути в минулому")
    .required("Обов'язкове поле"),
});

const Goals = () => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const goals = useSelector(selectGoals);
  const activeGoal = useSelector(selectActiveGoal);
  const isLoadingGoals = useSelector(selectGoalsLoading);
  const goalsError = useSelector(selectGoalsError);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (goals && goals.length > 0) {
      goals.forEach((goal) => {
        const isExpired = new Date(goal.deadline) < new Date();

        if (isExpired && goal.isActive) {
          dispatch(deactivateGoal(goal._id));
          toast.error(`Ціль "${goal.title}" просрочена`, {
            duration: 4000,
            position: "top-right",
          });
        }
      });
    }
  }, [goals, dispatch]);

  const handleCreateGoal = (values, { resetForm }) => {
    dispatch(createGoal(values))
      .unwrap()
      .then(() => {
        setIsGoalModalOpen(false);
        resetForm();
      })
      .catch((err) => console.error("Не вдалося створити ціль:", err));
  };

  const handleGoalAction = (goalId, action) => {
    const goal = goals.find((g) => g._id === goalId);
    const isExpired = new Date(goal.deadline) < new Date();

    if (action === "activate" && isExpired) {
      toast.error("Неможливо активувати просрочену ціль", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    switch (action) {
      case "activate":
        dispatch(setActiveGoal(goalId));
        break;
      case "deactivate":
        dispatch(deactivateGoal(goalId));
        break;
      case "delete":
        dispatch(deleteGoal(goalId));
        break;
      default:
        break;
    }
  };

  const handleModalClose = useCallback((e) => {
    if (e.target.className === styles.modalOverlay) {
      setIsGoalModalOpen(false);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Мої цілі</h2>
        <button
          onClick={() => setIsGoalModalOpen(true)}
          className={styles.addButton}
        >
          Додати ціль
        </button>
      </div>

      <div className={styles.goalsList}>
        {isLoadingGoals ? (
          <p className={styles.message}>Завантаження цілей...</p>
        ) : goalsError ? (
          <p className={styles.error}>Помилка: {goalsError}</p>
        ) : goals && goals.length > 0 ? (
          goals.map((goal) => {
            const isExpired = new Date(goal.deadline) < new Date();
            return (
              <div
                key={goal._id}
                className={`${styles.goalItem} ${
                  goal.isActive ? styles.activeGoal : ""
                } ${isExpired ? styles.expiredGoal : ""}`}
              >
                <div className={styles.goalContent}>
                  <h3 className={styles.goalTitle}>
                    {goal.title}
                    {isExpired && (
                      <span className={styles.expiredLabel}>Просрочено</span>
                    )}
                  </h3>
                  <div className={styles.goalProgress}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${
                          (goal.currentAmount / goal.targetAmount) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className={styles.goalAmount}>
                    <CurrencyDisplay amount={goal.currentAmount} /> /{" "}
                    <CurrencyDisplay amount={goal.targetAmount} />
                  </p>
                  <p className={styles.goalDeadline}>
                    До: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.goalActions}>
                  {!goal.isActive && !isExpired ? (
                    <button
                      onClick={() => handleGoalAction(goal._id, "activate")}
                      className={styles.activateButton}
                    >
                      Активувати
                    </button>
                  ) : goal.isActive ? (
                    <button
                      onClick={() => handleGoalAction(goal._id, "deactivate")}
                      className={styles.deactivateButton}
                    >
                      Деактивувати
                    </button>
                  ) : null}
                  <button
                    onClick={() => handleGoalAction(goal._id, "delete")}
                    className={styles.deleteButton}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className={styles.message}>Цілі не знайдено</p>
        )}
      </div>

      {isGoalModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Нова ціль</h2>
            <Formik
              initialValues={{
                title: "",
                targetAmount: "",
                deadline: "",
              }}
              validationSchema={GoalSchema}
              onSubmit={handleCreateGoal}
            >
              {({ errors, touched, isValid, dirty }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup}>
                    <Field
                      name="title"
                      type="text"
                      placeholder="Назва цілі"
                      className={`${styles.input} ${
                        errors.title && touched.title ? styles.inputError : ""
                      }`}
                    />
                    {errors.title && touched.title && (
                      <div className={styles.errorMessage}>{errors.title}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <Field
                      name="targetAmount"
                      type="number"
                      placeholder="Сума цілі"
                      className={`${styles.input} ${
                        errors.targetAmount && touched.targetAmount
                          ? styles.inputError
                          : ""
                      }`}
                    />
                    {errors.targetAmount && touched.targetAmount && (
                      <div className={styles.errorMessage}>
                        {errors.targetAmount}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <Field
                      name="deadline"
                      type="date"
                      className={`${styles.input} ${
                        errors.deadline && touched.deadline
                          ? styles.inputError
                          : ""
                      }`}
                    />
                    {errors.deadline && touched.deadline && (
                      <div className={styles.errorMessage}>
                        {errors.deadline}
                      </div>
                    )}
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="submit"
                      className={`${styles.primaryButton} ${
                        !(isValid && dirty) ? styles.buttonDisabled : ""
                      }`}
                      disabled={!(isValid && dirty)}
                    >
                      Створити
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGoalModalOpen(false)}
                      className={styles.secondaryButton}
                    >
                      Скасувати
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
