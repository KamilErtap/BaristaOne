import api from './axios';

export const reportApi = {
  getSummary: () => {
    return api.get('/reports/summary');
  },
};