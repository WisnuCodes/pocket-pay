import { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';
import { authApi, walletApi } from '../api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // If there's no saved token, loading is already complete
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('auth_token')));

  useEffect(() => {
    let ignore = false;

    const verifySession = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (!savedToken) return;

      try {
        const response = await authApi.getUser();
        if (!ignore) {
          const userData = response.data || response;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch {
        try {
          await walletApi.getBalance();
          if (!ignore) {
            setUser((prev) => prev || { name: 'Pengguna MiniWallet', email: '' });
          }
        } catch {
          if (!ignore) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      ignore = true;
    };
  }, []);

  // Listen for global unauthorized events dispatched by API response interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const payload = response.data || {};
    const receivedToken = payload.access_token;
    const receivedUser = payload.user;

    if (receivedToken) {
      localStorage.setItem('auth_token', receivedToken);
      setToken(receivedToken);
    }

    if (receivedUser) {
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setUser(receivedUser);
    } else {
      const fallbackUser = { email };
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }

    return response;
  };

  const register = async (formData) => {
    const response = await authApi.register(formData);
    const payload = response.data || {};
    const receivedToken = payload.access_token;
    const receivedUser = payload.user;

    if (receivedToken) {
      localStorage.setItem('auth_token', receivedToken);
      setToken(receivedToken);
    }

    if (receivedUser) {
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setUser(receivedUser);
    } else {
      const fallbackUser = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
      };
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }

    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
