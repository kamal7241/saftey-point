"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { login as apiLogin } from '@/api/authService';
import { UserWithRoles } from '@/types/roles.types';
import { 
  getPrimaryRole, 
  hasPermission, 
  hasRole, 
  hasAnyRole, 
  getUserRoles, 
  getUserPermissions,
  getResourcePermissions
} from '@/utils/roleUtils';

// Legacy User interface for backward compatibility
interface LegacyUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'company' | 'individual';
  // Add other user properties as needed
}

// Union type to support both old and new user structures
type User = UserWithRoles | LegacyUser;

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserContext: (userData: User, accToken: string, refToken: string) => void;
  // Role management functions
  hasPermission: (permissionKey: string) => boolean;
  hasRole: (roleKey: string) => boolean;
  hasAnyRole: (roleKeys: string[]) => boolean;
  getUserRoles: () => string[];
  getUserPermissions: () => string[];
  getPrimaryRole: () => string | null;
  getResourcePermissions: (resource: string) => {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canList: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

    // Set cookies with proper options
    Cookies.set('userInfo', JSON.stringify(userData), { 
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: false,
      sameSite: 'strict',
      path: '/'
    });
    Cookies.set('accessToken', accToken, { 
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: false,
      sameSite: 'strict',
      path: '/'
    });
    Cookies.set('refreshToken', refToken, { 
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: false,
      sameSite: 'strict',
      path: '/'
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('UserProvider - Starting login process');
      const response = await apiLogin(email, password);
      console.log('UserProvider - Login API response:', response);
      
      // Extract user and tokens from the expected response structure
      const { user: loggedInUser, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      
      console.log('UserProvider - Extracted tokens:', { 
        hasUser: !!loggedInUser, 
        hasAccessToken: !!newAccessToken, 
        hasRefreshToken: !!newRefreshToken 
      });
      
      if (!loggedInUser || !newAccessToken) {
        throw new Error('Invalid response structure from login API');
      }
      
      // Assuming the API returns user role, if not, you might need to fetch it or determine it
      const userWithRole: User = {
        ...loggedInUser,
        role: loggedInUser.role || (loggedInUser.email.includes('admin') ? 'admin' : 'company'), // Example role assignment
      };
      
      console.log('UserProvider - Setting user context and cookies');
      updateUserContext(userWithRole, newAccessToken, newRefreshToken);
      
      // Verify cookies are set
      const verifyAccessToken = Cookies.get('accessToken');
      console.log('UserProvider - Cookie verification - accessToken exists:', !!verifyAccessToken);
      
      // Add a small delay to ensure cookies are set before redirect
      setTimeout(() => {
        console.log('UserProvider - Redirecting to dashboard');
        router.push('/dashboard');
      }, 100);
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
    router.push('/authentication/login');
  };

  // Role management functions
  const hasPermissionFn = (permissionKey: string) => hasPermission(user as UserWithRoles, permissionKey);
  const hasRoleFn = (roleKey: string) => hasRole(user as UserWithRoles, roleKey);
  const hasAnyRoleFn = (roleKeys: string[]) => hasAnyRole(user as UserWithRoles, roleKeys);
  const getUserRolesFn = () => getUserRoles(user as UserWithRoles);
  const getUserPermissionsFn = () => getUserPermissions(user as UserWithRoles);
  const getPrimaryRoleFn = () => {
    const primaryRole = getPrimaryRole(user as UserWithRoles);
    // If no primary role is found, try to determine from user data
    if (!primaryRole && user) {
      // Check if user has legacy role property
      if ('role' in user && user.role) {
        return user.role;
      }
      // Check if user has roles array
      if ('roles' in user && user.roles && user.roles.length > 0) {
        return user.roles[0].role?.key || 'admin'; // Default to admin if no role key
      }
      // Default fallback
      return 'admin';
    }
    return primaryRole;
  };
  const getResourcePermissionsFn = (resource: string) => getResourcePermissions(user as UserWithRoles, resource);

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      refreshToken, 
      isLoading, 
      login, 
      logout, 
      updateUserContext,
      hasPermission: hasPermissionFn,
      hasRole: hasRoleFn,
      hasAnyRole: hasAnyRoleFn,
      getUserRoles: getUserRolesFn,
      getUserPermissions: getUserPermissionsFn,
      getPrimaryRole: getPrimaryRoleFn,
      getResourcePermissions: getResourcePermissionsFn,
    }}>
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