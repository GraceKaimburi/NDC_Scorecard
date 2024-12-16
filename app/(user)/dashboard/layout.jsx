"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardProvider } from "@/store/DashboardContext";
import { getRefreshToken, removeTokens } from "@/utils/access-token";

function Layout({ children }) {
  const router = useRouter();

  const refreshToken = getRefreshToken();

  const [timeLeftToExpire, setTimeLeftToExpire] = useState(0);
  const [isRefreshTokenValid, setIsRefreshTokenValid] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const warningThreshold = 5 * 60; // 5 minutes in seconds
  const [timerInterval] = useState(1000);

  const refreshExpiry = useMemo(() => {
    if (refreshToken) {
      const decoded = jwtDecode(refreshToken);
      return decoded.exp;
    }
    return null;
  }, [refreshToken]);

  useEffect(() => {
    if (refreshExpiry) {
      const now = Math.floor(Date.now() / 1000);
      if (refreshExpiry > now) {
        setIsRefreshTokenValid(true);
        const timeLeft = refreshExpiry - now;
        setTimeLeftToExpire(timeLeft);
      } else {
        setIsRefreshTokenValid(false);
        removeTokens();
        router.push("/login");
      }
    }
  }, [refreshExpiry, router]);

  useEffect(() => {
    if (timeLeftToExpire > 0) {
      const timerId = setInterval(() => {
        setTimeLeftToExpire((prev) => prev - 1);
      }, timerInterval);

      if (timeLeftToExpire <= warningThreshold && !showSessionWarning) {
        setShowSessionWarning(true); // Show the warning when time left is below threshold
      }

      return () => clearInterval(timerId);
    }
  }, [timeLeftToExpire, timerInterval, showSessionWarning, warningThreshold]);

  if (!isRefreshTokenValid) {
    return null; // Prevent rendering if the refresh token is invalid
  }

  return (

    <DashboardProvider>

        {children}

    </DashboardProvider>
  );
}

export default Layout;
