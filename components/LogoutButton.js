"use client";

import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm text-nowrap"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;