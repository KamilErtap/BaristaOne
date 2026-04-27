const mongoose = require('mongoose');

const orderEventLogSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    tableNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderEventLog', orderEventLogSchema);