const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const StartupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  name: { type: String }, // full name / founder
  passwordHash: { type: String, required: true },
  category: { type: String },
  sector: { type: String }, // Added for frontend compatibility
  foundingYear: { type: Number },
  foundingDate: { type: Date }, // Added for frontend compatibility
  founderName: { type: String },
  founderExperience: { type: String }, // Added
  fundingTaken: { type: Boolean, default: false },
  fundingRound: { type: String, default: null },
  fundingStage: { type: String }, // Added alias for fundingRound
  currentValuation: { type: Number, default: 0 }, // Added
  fundingAmount: { type: Number, default: 0 }, // Added
  teamSize: { type: Number, default: 1 }, // Added
  description: { type: String },
  pitchDeckFile: { type: String }, // store filename or URL
  role: { type: String, default: 'startup' },
  refreshToken: { type: String }, // hashed refresh token
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

StartupSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

StartupSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

module.exports = mongoose.model('Startup', StartupSchema);