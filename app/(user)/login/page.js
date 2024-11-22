"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [token, setToken] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const res = await fetch("https://ndcbackend.agnesafrica.org/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token || "");
        setShowOtpInput(true);
        setResponseMessage("Please enter the OTP sent to your email.");
      } else if (res.status === 401) {
        setResponseMessage("Invalid email or password. Please try again.");
      } else if (res.status === 404) {
        setResponseMessage("No account found with this email. Please create an account.");
      } else {
        setResponseMessage(data.message || "Login failed. Please try again later.");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const res = await fetch("https://ndcbackend.agnesafrica.org/auth/verify_otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // Call the login function from auth context with the user data
        await login(data, data.access_token);
        setResponseMessage("Login successful! Redirecting...");
        router.push("/dashboard");
      } else if (res.status === 400 && data.message === "Invalid OTP.") {
        setResponseMessage("Invalid OTP. Please try again.");
      } else {
        setResponseMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      setResponseMessage("An error occurred during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {!showOtpInput ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg text-gray-700 bg-gray-50 focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg text-gray-700 bg-gray-50 focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
        ) : (
              <form onSubmit={handleOtpVerification}>
            <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded-lg text-gray-700 bg-gray-50 focus:ring focus:ring-blue-300"
        placeholder="Enter your email"
      />
    </div>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg text-gray-700 bg-gray-50 focus:ring focus:ring-blue-300"
                placeholder="Enter OTP"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp("");
                setResponseMessage("");
              }}
              className="w-full mt-2 px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 focus:ring focus:ring-blue-300"
            >
              Back to Login
            </button>
          </form>
        )}

        {responseMessage && (
          <div
            className={`mt-4 p-2 rounded-lg text-center ${
              responseMessage.includes("successful")
                ? "bg-green-100 text-green-700"
                : responseMessage.includes("Please enter the OTP")
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
