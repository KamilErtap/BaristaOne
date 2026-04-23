const User = require('../models/User');

const formatUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

const getUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email: email.toLowerCase() }).select('+password');
};

const registerUserService = async ({ name, email, password }) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    const error = new Error('Bu email zaten kayıtlı');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'customer',
  });

  return user;
};

const loginUserService = async ({ email, password }) => {
  const user = await getUserByEmailWithPassword(email);

  if (!user) {
    const error = new Error('Email veya şifre hatalı');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    const error = new Error('Email veya şifre hatalı');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

module.exports = {
  formatUser,
  getUserByEmail,
  getUserByEmailWithPassword,
  registerUserService,
  loginUserService,
};