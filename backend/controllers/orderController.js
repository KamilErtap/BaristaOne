const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const {
  createOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
} = require('../services/orderService');

const createOrder = asyncHandler(async (req, res) => {
  const order = await createOrderService({
    items: req.body.items,
    tableNumber: req.body.tableNumber,
    paymentStatus: req.body.paymentStatus,
    customerId: req.user._id,
  });

  return sendSuccess(res, 201, 'Sipariş başarıyla oluşturuldu', {
    order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getMyOrdersService({
    customerId: req.user._id,
    query: req.query,
  });

  return sendSuccess(res, 200, 'Kullanıcının siparişleri getirildi', {
    orders,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrdersService(req.query);

  return sendSuccess(res, 200, 'Tüm siparişler getirildi', {
    orders,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatusService(req.params.id, req.body.orderStatus);

  return sendSuccess(res, 200, 'Sipariş durumu güncellendi', {
    order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};