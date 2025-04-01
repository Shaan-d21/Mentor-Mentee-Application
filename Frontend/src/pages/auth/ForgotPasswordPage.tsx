import React, { useState } from "react";
import api from "~/config/api";
import OtpVerification from "./OTPVerification";
import { toast } from "react-toastify";
import { sendOtpEndpoint } from "~/config/endpoint";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log("Sending email:", normalizedEmail);

      const response = await api.post(sendOtpEndpoint, { email: normalizedEmail });
      console.log("Response from /auth/send-otp:", response);

      if (response.status === 200) {
        toast.success("OTP sent successfully!");
        setStep("otp");
        console.log("Redirecting to OTP page...");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        error?.response?.data?.detail || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleVerificationSuccess = () => {
    toast.success("OTP verified successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {step === "email" ? (
          <div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Password Reset
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Enter your registered email to receive an OTP.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Send OTP
              </button>
            </form>
          </div>
        ) : (
          <OtpVerification
            email={email.trim().toLowerCase()}
            onBack={() => setStep("email")}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
