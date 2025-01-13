import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

const Goals = () => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const goals = useSelector(selectGoals);
  const activeGoal = useSelector(selectActiveGoal);
  const isLoadingGoals = useSelector(selectGoalsLoading);
  const goalsError = useSelector(selectGoalsError);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) return;

    dispatch(createGoal(newGoal))
      .unwrap()
      .then(() => {
        setIsGoalModalOpen(false);
        setNewGoal({ title: "", targetAmount: "", deadline: "" });
      })
      .catch((err) => console.error("Failed to create goal:", err));
  };

  const handleGoalAction = (goalId, action) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Мои цели</h2>
        <button
          onClick={() => setIsGoalModalOpen(true)}
          className={styles.addButton}
        >
          Добавить цель
        </button>
      </div>

      <div className={styles.goalsList}>
        {isLoadingGoals ? (
          <p className={styles.message}>Загрузка целей...</p>
        ) : goalsError ? (
          <p className={styles.error}>Ошибка: {goalsError}</p>
        ) : goals && goals.length > 0 ? (
          goals.map((goal) => (
            <div
              key={goal._id}
              className={`${styles.goalItem} ${
                goal.isActive ? styles.activeGoal : ""
              }`}
            >
              <div className={styles.goalContent}>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
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
                  {goal.currentAmount} ₽ / {goal.targetAmount} ₽
                </p>
                <p className={styles.goalDeadline}>
                  До: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.goalActions}>
                {!goal.isActive ? (
                  <button
                    onClick={() => handleGoalAction(goal._id, "activate")}
                    className={styles.activateButton}
                  >
                    Активировать
                  </button>
                ) : (
                  <button
                    onClick={() => handleGoalAction(goal._id, "deactivate")}
                    className={styles.deactivateButton}
                  >
                    Деактивировать
                  </button>
                )}
                <button
                  onClick={() => handleGoalAction(goal._id, "delete")}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.message}>Цели не найдены</p>
        )}
      </div>

      {isGoalModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Новая цель</h2>
            <input
              type="text"
              placeholder="Название цели"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Сумма цели"
              value={newGoal.targetAmount}
              onChange={(e) =>
                setNewGoal({ ...newGoal, targetAmount: e.target.value })
              }
              className={styles.input}
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) =>
                setNewGoal({ ...newGoal, deadline: e.target.value })
              }
              className={styles.input}
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleCreateGoal}
                className={styles.primaryButton}
              >
                Создать
              </button>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className={styles.secondaryButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
