const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const InvestorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  investmentPreferences: {
    sectors: [String],
  },
  role: { type: String, default: 'investor' },
  refreshToken: { type: String },
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

InvestorSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

InvestorSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

module.exports = mongoose.model('Investor', InvestorSchema);