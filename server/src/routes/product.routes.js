const express = require('express');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const slugify = require('slugify');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '0', 10), 0);
  const category = req.query.category;
  const q = req.query.q || '';

  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (q) filter.name = { $regex: q, $options: 'i' };

  const sort = { createdAt: -1 };

  if (limit > 0) {
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);
    const pages = Math.max(1, Math.ceil(total / limit));
    return res.json({ products, pages, total, page, limit });
  } else {
    const products = await Product.find(filter).sort(sort);
    return res.json(products);
  }
}));



router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).sort({ createdAt: -1 });
  res.json(products);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { name, description, image, price, countInStock, sizes = [], colors = [], brand, category, featured } = req.body;
  const product = await Product.create({
    name, slug: slugify(name, { lower: true, strict: true }),
    description, image, price, countInStock, sizes, colors, brand, category, featured: !!featured
  });
  res.status(201).json(product);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const fields = ['name','description','image','price','countInStock','sizes','colors','brand','category','featured'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
  if (req.body.name) product.slug = slugify(product.name, { lower: true, strict: true });
  await product.save();
  res.json(product);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product removed' });
}));

module.exports = router;
