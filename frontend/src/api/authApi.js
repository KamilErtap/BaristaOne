import api from './axios';

export const authApi = {
  register: (formData) => {
    return api.post('/auth/register', formData);
  },

  login: (formData) => {
    return api.post('/auth/login', formData);
  },

  getMe: () => {
    return api.get('/auth/me');
  },
};