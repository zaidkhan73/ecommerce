import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { useAuth } from "../context/AuthContext";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate()

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    try {
        e.preventDefault()
        const res = await axios.post(
            `${serverUrl}/api/auth/admin-login`,
            {
                email,
                password
            },
            {
                withCredentials: true
            }
        )
        console.log(res.data)
        setIsAuthenticated(true);
        navigate("/")
        
    } catch (error) {
        console.log(error)        
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">

        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-6">
          <img src="logo.jpg" alt="" height={100} width={100} />

          <h1 className="mt-4 text-2xl font-semibold text-purple-700">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Please login to your account
          </p>
        </div>

        {/* Error Message */}
        {/* {errorMsg && (
          <p className="text-red-600 text-center mb-3 text-sm">{errorMsg}</p>
        )} */}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
