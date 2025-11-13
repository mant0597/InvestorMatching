// ...existing code...
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' },
  refreshToken: { type: String }, // hashed refresh token
}, { timestamps: true });

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// helper to set password
UserSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

module.exports = mongoose.model('User', UserSchema);