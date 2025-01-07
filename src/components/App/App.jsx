import { Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "../../pages/LandingPage/LandingPage";
import PublicRoute from "../../routes/PublicRoute";
import PrivateRoute from "../../routes/PrivateRoute";
import MainPage from "../../pages/MainPage/MainPage";
import PublicRegisterRoute from "../../routes/PublicRegisterRoute";
import SignupPage from "../../pages/SignUpPage/SignupPage";
import SinginPage from "../../pages/SignInPage/SigninPage";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
  selectIsRegistered,
} from "../../redux/auth/selectors";
import { Suspense, useEffect, useRef } from "react";
import { refreshUser } from "../../redux/auth/operations";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(refreshUser());
    }
  }, [dispatch, token]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route index element={<Navigate to="/landing" />} />
        <Route
          path="/landing"
          element={
            <PublicRoute component={<LandingPage />} redirectTo="/home" />
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute component={<MainPage />} redirectTo="/signin" />
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRegisterRoute
              component={<SignupPage />}
              redirectTo="/signin"
            />
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute component={<SinginPage />} redirectTo="/home" />
          }
        />
      </Routes>
    </Suspense>
  );
}
