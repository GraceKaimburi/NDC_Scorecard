"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils/access-token';

// Create the auth context
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  loading: false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data when the app loads
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = getAccessToken();
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token) => {
    try {
      // Store the auth data
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('refreshToken', userData.refresh_token);
      
      // Update state
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('refreshToken');
    
    // Reset state
    setUser(null);
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};