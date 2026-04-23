const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const {
  registerValidator,
  loginValidator,
} = require('../validators/authValidator');

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', loginValidator, validate, loginUser);
router.get('/me', protect, getMe);

module.exports = router;