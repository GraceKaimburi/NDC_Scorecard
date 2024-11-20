"use client";

import { useAuth } from "./components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthMiddleware = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    if (!loading && !isAuthenticated) {
      // Redirect the user to the login page if not authenticated
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    // Show a loading state while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Prevent the protected content from being rendered if not authenticated
    return null;
  }

  // Render the protected content if the user is authenticated
  return children;
};

export default AuthMiddleware;