const { body } = require('express-validator');

const menuItemValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Ürün adı zorunludur')
    .isLength({ min: 2 })
    .withMessage('Ürün adı en az 2 karakter olmalıdır'),

  body('description')
    .optional()
    .trim(),

  body('price')
    .notEmpty()
    .withMessage('Fiyat zorunludur')
    .isNumeric()
    .withMessage('Fiyat sayı olmalıdır')
    .custom((value) => Number(value) >= 0)
    .withMessage('Fiyat negatif olamaz'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Kategori zorunludur'),

  body('image')
    .optional()
    .trim(),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable boolean değer olmalıdır'),
];

module.exports = {
  menuItemValidator,
};