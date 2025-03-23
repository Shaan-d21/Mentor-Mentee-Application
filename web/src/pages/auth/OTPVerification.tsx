import React, { useState, useRef } from 'react';

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
  onVerificationSuccess: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onBack, onVerificationSuccess }) => {
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([...Array(6)].map(() => null));

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length === 6) {
      onVerificationSuccess();
    } else {
      setStatus({ type: 'error', message: 'Please enter complete OTP' });
    }
  };

  const handleResendOtp = () => {
    setOtpValues(['', '', '', '', '', '']);
    setTimer(30);
    setStatus({ type: 'success', message: 'OTP resent successfully!' });
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Verify OTP</h2>
      <p className="text-center text-gray-600 mb-6">Enter the 6-digit code sent to {email}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between gap-4 mb-4">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
        </div>

        {status.message && (
          <p className={`text-center text-sm mt-2 ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {status.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Verify OTP
        </button>

        <div className="flex justify-between items-center mt-6">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResendOtp}
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
