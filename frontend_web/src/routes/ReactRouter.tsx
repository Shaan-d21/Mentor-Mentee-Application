import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import MentorDashboard from "../pages/dashboard/MentorDashboard";
import MenteeDashboard from "../pages/dashboard/MenteeDashboard";
import ProfileCompletion from "../pages/ProfileCompletion";
import CompatibilityReportPreview from "../pages/mentee/CompatibilityReportPreview";

const AppRouter: React.FC = () => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  const userRole = localStorage.getItem('role')?.toLowerCase();

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/profile-completion" element={<ProfileCompletion />} />
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
