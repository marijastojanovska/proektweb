const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendMail } = require('../config/mailer');
const { protect } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password });
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
}));

// Get profile
router.get('/me', protect, asyncHandler(async (req, res) => {
  const u = req.user;
  res.json({ id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, createdAt: u.createdAt });
}));

// Forgot password (Resend email link; no SMTP)
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If that email exists, we sent a reset link.' });

  const token = user.setPasswordResetToken();
  await user.save();

  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await sendMail({
    to: email,
    subject: 'Reset your TeeShop Pro password',
    html: `<p>Click to reset your password (valid 30 mins):</p><p><a href="${resetLink}">${resetLink}</a></p>`
  });

  res.json({ message: 'If that email exists, we sent a reset link.' });
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
  if (user.resetPasswordExpiresAt < new Date()) {
    return res.status(400).json({ message: 'Token expired' });
  }
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  if (hash !== user.resetPasswordTokenHash) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = newPassword;
  user.clearPasswordResetToken();
  await user.save();
  res.json({ message: 'Password updated. You can login now.' });
}));

module.exports = router;
