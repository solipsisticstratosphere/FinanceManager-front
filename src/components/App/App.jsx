import { Navigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect, lazy } from "react";
import { refreshUser } from "../../redux/auth/operations";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Layout from "../Layout/Layout";
import PublicRoute from "../../routes/PublicRoute";
import PrivateRoute from "../../routes/PrivateRoute";
import PublicRegisterRoute from "../../routes/PublicRegisterRoute";

// Lazy load components
const LandingPage = lazy(() => import("../../pages/LandingPage/LandingPage"));
const SignupPage = lazy(() => import("../../pages/SignUpPage/SignupPage"));
const SinginPage = lazy(() => import("../../pages/SignInPage/SigninPage"));
const MainPage = lazy(() => import("../../pages/MainPage/MainPage"));
const GoalsPage = lazy(() => import("../../pages/GoalsPage/GoalsPage"));
const TransactionsPage = lazy(() =>
  import("../../pages/TransactionsPage/TransactionsPage")
);
const AnalyticsPage = lazy(() =>
  import("../../pages/AnalyticsPage/AnalyticsPage")
);
// const Settings = lazy(() => import("../../pages/Settings/Settings"));

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
            <PublicRoute
              component={
                <Suspense fallback={<LoadingSpinner />}>
                  <LandingPage />
                </Suspense>
              }
              redirectTo="/home"
            />
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRegisterRoute
              component={
                <Suspense fallback={<LoadingSpinner />}>
                  <SignupPage />
                </Suspense>
              }
              redirectTo="/signin"
            />
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute
              component={
                <Suspense fallback={<LoadingSpinner />}>
                  <SinginPage />
                </Suspense>
              }
              redirectTo="/home"
            />
          }
        />
        <Route
          path="/"
          element={<PrivateRoute component={<Layout />} redirectTo="/signin" />}
        >
          <Route
            path="home"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MainPage />
              </Suspense>
            }
          />
          <Route
            path="goals"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GoalsPage />
              </Suspense>
            }
          />
          <Route
            path="transactions"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TransactionsPage />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AnalyticsPage />
              </Suspense>
            }
          />
          {/* <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Settings />
              </Suspense>
            }
          /> */}
        </Route>
      </Routes>
    </Suspense>
  );
}
