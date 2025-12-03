const express = require('express');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts?page=&limit=
router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '8', 10), 1);
  const q = req.query.q || '';
  const filter = q ? { title: { $regex: q, $options: 'i' } } : {};
  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ posts, page, pages: Math.ceil(total / limit), total });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
}));

// Admin: create
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { title, excerpt, body, image, tags } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  const exists = await Post.findOne({ slug });
  if (exists) return res.status(400).json({ message: 'Slug already exists' });
  const post = await Post.create({ title, slug, excerpt, body, image, tags });
  res.status(201).json(post);
}));

// Admin: update
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const fields = ['title','excerpt','body','image','tags'];
  fields.forEach(f => { if (req.body[f] !== undefined) post[f] = req.body[f]; });
  if (req.body.title) post.slug = slugify(req.body.title, { lower: true, strict: true });
  await post.save();
  res.json(post);
}));

// Admin: delete
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  await post.deleteOne();
  res.json({ message: 'Post removed' });
}));

module.exports = router;
