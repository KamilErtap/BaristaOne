const Order = require('../models/Order');

const getSummaryReportService = async () => {
  const orders = await Order.find({})
    .populate('customer', 'name email role')
    .populate('items.menuItem', 'name category price image')
    .sort({ createdAt: -1 });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const statusCounts = {
    received: orders.filter((o) => o.orderStatus === 'received').length,
    preparing: orders.filter((o) => o.orderStatus === 'preparing').length,
    ready: orders.filter((o) => o.orderStatus === 'ready').length,
    delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
  };

  const productMap = {};
  const categoryMap = {};
  const tableMap = {};

  for (const order of orders) {
    tableMap[order.tableNumber] = (tableMap[order.tableNumber] || 0) + 1;

    for (const item of order.items || []) {
      const productName = item.name || 'Bilinmeyen Ürün';
      const quantity = item.quantity || 0;
      const revenue = (item.price || 0) * quantity;
      const category = item.menuItem?.category || 'Diğer';

      if (!productMap[productName]) {
        productMap[productName] = {
          name: productName,
          quantity: 0,
          revenue: 0,
        };
      }

      productMap[productName].quantity += quantity;
      productMap[productName].revenue += revenue;

      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          quantity: 0,
          revenue: 0,
        };
      }

      categoryMap[category].quantity += quantity;
      categoryMap[category].revenue += revenue;
    }
  }

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const categoryBreakdown = Object.values(categoryMap)
    .sort((a, b) => b.quantity - a.quantity);

  const tableBreakdown = Object.entries(tableMap)
    .map(([tableNumber, orderCount]) => ({
      tableNumber: Number(tableNumber),
      orderCount,
    }))
    .sort((a, b) => b.orderCount - a.orderCount);

  const recentOrders = orders.slice(0, 5).map((order) => ({
    _id: order._id,
    tableNumber: order.tableNumber,
    totalPrice: order.totalPrice,
    orderStatus: order.orderStatus,
    customer: order.customer
      ? {
          name: order.customer.name,
          email: order.customer.email,
        }
      : null,
    createdAt: order.createdAt,
  }));

  return {
    summary: {
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0,
      activeOrders: totalOrders - statusCounts.delivered,
      statusCounts,
    },
    topProducts,
    categoryBreakdown,
    tableBreakdown,
    recentOrders,
  };
};

module.exports = {
  getSummaryReportService,
};