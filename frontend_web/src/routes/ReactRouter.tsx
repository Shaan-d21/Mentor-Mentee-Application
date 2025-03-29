import { Routes, Route, Navigate, useLocation, useSearchParams } from "react-router-dom";
// import { useEffect } from "react";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import MenteeDashboard from "../pages/dashboard/MenteeDashboard";
import MentorDashboard from "../pages/dashboard/MentorDashboard";
import ProfileCompletion from "../pages/ProfileCompletion";
import PageError from "../pages/404";
import ProtectedRoute from "../components/ProtectedRoute";

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
  // Otherwise redirect to appropriate dashboard
  return !localStorage.getItem("accessToken") || forceAccess ? (
    <>{element}</>
  ) : (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  );
};

// Role-based dashboard redirect
const DashboardRedirect = () => {
  const userInfoString = localStorage.getItem("userInfo");
  if (!userInfoString) {
    return <Navigate to="/auth/login" replace />;
  }

  const userInfo = JSON.parse(userInfoString);
  return <Navigate to={`/${userInfo.role}/dashboard`} replace />;
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

      {/* Profile Completion route - requires authentication but not profile completion */}
      <Route
        path="/profile-completion"
        element={
          <ProtectedRoute requireProfileCompletion={false}>
            <ProfileCompletion />
          </ProtectedRoute>
        }
      />

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Protected routes - require authentication and profile completion */}
      <Route
        path="/mentee/dashboard/*"
        element={
          <ProtectedRoute requireProfileCompletion={true}>
            <MenteeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor/dashboard/*"
        element={
          <ProtectedRoute requireProfileCompletion={true}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<PageError />} />
    </Routes>
  </>
);
