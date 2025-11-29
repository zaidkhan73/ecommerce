/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../hooks/useAuth";


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const {login} = useAuth()

const handleSignIn = async () => {
  setErrorMessage("");
  setIsLoading(true);

  try {
    const res = await axios.post(
      `${serverUrl}/api/auth/signin`,
      { email, password },
      { withCredentials: true }
    );

    if (res.data.success) {
      login(res.data.user); // Update auth state
      return navigate("/"); // STOP execution after navigate
    }

  } catch (error) {
    console.log("error: ", error);

    if (error.response?.status === 400) {
      setErrorMessage("Invalid Email or password");
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-bg w-full flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-lg max-w-md p-8 border border-[rgba(15,15,15,0.06)]">
        <h1 className="text-3xl font-bold mb-2 text-primary-600">Agnishikha</h1>
        <p className="text-muted mb-8">Sign In to your account to get started</p>

        {/* Error */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
              errorMessage
                ? "border-red-300 focus:border-red-500"
                : "border-[rgba(15,15,15,0.2)] focus:border-primary-300"
            }`}
            placeholder="Enter your Email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <div className="relative mb-2">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                errorMessage
                  ? "border-red-300 focus:border-red-500"
                  : "border-[rgba(15,15,15,0.2)] focus:border-primary-300"
              }`}
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="absolute right-3 top-3 text-muted cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </button>
          </div>

          <div
            className="text-sm font-medium text-primary cursor-pointer text-right"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </div>
        </div>

        {/* Button */}
        <button
          className={`w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer ${
            isLoading
              ? "bg-primary-300 cursor-not-allowed"
              : "bg-primary hover:bg-primary-600"
          }`}
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} /> : "Sign In"}
        </button>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
