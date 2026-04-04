const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('İsim, email ve şifre zorunlu');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(400);
      throw new Error('Bu email zaten kayıtlı');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'customer',
    });

    res.status(201).json({
      message: 'Kayıt başarılı',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email ve şifre zorunlu');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Email veya şifre hatalı');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Email veya şifre hatalı');
    }

    res.status(200).json({
      message: 'Giriş başarılı',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };