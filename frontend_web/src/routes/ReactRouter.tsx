import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "~/pages/auth/ResetPasswordPage";
import MentorDashboard from "../pages/dashboard/MentorDashboard";
import MenteeDashboard from "../pages/dashboard/MenteeDashboard";
import ProfileCompletion from "../pages/ProfileCompletion";
import CompatibilityReportPreview from "../pages/mentee/CompatibilityReportPreview";
import OTPVerification from "~/pages/auth/OTPVerification";

const AppRouter: React.FC = () => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  const userRole = localStorage.getItem('role')?.toLowerCase();
  const location = useLocation(); // Access navigation state

  // Extract email from location state, default to empty string if not found
  const email = (location.state as { email?: string } | null)?.email || "";

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/profile-completion" element={<ProfileCompletion />} />
      <Route
        path="/otp-verification"
        element={<OTPVerification email={email} />}
      />
      <Route
        path="/mentor/dashboard/*"
        element={
          isAuthenticated && userRole === "mentor" ? (
            <MentorDashboard />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
      <Route
        path="/mentee/dashboard/*"
        element={
          isAuthenticated && userRole === "mentee" ? (
            <MenteeDashboard />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
      <Route
        path="/mentee/compatibility-report"
        element={
          isAuthenticated && userRole === "mentee" ? (
            <CompatibilityReportPreview />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AppRouter;