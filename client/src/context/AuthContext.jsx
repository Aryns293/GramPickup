import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

// VITE_API_URL is baked in at build time — must be set in Vercel env vars before deploy.
// Fallback to Render backend URL if the env var was missing during build.
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://grampickup-backend-6he0.onrender.com/api'
    : 'http://localhost:5001/api');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = user?.token;

  // Load user data on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('grampickup_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_e) {
        localStorage.removeItem('grampickup_user');
      }
    }
    setLoading(false);
  }, []);

  // Logout action
  const logout = useCallback(() => {
    localStorage.removeItem('grampickup_user');
    setUser(null);
  }, []);

  // Standard API call helper
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle unauthorized session expiration
        if (response.status === 401) {
          logout();
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error(`API Fetch Error [${endpoint}]:`, error);
      throw error;
    }
  }, [authToken, logout]);

  // Login action
  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('grampickup_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.error('Login action error:', error);
      throw error;
    }
  }, []);

  // Register action
  const register = useCallback(async (name, email, phone, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('grampickup_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.error('Register action error:', error);
      throw error;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const data = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      // Update cached user data but retain role/shop if applicable
      const updatedUser = {
        ...user,
        ...data,
      };
      localStorage.setItem('grampickup_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [apiFetch, user]);

  // Sync shop registration in user context (for shopkeeper flow)
  const syncShopContext = useCallback((shopData) => {
    const updatedUser = {
      ...user,
      shop: shopData,
    };
    localStorage.setItem('grampickup_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    apiFetch,
    updateProfile,
    syncShopContext,
  }), [user, loading, login, register, logout, apiFetch, updateProfile, syncShopContext]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
