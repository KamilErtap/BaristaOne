const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const validate = require('../middleware/validateMiddleware');

const {
  createOrderValidator,
  updateOrderStatusValidator,
} = require('../validators/orderValidator');

router.post('/', protect, createOrderValidator, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);

router.get(
  '/',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER, ROLES.KITCHEN, ROLES.WAITER),
  getAllOrders
);

router.put(
  '/:id/status',
  protect,
  allowRoles(ROLES.ADMIN, ROLES.OWNER, ROLES.KITCHEN, ROLES.WAITER),
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);

module.exports = router;