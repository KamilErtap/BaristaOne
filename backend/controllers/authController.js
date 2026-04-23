const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const {
  formatUser,
  registerUserService,
  loginUserService,
} = require('../services/authService');

const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  return sendSuccess(res, 201, 'Kayıt başarılı', {
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const user = await loginUserService(req.body);

  return sendSuccess(res, 200, 'Giriş başarılı', {
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Kullanıcı bilgileri getirildi', {
    user: formatUser(req.user),
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};