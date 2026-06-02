import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const demoUser = {
    id: 1,
    full_name: "Admin",
    email: "admin@clipgenai.com",
    plan_type: "premium"
  };

  const value = {
    user: demoUser,
    token: "demo-token",
    loading: false,
    signup: async () => {},
    signin: async () => {},
    signout: () => {},
    getAuthHeader: () => ({}),
    isAuthenticated: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
