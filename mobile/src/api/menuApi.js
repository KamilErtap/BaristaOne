import apiClient from './apiClient';

export const menuApi = {
  getMenuItems: (params = {}) => apiClient.get('/menu', { params }),
  getMenuItemById: (id) => apiClient.get(`/menu/${id}`),
  getCategories: () => apiClient.get('/menu/categories'),
};