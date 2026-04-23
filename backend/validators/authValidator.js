const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('İsim zorunludur')
    .isLength({ min: 2 })
    .withMessage('İsim en az 2 karakter olmalıdır'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email zorunludur')
    .isEmail()
    .withMessage('Geçerli bir email giriniz')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Şifre zorunludur')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email zorunludur')
    .isEmail()
    .withMessage('Geçerli bir email giriniz')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Şifre zorunludur'),
];

module.exports = {
  registerValidator,
  loginValidator,
};