const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const validate = require('../middleware/validateMiddleware');

const {
  createOrderValidator,
  updateOrderStatusValidator,
} = require('../validators/orderValidator');

router.post('/', protect, createOrderValidator, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatusValidator, validate, updateOrderStatus);

module.exports = router;