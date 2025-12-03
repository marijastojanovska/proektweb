const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  resetPasswordTokenHash: { type: String, default: null },
  resetPasswordExpiresAt: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.setPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordTokenHash = hash;
  this.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 mins
  return token;
};

userSchema.methods.clearPasswordResetToken = function() {
  this.resetPasswordTokenHash = null;
  this.resetPasswordExpiresAt = null;
};

module.exports = mongoose.model('User', userSchema);
