import api from './axios';

export const menuApi = {
  getMenuItems: (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.search) query.append('search', filters.search);
    if (filters.category) query.append('category', filters.category);
    if (filters.sort) query.append('sort', filters.sort);
    if (filters.available !== undefined && filters.available !== '') {
      query.append('available', filters.available);
    }

    return api.get(`/menu?${query.toString()}`);
  },

  getCategories: () => {
    return api.get('/menu/categories');
  },

  getMenuItemById: (id) => {
    return api.get(`/menu/${id}`);
  },

  createMenuItem: (formData) => {
    return api.post('/menu', {
      ...formData,
      price: Number(formData.price),
    });
  },

  updateMenuItem: (id, formData) => {
    return api.put(`/menu/${id}`, {
      ...formData,
      price: Number(formData.price),
    });
  },

  deleteMenuItem: (id) => {
    return api.delete(`/menu/${id}`);
  },
};