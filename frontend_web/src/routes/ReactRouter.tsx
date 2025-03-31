import { Routes, Route, Navigate, useLocation, useSearchParams } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import MenteeDashboard from "../pages/dashboard/MenteeDashboard";
import MentorDashboard from "../pages/dashboard/MentorDashboard";
import ProfileCompletion from "../pages/ProfileCompletion";
import MenteeProfile from "../pages/MenteeProfile";
import PageError from "../pages/404";
import ProtectedRoute from "../components/ProtectedRoute";

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

const AuthRoute = ({ element }: { element: React.ReactNode }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const forceAccess = searchParams.get("force") === "true";

  return !isAuthenticated() || forceAccess ? (
    <>{element}</>
  ) : (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  );
};

const DashboardRedirect = () => {
  const userInfoString = localStorage.getItem("userInfo");
  if (!userInfoString) {
    return <Navigate to="/auth/login" replace />;
  }

  const userInfo = JSON.parse(userInfoString);
  return <Navigate to={`/${userInfo.role}/dashboard`} replace />;
};

const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    <>{element}</>
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default () => (
  <Routes>
    <Route path="/" element={<HomePage />} />

    <Route path="/auth/register" element={<AuthRoute element={<RegisterPage />} />} />
    <Route path="/auth/login" element={<AuthRoute element={<LoginPage />} />} />
    <Route path="/auth/forgot-password" element={<AuthRoute element={<ForgotPasswordPage />} />} />

    <Route
      path="/profile-completion"
      element={
        <ProtectedRoute requireProfileCompletion={false}>
          <ProfileCompletion />
        </ProtectedRoute>
      }
    />

    <Route path="/dashboard" element={<DashboardRedirect />} />

    <Route path="/mentee/dashboard/*" element={<PrivateRoute element={<MenteeDashboard />} />} />
    <Route path="/mentor/dashboard/*" element={<PrivateRoute element={<MentorDashboard />} />} />
    <Route path="/mentee/profile" element={<PrivateRoute element={<MenteeProfile />} />} />

    <Route path="*" element={<PageError />} />
  </Routes>
);
