import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, KeyRound } from 'lucide-react';

export const VerifyOTPPage = ({ onNavigate }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length === 4) {
      console.log('OTP submitted:', otpValue);
      onNavigate('change-password');
    } else {
      setError('Please enter all 4 digits');
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--glass)' }}>
            <KeyRound size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-600)' }}>Verify OTP</h2>
          <p className="text-gray-600">Enter the 4-digit code sent to your phone</p>
        </div>

        <div className="form">
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="input w-16 h-16 text-center text-2xl font-bold"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full justify-center"
            disabled={!isComplete}
            style={{ opacity: isComplete ? 1 : 0.5 }}
          >
            Verify OTP
            <ArrowRight size={18} />
          </button>

          <div className="text-center text-sm text-gray-600">
            Didn't receive code?{' '}
            <button
              type="button"
              className="font-semibold"
              style={{ color: 'var(--primary)' }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
