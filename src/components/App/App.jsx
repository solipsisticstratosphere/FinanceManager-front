import { Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "../../pages/LandingPage/LandingPage";
import PublicRoute from "../../routes/PublicRoute";
import PrivateRoute from "../../routes/PrivateRoute";
import MainPage from "../../pages/MainPage/MainPage";
import PublicRegisterRoute from "../../routes/PublicRegisterRoute";
import SignupPage from "../../pages/SignUpPage/SignupPage";
import SinginPage from "../../pages/SignInPage/SigninPage";

export default function App() {
  return (
    <>
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
    </>
  );
}
