const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

MessageSchema.index({ roomId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);