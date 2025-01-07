import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/auth/selectors";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function PublicRoute({ redirectTo = "/home", component }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const token = useSelector((state) => state.auth.token);

  // Показываем лоадер пока идёт проверка аутентификации
  // ИЛИ если есть токен, но статус еще не определён
  if (isRefreshing || (token && !isLoggedIn)) {
    return <LoadingSpinner />;
  }

  return isLoggedIn ? <Navigate to={redirectTo} /> : component;
}
