import { Routes, Route, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import MenteeDashboard from "../pages/dashboard/MenteeDashboard";
import MentorDashboard from "../pages/dashboard/MentorDashboard";
import ProfileCompletion from "../pages/ProfileCompletion";
import PageError from "../pages/404";
import ProtectedRoute from "../components/ProtectedRoute";
import MentorProfile from '../pages/dashboard/MentorProfile';
import MenteeProfile from '../pages/dashboard/MenteeProfile';
import MenteeRequests from '../pages/dashboard/MenteeRequests';
import MyMentees from '../pages/dashboard/MyMentees';

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token; // Convert to boolean
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

// Redirect to login if not authenticated, or to dashboard if already authenticated
// Unless "force=true" is in the URL query parameters
const AuthRoute = ({ element }: { element: React.ReactNode }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const forceAccess = searchParams.get("force") === "true";
  
  // If force=true is set or user is not authenticated, show the page
  // Otherwise redirect to appropriate dashboard based on role
  if (!localStorage.getItem("accessToken") || forceAccess) {
    return <>{element}</>;
  }

  const userInfoString = localStorage.getItem("userInfo");
  if (!userInfoString) {
    return <Navigate to="/auth/login" replace />;
  }

  const userInfo = JSON.parse(userInfoString);
  const role = userInfo.role?.toLowerCase();
  
  if (role === 'mentor') {
    return <Navigate to="/mentor/dashboard" replace />;
  } else if (role === 'mentee') {
    return <Navigate to="/mentee/dashboard" replace />;
  }
  
  return <Navigate to="/auth/login" replace />;
};

// Role-based dashboard redirect
const DashboardRedirect = () => {
  const userInfoString = localStorage.getItem("userInfo");
  if (!userInfoString) {
    return <Navigate to="/auth/login" replace />;
  }

  const userInfo = JSON.parse(userInfoString);
  const role = userInfo.role?.toLowerCase();
  
  if (role === 'mentor') {
    return <Navigate to="/mentor/dashboard" replace />;
  } else if (role === 'mentee') {
    return <Navigate to="/mentee/dashboard" replace />;
  }
  
  return <Navigate to="/auth/login" replace />;
};

const AppRoutes = () => {
  return (
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
      {/* Mentee Dashboard Routes */}
      <Route
        path="/mentee/dashboard/*"
        element={
          <ProtectedRoute requireProfileCompletion={true}>
            <MenteeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Mentor Dashboard Routes */}
      <Route
        path="/mentor/dashboard/*"
        element={
          <ProtectedRoute requireProfileCompletion={true}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Standalone Profile Routes (these redirect to dashboard profile routes) */}
      <Route
        path="/mentor/profile"
        element={<Navigate to="/mentor/dashboard/profile" replace />}
      />

      <Route
        path="/mentee/profile"
        element={<Navigate to="/mentee/dashboard/profile" replace />}
      />

      <Route
        path="/mentor/requests"
        element={<Navigate to="/mentor/dashboard/requests" replace />}
      />

      <Route
        path="/mentor/mentees"
        element={<Navigate to="/mentor/dashboard/mentees" replace />}
      />

      {/* Catch all route - redirect to login if authenticated, otherwise show 404 */}
      <Route
        path="*"
        element={
          isAuthenticated() ? (
            <DashboardRedirect />
          ) : (
            <PageError />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
