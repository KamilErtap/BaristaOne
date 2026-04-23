const { body } = require('express-validator');

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
    .isIn(['pending', 'paid'])
    .withMessage('Geçersiz ödeme durumu'),
];

const updateOrderStatusValidator = [
  body('orderStatus')
    .notEmpty()
    .withMessage('Sipariş durumu zorunludur')
    .isIn(['received', 'preparing', 'ready', 'delivered'])
    .withMessage('Geçersiz sipariş durumu'),
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
};