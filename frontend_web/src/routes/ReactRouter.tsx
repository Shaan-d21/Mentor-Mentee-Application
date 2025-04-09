import { Routes, Route, Navigate, useLocation, useSearchParams } from "react-router-dom";
// import { useEffect } from "react";
import HomePage from "../pages/HomePage";
import RegisterPage from "~/pages/auth/RegisterPage";
import LoginPage from "~/pages/auth/LoginPage";
import ForgotPasswordPage from "~/pages/auth/ForgotPasswordPage";
import DashboardPage from "~/pages/dashboard/DashboardPage";
import PageError from "../pages/404";

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token; // Convert to boolean
};

// Redirect to login if not authenticated, or to dashboard if already authenticated
// Unless "force=true" is in the URL query parameters
const AuthRoute = ({ element }: { element: React.ReactNode }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const forceAccess = searchParams.get("force") === "true";
  
  // If force=true is set or user is not authenticated, show the page
  // Otherwise redirect to dashboard
  return !isAuthenticated() || forceAccess ? (
    <>{element}</>
  ) : (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  );
};

// Protect routes that require authentication
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    <>{element}</>
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default () => (
  <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Auth routes - redirect to dashboard if already logged in (unless force=true) */}
      <Route path="/auth/register" element={<AuthRoute element={<RegisterPage />} />} />
      <Route path="/auth/login" element={<AuthRoute element={<LoginPage />} />} />
      <Route path="/auth/forgot-password" element={<AuthRoute element={<ForgotPasswordPage />} />} />

      {/* Protected routes - require authentication */}
      <Route
        path="/dashboard/*"
        element={<PrivateRoute element={<DashboardPage />} />}
      />

      <Route path="*" element={<PageError />} />
    </Routes>
  </>
);
