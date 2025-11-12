"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Note: This AuthContext is deprecated. Use Clerk's useAuth hook instead.
// Keeping minimal functionality for backward compatibility.

interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.warn('AuthContext is deprecated. Please use Clerk useAuth hook instead.');
    // Initialize auth state from stored token
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (storedToken) {
      setTokenState(storedToken);
      // You might want to validate the token with your API here
      // and fetch user data
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    console.warn('AuthContext login is deprecated. Use Clerk signIn instead.');
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken);
    }
    setTokenState(newToken);
    setUser(userData);
  };

  const logout = () => {
    console.warn('AuthContext logout is deprecated. Use Clerk signOut instead.');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    setTokenState(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login or show login form
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this page.</p>
            <button 
              onClick={() => window.location.href = '/sign-in'}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}