const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // true for admin
  isBanned: { type: Boolean, default: false }  // true if seller is banned
});

module.exports = mongoose.model('User', userSchema);
