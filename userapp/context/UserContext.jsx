import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      logout()
    } catch (e) {
      console.error('restoreSession error:', e);
      logout()
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const { token: t, user: u } = res.data;
    await AsyncStorage.setItem('token', t);
    await AsyncStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (username, phone, email, password) => {
    const res = await api.post('/users/register', {
      username,
      phone,
      email,
      password,
      role: 'user',
    });
    const { token: t, user: u } = res.data;
    await AsyncStorage.setItem('token', t);
    await AsyncStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      const updated = res.data;
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch (e) {
      logout()
      console.error('refreshProfile error:', e);
    }
  };

  const updateProfile = async (userId, data) => {
    const res = await api.put(`/users/profile/${userId}`, data);
    const updated = res.data.user;
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };


  useEffect(() => {
    refreshProfile()
  }, [])
  return (
    <UserContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile, updateProfile, restoreSession }}>
      {children}
    </UserContext.Provider>
  );
};
