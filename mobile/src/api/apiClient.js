import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://barista-one-api.vercel.app/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const storedUser = await AsyncStorage.getItem('userInfo');

  if (storedUser) {
    const userInfo = JSON.parse(storedUser);

    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }

  return config;
});

export default apiClient;