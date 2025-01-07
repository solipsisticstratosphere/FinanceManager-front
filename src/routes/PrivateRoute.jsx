import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/auth/selectors";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function PrivateRoute({ redirectTo = "/landing", component }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const token = useSelector((state) => state.auth.token);

  if (isRefreshing || (token && !isLoggedIn)) {
    return <LoadingSpinner />;
  }

  return !isLoggedIn && !token ? <Navigate to={redirectTo} /> : component;
}
