import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../../shared/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('erp_user');
    const token = localStorage.getItem('erp_access_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (mobile, password) => {
    try {
      const response = await apiClient.post('/auth/login', { mobile, password });
      
      const { accessToken, user: userData } = response.data;
      
      localStorage.setItem('erp_access_token', accessToken);
      localStorage.setItem('erp_user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('erp_access_token');
    localStorage.removeItem('erp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
