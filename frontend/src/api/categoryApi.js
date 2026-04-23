import api from './axios';

export const categoryApi = {
  getCategories: (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.search) query.append('search', filters.search);
    if (filters.sort) query.append('sort', filters.sort);
    if (filters.isActive !== undefined && filters.isActive !== '') {
      query.append('isActive', filters.isActive);
    }

    return api.get(`/categories?${query.toString()}`);
  },

  getCategoryById: (id) => {
    return api.get(`/categories/${id}`);
  },

  createCategory: (formData) => {
    return api.post('/categories', formData);
  },

  updateCategory: (id, formData) => {
    return api.put(`/categories/${id}`, formData);
  },

  deleteCategory: (id) => {
    return api.delete(`/categories/${id}`);
  },
};