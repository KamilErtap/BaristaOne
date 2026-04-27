const mongoose = require('mongoose');
const { ORDER_STATUS, ORDER_STATUS_LIST } = require('../constants/orderStatus');
const { PAYMENT_STATUS, PAYMENT_STATUS_LIST } = require('../constants/paymentStatus');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Siparişte en az bir ürün olmalı',
      },
    },
    tableNumber: {
      type: Number,
      required: [true, 'Masa numarası zorunlu'],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS_LIST,
      default: PAYMENT_STATUS.PENDING,
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUS_LIST,
      default: ORDER_STATUS.RECEIVED,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);