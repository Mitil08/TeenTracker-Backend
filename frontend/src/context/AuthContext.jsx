import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('expense-tracker-token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data.user);
      } catch (error) {
        localStorage.removeItem('expense-tracker-token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token: newToken, user: userData } = response.data.data;
    localStorage.setItem('expense-tracker-token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const register = async (payload) => {
    const response = await axios.post(`${API_URL}/auth/register`, payload);
    const { token: newToken, user: userData } = response.data.data;
    localStorage.setItem('expense-tracker-token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('expense-tracker-token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
