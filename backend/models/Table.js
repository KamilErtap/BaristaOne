const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Masa numarası zorunludur'],
      unique: true,
      min: 1,
    },
    code: {
      type: String,
      required: [true, 'Masa kodu zorunludur'],
      trim: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Kapasite zorunludur'],
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);