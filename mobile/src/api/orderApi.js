import apiClient from './apiClient';

const buildOrderPayload = ({ cart, tableNumber }) => {
  return {
    items: cart.map((item) => ({
      menuItem: item._id,
      quantity: Number(item.quantity) || 1,
    })),
    tableNumber: Number(tableNumber),
    paymentStatus: 'paid',
  };
};

export const orderApi = {
  createOrder: ({ cart, tableNumber }) => {
    const payload = buildOrderPayload({ cart, tableNumber });
    return apiClient.post('/orders', payload);
  },

  getMyOrders: (params = {}) => apiClient.get('/orders/my-orders', { params }),

  getAllOrders: (params = {}) => apiClient.get('/orders', { params }),

  updateOrderStatus: (orderId, orderStatus) =>
    apiClient.put(`/orders/${orderId}/status`, { orderStatus }),
};