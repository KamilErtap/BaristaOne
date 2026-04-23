import api from './axios';

export const orderApi = {
  createOrder: ({ cart, tableNumber }) => {
    return api.post('/orders', {
      items: cart.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      })),
      tableNumber: Number(tableNumber),
      paymentStatus: 'paid',
    });
  },

  getMyOrders: (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.status) query.append('status', filters.status);
    if (filters.sort) query.append('sort', filters.sort);
    if (filters.tableNumber) query.append('tableNumber', filters.tableNumber);

    return api.get(`/orders/my-orders?${query.toString()}`);
  },

  getAllOrders: (filters = {}) => {
    const query = new URLSearchParams();

    if (filters.status) query.append('status', filters.status);
    if (filters.paymentStatus) query.append('paymentStatus', filters.paymentStatus);
    if (filters.sort) query.append('sort', filters.sort);
    if (filters.tableNumber) query.append('tableNumber', filters.tableNumber);

    return api.get(`/orders?${query.toString()}`);
  },

  updateOrderStatus: (orderId, orderStatus) => {
    return api.put(`/orders/${orderId}/status`, {
      orderStatus,
    });
  },
};