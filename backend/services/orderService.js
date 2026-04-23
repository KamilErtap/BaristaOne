const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const buildOrderSort = (sort) => {
  let sortOption = { createdAt: -1 };

  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'price_asc') sortOption = { totalPrice: 1 };
  if (sort === 'price_desc') sortOption = { totalPrice: -1 };
  if (sort === 'table_asc') sortOption = { tableNumber: 1 };
  if (sort === 'table_desc') sortOption = { tableNumber: -1 };

  return sortOption;
};

const populateOrderQuery = (query) => {
  return query
    .populate('customer', 'name email role')
    .populate('items.menuItem', 'name category price image');
};

const getOrderOrThrow = async (id) => {
  const order = await Order.findById(id);

  if (!order) {
    const error = new Error('Sipariş bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

const createOrderService = async ({ items, tableNumber, paymentStatus, customerId }) => {
  if (paymentStatus !== 'paid') {
    const error = new Error('Sipariş ancak ödeme yapıldıktan sonra oluşturulabilir');
    error.statusCode = 400;
    throw error;
  }

  const builtItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItem);

    if (!menuItem) {
      const error = new Error('Siparişteki ürünlerden biri bulunamadı');
      error.statusCode = 404;
      throw error;
    }

    if (!menuItem.isAvailable) {
      const error = new Error(`${menuItem.name} şu anda müsait değil`);
      error.statusCode = 400;
      throw error;
    }

    const quantity = Number(item.quantity) || 1;
    const itemTotal = menuItem.price * quantity;

    totalPrice += itemTotal;

    builtItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity,
      price: menuItem.price,
    });
  }

  const order = await Order.create({
    customer: customerId,
    items: builtItems,
    tableNumber,
    totalPrice,
    paymentStatus: 'paid',
    orderStatus: 'received',
  });

  const populatedOrder = await populateOrderQuery(Order.findById(order._id));
  return populatedOrder;
};

const getMyOrdersService = async ({ customerId, query }) => {
  const { status, sort, tableNumber } = query;

  const filter = {
    customer: customerId,
  };

  if (status) {
    filter.orderStatus = status;
  }

  if (tableNumber) {
    filter.tableNumber = Number(tableNumber);
  }

  const sortOption = buildOrderSort(sort);

  const orders = await populateOrderQuery(
    Order.find(filter).sort(sortOption)
  );

  return orders;
};

const getAllOrdersService = async (query) => {
  const { status, paymentStatus, sort, tableNumber } = query;

  const filter = {};

  if (status) {
    filter.orderStatus = status;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (tableNumber) {
    filter.tableNumber = Number(tableNumber);
  }

  const sortOption = buildOrderSort(sort);

  const orders = await populateOrderQuery(
    Order.find(filter).sort(sortOption)
  );

  return orders;
};

const updateOrderStatusService = async (id, orderStatus) => {
  const order = await getOrderOrThrow(id);

  order.orderStatus = orderStatus;
  await order.save();

  const updatedOrder = await populateOrderQuery(
    Order.findById(order._id)
  );

  return updatedOrder;
};

module.exports = {
  createOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
  getOrderOrThrow,
};