const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // store user ids (Investor/Startup) as strings
  lastMessage: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

RoomSchema.index({ participants: 1 });

module.exports = mongoose.model('Room', RoomSchema);