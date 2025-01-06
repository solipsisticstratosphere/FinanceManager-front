import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRegistered } from "../redux/auth/selectors";
import { Navigate } from "react-router-dom";

export default function PublicRegisterRoute({
  redirectTo = "/landing",
  component,
}) {
  const isRegistered = useSelector(selectIsRegistered);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return isRegistered ? (
    <Navigate to={redirectTo} />
  ) : isLoggedIn ? (
    <Navigate to="/home" />
  ) : (
    component
  );
}
