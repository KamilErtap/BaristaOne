const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ROLES = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim zorunlu'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email zorunlu'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunlu'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: [
        ROLES.OWNER,
        ROLES.ADMIN,
        ROLES.KITCHEN,
        ROLES.WAITER,
        ROLES.CUSTOMER,
      ],
      default: ROLES.CUSTOMER,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);