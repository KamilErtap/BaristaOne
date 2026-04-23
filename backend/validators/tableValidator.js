const { body } = require('express-validator');

const tableValidator = [
  body('number')
    .notEmpty()
    .withMessage('Masa numarası zorunludur')
    .isInt({ min: 1 })
    .withMessage('Masa numarası en az 1 olmalıdır'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('Masa kodu zorunludur')
    .isLength({ min: 3 })
    .withMessage('Masa kodu en az 3 karakter olmalıdır'),

  body('capacity')
    .notEmpty()
    .withMessage('Kapasite zorunludur')
    .isInt({ min: 1 })
    .withMessage('Kapasite en az 1 olmalıdır'),

  body('description')
    .optional()
    .trim(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive boolean değer olmalıdır'),
];

module.exports = {
  tableValidator,
};