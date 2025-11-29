import { useState, useRef } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

function Signup(){
const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");
  const otpRefs = useRef([]);


  const handleSendOtp = async () => {
    // Clear previous error message
    setErrorMessage("");

    // Client-side validation
    if (password.length < 6) {
      setErrorMessage("password must be atleast 6 characters long");
      return;
    }

    if (mobile.length !== 10) {
      setErrorMessage("mobile number must be 10 digits long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/email-otp`,
        { email , username: fullName },
        { withCredentials: true }
      );
      console.log(res);
      setStep(2);
    } catch (error) {
      console.log("error in sending otp : ", error);

      if (error.response?.data) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
        console.log("error : ",error)
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
      `${serverUrl}/api/auth/signup`,
      {
        username: fullName,
        email,
        password,
        phone:mobile,
        otp,   // ✅ OTP bhi bhejna hoga
      },
      { withCredentials: true }
    );

    console.log(res.data);
    navigate("/"); // ✅ Signup ke baad redirect
  } catch (error) {
    console.log("error in verifying otp : ", error);

    if (error.response?.data?.message) {
      setErrorMessage(error.response.data.message);
    } else if (error.request) {
      setErrorMessage("Network error. Please check your connection.");
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

    // Clear error when user starts typing OTP
    if (errorMessage) {
      setErrorMessage("");
    }

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
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
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtpDigits = [...otpDigits];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
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
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };


  const isOtpComplete = otpDigits.every(digit => digit !== "");
   return (
    <div className="min-h-screen bg-bg w-full flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-lg max-w-md p-8 boder border-[rgba(15,15,15,0.06)]">
        {step === 1 && (
          <>
            <h1 className={`text-3xl font-bold mb-2 text-primary-600`}>
              Agnishikha
            </h1>
            <p className="text-muted mb-8">
              Create your account to get started
            </p>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-medium mb-1"
              >
                Full Name
              </label>
              <input
                onChange={handleFullNameChange}
                value={fullName}
                type="text"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                  errorMessage
                    ? "border-red-300 focus:border-red-500"
                    : "border-neutral-400 focus:border-primary-900"
                }`}
                placeholder="Enter your full Name"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                onChange={handleEmailChange}
                value={email}
                type="email"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                  errorMessage
                    ? "border-red-300 focus:border-red-500"
                    : "border-neutral-400 focus:border-primary-900"
                }`}
                placeholder="Enter your Email"
                required
              />
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label
                htmlFor="mobile"
                className="block text-gray-700 font-medium mb-1"
              >
                Mobile No
              </label>
              <input
                onChange={handleMobileChange}
                value={mobile}
                type="tel"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                  errorMessage
                    ? "border-red-300 focus:border-red-500"
                    : "border-neutral-400 focus:border-primary-900"
                }`}
                placeholder="Enter your number"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  onChange={handlePasswordChange}
                  value={password}
                  type={`${showPassword ? "text" : "password"}`}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                    errorMessage
                      ? "border-red-300 focus:border-red-500"
                      : "border-neutral-400 focus:border-primary-900"
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                </button>
              </div>
            </div>

            <button
              className={`w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer ${
            isLoading
              ? "bg-primary-300 cursor-not-allowed"
              : "bg-primary hover:bg-primary-600"
          }`}
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ClipLoader size={20} />
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-center mt-6">
              Already have an Account ?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign In
              </span>
            </p>
          </>
        )}

{step === 2 && (
  <>
    <div className="flex flex-col items-center mb-6">
      <h1 className="text-2xl font-bold text-[var(--primary-600)]">
        Verify Your Email
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Enter the OTP sent to your email
      </p>
    </div>

    <div className="mb-4 w-full">
      <label
        htmlFor="otp"
        className="block text-gray-700 font-medium mb-2 text-center"
      >
        OTP Code
      </label>

      <div className="flex gap-3 justify-center">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            className={`w-12 h-12 text-center text-xl font-semibold rounded-xl outline-none transition-all bg-white shadow-sm
            ${errorMessage
              ? "border-2 border-red-400 focus:border-red-500"
              : "border border-neutral-300 focus:border-[var(--primary-300)] focus:shadow-[0_0_8px_var(--primary-300)]"
            }`}
            inputMode="numeric"
            pattern="\d*"
            maxLength="1"
          />
        ))}
      </div>
    </div>

    <button
      className={`w-full mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all text-white font-semibold shadow-md
        ${!isOtpComplete || isLoading
        ? "bg-[var(--primary-300)] cursor-not-allowed"
        : "bg-[var(--primary)] hover:bg-[var(--primary-600)] active:scale-[0.98]"
        }`}
      onClick={handleVerifyOtp}
      disabled={!isOtpComplete || isLoading}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Verifying...
        </>
      ) : (
        "Verify OTP"
      )}
    </button>
  </>
)}

      </div>
    </div>
  );
}


export default Signup
