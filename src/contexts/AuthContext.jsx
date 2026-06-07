import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'https://web-production-189e9.up.railway.app';

// Keys used in localStorage. upload.js reads 'access_token' directly,
// so that exact key must hold the JWT.
const TOKEN_KEY = 'access_token';
const USER_KEY = 'clipgen_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore any saved session from localStorage.
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken) {
        setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Corrupt storage — clear it so the app still loads.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist a successful auth response.
  const persistSession = (accessToken, userObj) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    setToken(accessToken);
    setUser(userObj);
  };

  // Shared request handler for login/register.
  const authRequest = async (path, body) => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (networkErr) {
      throw new Error('Cannot reach the server. Check your connection and try again.');
    }

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      // Non-JSON response (rare) — fall through to generic error below.
    }

    if (!res.ok) {
      const detail = data && data.detail ? data.detail : `Request failed (${res.status})`;
      throw new Error(detail);
    }
    if (!data || !data.access_token) {
      throw new Error('Unexpected response from server. Please try again.');
    }
    return data;
  };

  const signin = async (email, password) => {
    const data = await authRequest('/auth/login', { email, password });
    persistSession(data.access_token, data.user);
    return data.user;
  };

  const signup = async (email, password, full_name) => {
    const data = await authRequest('/auth/register', {
      email,
      password,
      full_name,
    });
    persistSession(data.access_token, data.user);
    return data.user;
  };

  const signout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // Used across the app for authenticated fetches.
  const getAuthHeader = () => {
    const t = token || localStorage.getItem(TOKEN_KEY);
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const value = {
    user,
    token,
    loading,
    signup,
    signin,
    signout,
    getAuthHeader,
    isAuthenticated: !!token,
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
