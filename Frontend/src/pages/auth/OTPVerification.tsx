import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "~/config/api";

type OTPVerificationProps = {
  email: string;
  onBack?: () => void;
  onVerificationSuccess?: () => void;
};

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onBack, 
  onVerificationSuccess 
}) => {
  const [otp, setOTP] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const otpRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  useEffect(() => {
    // Focus on the first input when component mounts
    const firstInput = otpRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }

    // Countdown timer for resend button
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value.substring(0, 1); // Take only the first digit
    setOTP(newOTP);

    // Auto-focus next input after filling current one
    if (value && index < 5) {
      const nextInput = otpRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

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
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp: otpValue
      });

      if (response && response.status === 200) {
        toast.success("OTP verified successfully!");
        
        // Call onVerificationSuccess callback if provided, otherwise navigate to login
        if (onVerificationSuccess) {
          onVerificationSuccess();
        } else {
          setTimeout(() => {
            // Default navigation to login if no callback provided
            navigate("/auth/login");
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
      const errorMessage = 
        error?.response?.data?.detail || 
        error?.message || 
        "Failed to verify OTP. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0 || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/resend-otp", { email });
      
      if (response && response.status === 200) {
        toast.success("OTP has been resent to your email");
        setTimeLeft(30); // Reset the timer
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      
      const errorMessage = 
        error?.response?.data?.detail || 
        error?.message || 
        "Failed to resend OTP. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        OTP Verification
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Enter the verification code sent to<br />
        <span className="font-medium text-gray-800">{email}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-6">
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              ref={(el) => { 
                if (el) otpRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
          className={`w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600 mb-2">
          Didn't receive the code?{" "}
          {timeLeft > 0 ? (
            <span className="font-medium">Resend in {timeLeft}s</span>
          ) : (
            <button
              type="button"
              className={`text-blue-600 hover:underline focus:outline-none ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleResendOtp}
              disabled={isSubmitting || timeLeft > 0}
            >
              Resend OTP
            </button>
          )}
        </p>
        <button
          type="button"
          className="text-gray-600 hover:underline focus:outline-none mt-2"
          onClick={onBack || (() => navigate("/auth/login"))}
          disabled={isSubmitting}
        >
          Back to {onBack ? "registration" : "login"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
