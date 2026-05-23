import apiClient from './apiClient';

export const tableApi = {
  getTableByCode: (tableCode) => apiClient.get(`/tables/code/${tableCode}`),
};