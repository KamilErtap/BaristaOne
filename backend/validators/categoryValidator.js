const { body } = require('express-validator');

const categoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kategori adı zorunludur')
    .isLength({ min: 2 })
    .withMessage('Kategori adı en az 2 karakter olmalıdır'),

  body('description')
    .optional()
    .trim(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive boolean değer olmalıdır'),
];

module.exports = {
  categoryValidator,
};