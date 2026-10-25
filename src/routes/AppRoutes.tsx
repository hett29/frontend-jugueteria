
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import DistributorRequestPage from "../pages/distributors/DistributorRequestPage";
import DistributorRegisterPage from "../pages/distributors/DistributorRegisterPage";
import { authRepository } from "../repositories/authRepository";

function AppRoutes() {
  const isAuthenticated = authRepository.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <HomePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/solicitud-distribuidor"
          element={<DistributorRequestPage />}
        />

        <Route
          path="/registro-distribuidor"
          element={<DistributorRegisterPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
