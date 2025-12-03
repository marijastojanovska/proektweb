const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  body: { type: String, default: '' },
  image: { type: String, default: '' },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
