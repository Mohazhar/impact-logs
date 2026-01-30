import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await authAPI.getMe();
      // Expecting { id, email, name, role }
      setProfile(userData);
      setUser({ id: userData.id, email: userData.email, role: userData.role });
    } catch (error) {
      console.error('Error fetching user:', error);
      // Only remove token if the error is an Auth failure (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const data = await authAPI.signup(email, password, name);
      // Backend returns { token, user: { id, email, name, role } }
      localStorage.setItem('token', data.token);
      setProfile(data.user);
      setUser({ id: data.user.id, email: data.user.email, role: data.user.role });
      return data;
    } catch (error) {
      console.error('Signup error in Context:', error);
      throw error; // Rethrow so the UI can show the toast
    }
  };

  const signIn = async (email, password) => {
    try {
      // Ensure the request is sent as a POST to /api/auth/login
      const data = await authAPI.login(email, password);
      
      // Store token and update state
      localStorage.setItem('token', data.token);
      setProfile(data.user);
      setUser({ id: data.user.id, email: data.user.email, role: data.user.role });
      
      return data;
    } catch (error) {
      console.error('SignIn error in Context:', error);
      throw error; // Rethrow to trigger the catch block in LoginPage.js
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser: fetchCurrentUser // Added so you can manually refresh user data
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};