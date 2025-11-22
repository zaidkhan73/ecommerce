import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const admin_email = import.meta.env.VITE_ADMIN_EMAIL;
    const admin_password = import.meta.env.VITE_ADMIN_PASSWORD;

    if (email !== admin_email || password !== admin_password) {
      setErrorMsg("Invalid credentials");
      return;
    }

    // If credentials are correct
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8">

        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-6">
          <img src="public/logo.jpg" alt="" height={100} width={100} />

          <h1 className="mt-4 text-2xl font-semibold text-purple-700">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Please login to your account
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p className="text-red-600 text-center mb-3 text-sm">{errorMsg}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
