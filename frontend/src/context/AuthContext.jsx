import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { getAuthPayload } from '../api/responseHelpers';

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
        const response = await authApi.getMe();

        const responseData = getAuthPayload(response);
        const currentUser = responseData.user || responseData;

        const updatedUser = {
          token: userInfo.token,
          user: currentUser,
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

  const login = (responseOrPayload) => {
    const payloadData = responseOrPayload?.data
      ? getAuthPayload(responseOrPayload)
      : responseOrPayload?.data || responseOrPayload;

    const payload = {
      token: payloadData.token,
      user: payloadData.user,
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