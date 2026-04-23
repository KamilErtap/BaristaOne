import api from './axios';

export const tableApi = {
  getTables: (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.search) query.append('search', filters.search);
    if (filters.sort) query.append('sort', filters.sort);
    if (filters.isActive !== undefined && filters.isActive !== '') {
      query.append('isActive', filters.isActive);
    }

    return api.get(`/tables?${query.toString()}`);
  },

  getTableByCode: (code) => {
    return api.get(`/tables/code/${code}`);
  },

  getTableById: (id) => {
    return api.get(`/tables/${id}`);
  },

  createTable: (formData) => {
    return api.post('/tables', {
      ...formData,
      number: Number(formData.number),
      capacity: Number(formData.capacity),
    });
  },

  updateTable: (id, formData) => {
    return api.put(`/tables/${id}`, {
      ...formData,
      number: Number(formData.number),
      capacity: Number(formData.capacity),
    });
  },

  deleteTable: (id) => {
    return api.delete(`/tables/${id}`);
  },
};