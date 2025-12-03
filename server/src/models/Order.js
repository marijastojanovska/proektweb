const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    number: { type: String }, // ново поле за „број“ (пример број на обувки)
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    payment: {
      method: { type: String, default: 'cod' },
      paidAt: Date,
      transactionId: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema);
