"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { login as apiLogin } from '@/api/authService'; // Assuming login API service

// Define the shape of the user object and context
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'company' | 'individual'; // Add other roles as needed
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserContext: (userData: User, accToken: string, refToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user data from cookies on initial load
    const storedUser = Cookies.get('userInfo');
    const storedAccessToken = Cookies.get('accessToken');
    const storedRefreshToken = Cookies.get('refreshToken');

    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      } catch (error) {
        console.error("Failed to parse user info from cookies:", error);
        // Clear corrupted cookies
        Cookies.remove('userInfo');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      }
    }
    setIsLoading(false);
  }, []);

  const updateUserContext = (userData: User, accToken: string, refToken: string) => {
    setUser(userData);
    setAccessToken(accToken);
    setRefreshToken(refToken);

    Cookies.set('userInfo', JSON.stringify(userData), { secure: true, httpOnly: false });
    Cookies.set('accessToken', accToken, { secure: true, httpOnly: false });
    Cookies.set('refreshToken', refToken, { secure: true, httpOnly: false });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      const { user: loggedInUser, accessToken: newAccessToken, refreshToken: newRefreshToken } = response;
      // Assuming the API returns user role, if not, you might need to fetch it or determine it
      const userWithRole: User = {
        ...loggedInUser,
        role: loggedInUser.role || (loggedInUser.email.includes('admin') ? 'admin' : 'company'), // Example role assignment
      };
      updateUserContext(userWithRole, newAccessToken, newRefreshToken);
      window.location.href = '/dashboard'; // Or use Next.js router for navigation
    } catch (error) {
      console.error('Login failed in UserProvider:', error);
      throw error; // Re-throw to be caught by the calling component (e.g., LoginForm)
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    Cookies.remove('userInfo');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    window.location.href = '/authentication/login'; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, isLoading, login, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};