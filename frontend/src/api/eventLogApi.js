import api from './axios';

export const eventLogApi = {
  getEventLogs: (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.eventType) query.append('eventType', filters.eventType);
    if (filters.orderId) query.append('orderId', filters.orderId);
    if (filters.tableNumber) query.append('tableNumber', filters.tableNumber);
    if (filters.sort) query.append('sort', filters.sort);

    return api.get(`/event-logs?${query.toString()}`);
  },
};