const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  brand: { type: String, default: 'TEEPRO' },
  category: { type: String, default: 't-shirt' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
