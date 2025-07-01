import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGoal,
  deactivateGoal,
  deleteGoal,
  setActiveGoal,
} from "../../redux/goals/operations";
import {
  selectGoals,
  selectGoalsError,
  selectGoalsLoading,
} from "../../redux/goals/selectrors";
import styles from "./Goals.module.css";
import CurrencyDisplay from "../CurrencyDisplay/CurrencyDisplay";
import toast from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  AlertOctagon,
} from "lucide-react";

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
  const isLoadingGoals = useSelector(selectGoalsLoading);
  const goalsError = useSelector(selectGoalsError);

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

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal) => {
    const isExpired = new Date(goal.deadline) < new Date();
    const isCompleted = goal.currentAmount >= goal.targetAmount;
    const isNegative = goal.currentAmount < 0;

    if (isCompleted) return "completed";
    if (isExpired) return "expired";
    if (isNegative) return "negative";
    if (goal.isActive) return "active";
    return "inactive";
  };

  const getGoalStatusComponent = (goal) => {
    const status = getGoalStatus(goal);

    switch (status) {
      case "completed":
        return (
          <div className={styles.statusBadge}>
            <CheckCircle size={16} className={styles.statusIcon} />
            <span>Завершено</span>
          </div>
        );
      case "expired":
        return (
          <div className={`${styles.statusBadge} ${styles.statusExpired}`}>
            <AlertTriangle size={16} className={styles.statusIcon} />
            <span>Прострочено</span>
          </div>
        );
      case "negative":
        return (
          <div className={`${styles.statusBadge} ${styles.statusNegative}`}>
            <AlertOctagon size={16} className={styles.statusIcon} />
            <span>Від&apos;ємне значення</span>
          </div>
        );
      default:
        return null;
    }
  };

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
            const status = getGoalStatus(goal);
            const progressPercentage =
              (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);
            const showUrgentBadge = daysRemaining > 0 && daysRemaining <= 5;

            return (
              <div
                key={goal._id}
                className={`${styles.goalItem} ${
                  styles[
                    `goal${status.charAt(0).toUpperCase() + status.slice(1)}`
                  ]
                }`}
              >
                <div className={styles.goalContent}>
                  <div className={styles.goalTitleWrapper}>
                    <h3 className={styles.goalTitle}>{goal.title}</h3>
                    {getGoalStatusComponent(goal)}
                  </div>

                  <div className={styles.goalProgress}>
                    <div
                      className={`${styles.progressBar} ${
                        status === "completed" ? styles.progressCompleted : ""
                      } ${status === "expired" ? styles.progressExpired : ""} ${
                        status === "negative" ? styles.progressNegative : ""
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(0, progressPercentage),
                          100
                        )}%`,
                      }}
                    >
                      {progressPercentage > 15 && (
                        <span className={styles.progressText}>
                          {progressPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    {progressPercentage <= 15 && (
                      <span className={styles.progressTextOutside}>
                        {progressPercentage.toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <p className={styles.goalAmount}>
                    <CurrencyDisplay amount={goal.currentAmount} /> /{" "}
                    <CurrencyDisplay amount={goal.targetAmount} />
                  </p>

                  <div className={styles.goalDeadlineContainer}>
                    <p
                      className={`${styles.goalDeadline} ${
                        status === "expired" ? styles.deadlineExpired : ""
                      }`}
                    >
                      <Clock size={14} className={styles.deadlineIcon} />
                      До: {new Date(goal.deadline).toLocaleDateString()}
                    </p>

                    {showUrgentBadge && (
                      <span className={styles.urgentBadge}>
                        Залишилося {daysRemaining}{" "}
                        {daysRemaining === 1
                          ? "день"
                          : daysRemaining < 5
                          ? "дні"
                          : "днів"}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.goalActions}>
                  {!goal.isActive && status !== "expired" ? (
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
                    <Trash2 size={16} />
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
              {({ errors, touched, isValid, dirty, setFieldValue, values }) => (
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
                      min="0"
                      className={`${styles.input} ${
                        errors.targetAmount && touched.targetAmount
                          ? styles.inputError
                          : ""
                      }`}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value) || value >= 0) {
                          setFieldValue("targetAmount", e.target.value);
                        }
                      }}
                    />
                    {errors.targetAmount && touched.targetAmount && (
                      <div className={styles.errorMessage}>
                        {errors.targetAmount}
                      </div>
                    )}
                    {values.targetAmount < 0 && (
                      <div className={styles.errorMessage}>
                        Значення не може бути від&apos;ємним
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
