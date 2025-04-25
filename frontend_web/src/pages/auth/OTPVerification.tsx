import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "~/config/api";
import axios from "axios";

type OTPVerificationProps = {
  email: string;
};

const OTPVerification: React.FC<OTPVerificationProps> = ({ email }) => {
  const [otp, setOTP] = useState<string[]>(Array(4).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>(Array(4).fill(null));
  const navigate = useNavigate();

  // Redirect to forgot-password if email is missing
  useEffect(() => {
    if (!email) {
      toast.error("Email is required for OTP verification");
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus on the first input when component mounts
    const firstInput = otpRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value.substring(0, 1); // Take only the first digit
    setOTP(newOTP);

    // Auto-focus next input after filling current one
    if (value && index < 3) {
      const nextInput = otpRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const resend_otp = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/verification/otp`,
        {
          params: {
            mail: email.trim().toLowerCase(),
          },
          headers: {
            'Accept': 'application/json',
          },
        }
      );
  
      // Check response data for success
      if (response.status === 200 && response.data.status_code === 200) {
        toast.success("Password reset OTP has been sent to your email!");
        navigate("/otp-verification", { state: { email: email.trim().toLowerCase() } });
      } else {
        toast.error(response.data.Message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = otpRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      toast.error("Please enter all 4 digits of the OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      navigate("/reset-password");
      const response = await api.post("/verify-otp", {
        email,
        otp: otpValue,
      });

      if (response && response.status === 200) {
        toast.success("OTP verified successfully!");
        setTimeout(() => {
          navigate("/reset-password", { state: { email } }); // Pass email to reset password page
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to verify OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render nothing while redirecting
  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">Enter the 4-digit code sent to your email</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8">
            {Array(4).fill(0).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) otpRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white shadow-sm"
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting}
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="mt-4">
            <button
              type="button"
              className="text-blue-600 font-semibold hover:underline"
              onClick={() => resend_otp()}
            >
              Resend Otp
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;