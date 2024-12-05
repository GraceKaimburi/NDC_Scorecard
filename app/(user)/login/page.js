"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Removed OTP and related states
  // const [otp, setOtp] = useState("");
  // const [showOtpInput, setShowOtpInput] = useState(false);
  // const [token, setToken] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const res = await fetch(
        "https://ndcbackend.agnesafrica.org/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      // console.log(`data returned by login endpoint: ${JSON.stringify(data)}`);

      if (res.ok) {
        // Directly call login and redirect without OTP
        await login(data, data.access_token);
        setResponseMessage("Login successful! Redirecting...");
        router.push("/dashboard");
      } else if (res.status === 401) {
        setResponseMessage("Invalid email or password. Please try again.");
      } else if (res.status === 404) {
        setResponseMessage(
          "No account found with this email. Please create an account."
        );
      } else {
        setResponseMessage(
          data.message || "Login failed. Please try again later."
        );
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Removed OTP verification logic
  // const handleOtpVerification = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setResponseMessage("");

  //   try {
  //     const res = await fetch(
  //       "https://ndcbackend.agnesafrica.org/auth/verify_otp/",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, otp }),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log(
  //       `data returned by verify_otp endpoint: ${JSON.stringify(data)}`
  //     );

  //     if (res.ok) {
  //       await login(data, data.access_token);
  //       setResponseMessage("Login successful! Redirecting...");
  //       router.push("/dashboard");
  //     } else if (res.status === 400 && data.message === "Invalid OTP.") {
  //       setResponseMessage("Invalid OTP. Please try again.");
  //     } else {
  //       setResponseMessage(data.message || "OTP verification failed.");
  //     }
  //   } catch (error) {
  //     setResponseMessage("An error occurred during OTP verification.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {/* Only the login form remains */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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

        {responseMessage && (
          <div
            className={`mt-4 p-2 rounded-lg text-center ${
              responseMessage.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {responseMessage}
          </div>
        )}
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
