import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/auth/selectors";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({
  redirectTo = "/landing",
  component: Component,
}) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  const requireRedirect = !isLoggedIn && !isRefreshing;

  return requireRedirect ? <Navigate to={redirectTo} /> : <Component />;
}
