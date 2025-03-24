import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import RegisterPage from "~/pages/auth/RegisterPage";
import LoginPage from "~/pages/auth/LoginPage";
import ForgotPasswordPage from "~/pages/auth/ForgotPasswordPage";
import DashboardPage from "~/pages/dashboard/DashboardPage";
import PageError from "../pages/404";

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return token ? true : false;
};

const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  return isAuthenticated() ? <>{element}</> : <Navigate to="/auth/login" />;
};

export default () => (
  <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/dashboard"
        element={<PrivateRoute element={<DashboardPage />} />}
      />

      <Route path="*" element={<PageError />} />
    </Routes>
  </>
);
