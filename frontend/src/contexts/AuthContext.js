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
    // Check for existing token and fetch user
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
      setProfile(userData);
      setUser({ id: userData.id, email: userData.email });
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    const data = await authAPI.signup(email, password, name);
    localStorage.setItem('token', data.token);
    setProfile(data.user);
    setUser({ id: data.user.id, email: data.user.email });
    return data;
  };

  const signIn = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.token);
    setProfile(data.user);
    setUser({ id: data.user.id, email: data.user.email });
    return data;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};