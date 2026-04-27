const { body } = require('express-validator');
const { ORDER_STATUS_LIST } = require('../constants/orderStatus');
const { PAYMENT_STATUS_LIST } = require('../constants/paymentStatus');

const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Siparişte en az bir ürün olmalıdır'),

  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Ürün ID zorunludur'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Ürün adedi zorunludur')
    .isInt({ min: 1 })
    .withMessage('Ürün adedi en az 1 olmalıdır'),

  body('tableNumber')
    .notEmpty()
    .withMessage('Masa numarası zorunludur')
    .isInt({ min: 1 })
    .withMessage('Masa numarası en az 1 olmalıdır'),

  body('paymentStatus')
    .notEmpty()
    .withMessage('Ödeme durumu zorunludur')
    .isIn(PAYMENT_STATUS_LIST)
    .withMessage('Geçersiz ödeme durumu'),
];

const updateOrderStatusValidator = [
  body('orderStatus')
    .notEmpty()
    .withMessage('Sipariş durumu zorunludur')
    .isIn(ORDER_STATUS_LIST)
    .withMessage('Geçersiz sipariş durumu'),
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
};