import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { getAuthPayload } from '../api/responseHelpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('userInfo');

      if (!stored) {
        setUserInfo(null);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!parsed?.token) {
        setUserInfo(null);
        return;
      }

      const response = await authApi.getMe();
      const responseData = getAuthPayload(response);
      const currentUser = responseData.user || responseData;

      const nextUserInfo = {
        token: parsed.token,
        user: currentUser,
      };

      setUserInfo(nextUserInfo);
      await AsyncStorage.setItem('userInfo', JSON.stringify(nextUserInfo));
    } catch (error) {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (responseOrPayload) => {
    const payloadData = responseOrPayload?.data
      ? getAuthPayload(responseOrPayload)
      : responseOrPayload?.data || responseOrPayload;

    const payload = {
      token: payloadData.token,
      user: payloadData.user,
    };

    setUserInfo(payload);
    await AsyncStorage.setItem('userInfo', JSON.stringify(payload));
  };

  const logout = async () => {
    setUserInfo(null);
    await AsyncStorage.removeItem('userInfo');
  };

  const value = useMemo(
    () => ({
      userInfo,
      loading,
      login,
      logout,
      reloadUser: loadUser,
    }),
    [userInfo, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);