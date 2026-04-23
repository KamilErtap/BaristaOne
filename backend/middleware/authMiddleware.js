const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token bulunamadı',
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz token',
    });
  }

  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Kullanıcı bulunamadı',
    });
  }

  req.user = user;
  next();
});

module.exports = protect;