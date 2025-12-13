const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  otp: { type: String , default: null },
  avatar: {type: String, default: null},
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
