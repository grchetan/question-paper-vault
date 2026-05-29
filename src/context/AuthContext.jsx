import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real Firebase / Mock Auth state changes
    const unsubscribe = authService.onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.signInWithEmail(email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email, password, displayName) => {
    setLoading(true);
    try {
      const user = await authService.signUpWithEmail(email, password, displayName);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOutUser();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email) => {
    await authService.sendPasswordReset(email);
  };

  const value = {
    currentUser,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    sendPasswordReset,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
