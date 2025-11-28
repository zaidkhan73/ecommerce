/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { serverUrl } from "../App";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;

    // allow only digits
    if (value && !/^\d$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

    // Clear error when user starts typing OTP
    if (errorMessage) {
      setErrorMessage("");
    }

    // Auto-focus next input if current input is filled
    if (value && index < otpDigits.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, otpDigits.length);
    const newOtpDigits = [...otpDigits];

    for (let i = 0; i < pastedData.length && i < otpDigits.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtpDigits[i] = pastedData[i];
      }
    }
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

    // Clear error when pasting OTP
    if (errorMessage) {
      setErrorMessage("");
    }

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtpDigits.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? otpDigits.length - 1 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };

  const handleSendOtp = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/password-otp`,
        { email },
        { withCredentials: true }
      );
      console.log(res);
      setStep(2);
    } catch (error) {
      console.log("error in sending otp : ", error);

      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Invalid email ID");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(res);
      setStep(3);
    } catch (error) {
      console.log("error in verification of otp : ", error);

      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Incorrect OTP");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordError("");
    setErrorMessage("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // (Optional) Basic password policy: at least 6 chars, letters + numbers
    const hasLength = password.length >= 6;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLength || !hasLetter || !hasNumber) {
      setPasswordError("Password must be at least 6 characters and include letters and numbers");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, password },
        { withCredentials: true }
      );
      console.log(res);
      navigate("/login");
    } catch (error) {
      console.log("error in reset password : ", error);

      if (error.response) {
        setErrorMessage("Failed to reset password. Please try again.");
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user starts typing in email field
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Clear error when user starts typing in confirm password field
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
  };

  // Check if all OTP digits are filled
  const isOtpComplete = otpDigits.every((digit) => digit !== "");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, var(--bg), #ffffff 40%)" }}>
      <div
        className="bg-white w-full rounded-xl shadow-lg max-w-md p-8"
        style={{
          border: "1px solid rgba(15,15,15,0.03)",
          boxShadow: "var(--shadow)",
          borderRadius: "12px",
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="cursor-pointer"
            onClick={() => navigate("/login")}
            style={{ color: "var(--primary-600)" }}
          />
          <h1 className="text-2xl font-bold text-center" style={{ color: "var(--primary-600)" }}>
            Forgot Password
          </h1>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
            <p style={{ color: "#b91c1c", fontSize: "0.95rem" }}>{errorMessage}</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-1" style={{ color: "var(--muted)" }}>
                Email
              </label>
              <input
                onChange={handleEmailChange}
                value={email}
                type="email"
                className="w-full rounded-lg px-3 py-2 transition-colors"
                placeholder="Enter your Email"
                required
                style={{
                  border: errorMessage ? "1px solid #fca5a5" : "1px solid rgba(15,15,15,0.06)",
                  boxShadow: errorMessage ? "none" : "0 6px 18px rgba(91,43,214,0.08)",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.border = "1px solid var(--primary-300)")}
                onBlur={(e) => (e.currentTarget.style.border = errorMessage ? "1px solid #fca5a5" : "1px solid rgba(15,15,15,0.06)")}
              />
            </div>

            <button
              className="w-full mt-4 rounded-lg px-4 py-2 transition duration-200 text-white"
              onClick={handleSendOtp}
              disabled={isLoading}
              style={{
                background: isLoading ? "linear-gradient(90deg, rgba(91,43,214,0.45), rgba(123,88,255,0.45))" : "linear-gradient(90deg, var(--primary), var(--accent))",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 14px rgba(91,43,214,0.08)",
                border: "none",
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 8 }}></div>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-4">
              <label htmlFor="otp" className="block font-medium mb-2" style={{ color: "var(--muted)" }}>
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-12 text-center text-xl font-semibold rounded-lg transition-colors"
                    maxLength="1"
                    inputMode="numeric"
                    pattern="\d*"
                    style={{
                      border: errorMessage ? "2px solid rgba(220,38,38,0.4)" : "2px solid rgba(15,15,15,0.06)",
                      boxShadow: errorMessage ? "none" : "0 6px 18px rgba(91,43,214,0.04)",
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              className="w-full mt-4 rounded-lg px-4 py-2 transition duration-200 text-white"
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading}
              style={{
                background: !isOtpComplete || isLoading ? "linear-gradient(90deg, rgba(91,43,214,0.35), rgba(123,88,255,0.35))" : "linear-gradient(90deg, var(--primary), var(--accent))",
                cursor: !isOtpComplete || isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 14px rgba(91,43,214,0.08)",
                border: "none",
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 8 }}></div>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block font-medium mb-1" style={{ color: "var(--muted)" }}>
                New Password
              </label>
              <div className="relative mb-4">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={`${showPassword ? "text" : "password"}`}
                  className="w-full rounded-lg px-3 py-2"
                  placeholder="Enter new password"
                  required
                  style={{
                    border: "1px solid rgba(15,15,15,0.06)",
                    boxShadow: "0 6px 18px rgba(91,43,214,0.04)",
                  }}
                />

                <button
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                  style={{ background: "transparent", border: "none", color: "var(--muted)" }}
                >
                  {!showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                </button>
              </div>

              <label htmlFor="confirmPassword" className="block font-medium mb-1" style={{ color: "var(--muted)" }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  type={"password"}
                  className="w-full rounded-lg px-3 py-2"
                  placeholder="confirm your password"
                  required
                  style={{
                    border: passwordError ? "1px solid #f87171" : "1px solid rgba(15,15,15,0.06)",
                    boxShadow: "0 6px 18px rgba(91,43,214,0.04)",
                  }}
                />
              </div>
              {passwordError && (
                <p className="mt-1" style={{ color: "#b91c1c", fontSize: "0.95rem" }}>{passwordError}</p>
              )}
            </div>

            <button
              className="w-full mt-4 rounded-lg px-4 py-2 transition duration-200 text-white"
              onClick={handleResetPassword}
              disabled={isLoading}
              style={{
                background: isLoading ? "linear-gradient(90deg, rgba(91,43,214,0.45), rgba(123,88,255,0.45))" : "linear-gradient(90deg, var(--primary), var(--accent))",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 14px rgba(91,43,214,0.08)",
                border: "none",
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 8 }}></div>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
