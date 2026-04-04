import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!userInfo?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');

        const updatedUser = {
          token: userInfo.token,
          user: data,
        };

        setUserInfo(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } catch (error) {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = (data) => {
    const payload = {
      token: data.token,
      user: data.user,
    };

    setUserInfo(payload);
    localStorage.setItem('userInfo', JSON.stringify(payload));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);