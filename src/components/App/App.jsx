import { Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "../../pages/LandingPage/LandingPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </>
  );
}
