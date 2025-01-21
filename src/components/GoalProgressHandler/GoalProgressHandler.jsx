import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { deactivateGoal } from "../../redux/goals/operations";
import toast from "react-hot-toast";
import { selectActiveGoal } from "../../redux/goals/selectrors";

const GoalProgressHandler = () => {
  const activeGoal = useSelector(selectActiveGoal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeGoal && activeGoal.currentAmount >= activeGoal.targetAmount) {
      toast.success(`Вітаємо! Ціль "${activeGoal.title}" досягнуто! 🎉`, {
        duration: 5000,
        position: "top-right",
      });
      dispatch(deactivateGoal(activeGoal._id));
    }
  }, [activeGoal, dispatch]);

  return null;
};

export default GoalProgressHandler;
