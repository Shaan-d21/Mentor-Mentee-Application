import React, { useState } from "react";
import api from "~/config/api";
import OtpVerification from "./OTPVerification";

export default () => {
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [status, setStatus] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Make an API call to send the OTP (use your endpoint here)
      const response = await api.post("/auth/send-otp", { email });
      if (response.status === 200) {
        setStatus({ type: "success", message: "OTP sent successfully!" });
        setStep("otp");
      } else {
        setStatus({
          type: "error",
          message: "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error sending OTP. Please try again later.",
      });
    }
  };
  const handleVerificationSuccess = () => {
    setStatus({ type: "success", message: "OTP verified successfully!" });
    // Add your redirect logic here, for example:
    // history.push('/reset-password');
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
              Enter your registered email
            </p>

            {status.message && (
              <div
                className={`text-center p-2 mb-4 text-sm ${
                  status.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {status.message}
              </div>
            )}

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

            <a
              className="mt-4 text-center text-sm text-blue-500 cursor-pointer"
              href="/auth/login"
            >
              Back to Login
            </a>
          </div>
        ) : (
          <OtpVerification
            email={email}
            onBack={() => setStep("email")}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
      </div>
    </div>
  );
};
