const Room = require('../models/Room');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');

exports.getRoomsForUser = async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.split(' ')[1];
    
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'please-change-me');
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const userId = payload.sub;

    const rooms = await Room.find({ participants: userId }).sort({ updatedAt: -1 }).lean();

    const allParticipantIds = [...new Set(rooms.flatMap(room => room.participants))];
    
    const startups = await Startup.find({ _id: { $in: allParticipantIds } }).select('name companyName role').lean();
    const investors = await Investor.find({ _id: { $in: allParticipantIds } }).select('name role').lean();

    const participantDetails = {};
    startups.forEach(s => {
        participantDetails[s._id] = { id: s._id.toString(), name: s.name, companyName: s.companyName, role: s.role };
    });
    investors.forEach(i => {
        participantDetails[i._id] = { id: i._id.toString(), name: i.name, role: i.role };
    });

    const conversations = rooms.map(room => ({
      _id: room._id,
      participants: room.participants.map(pId => participantDetails[pId]).filter(Boolean),
      lastMessage: room.lastMessage,
      updatedAt: room.updatedAt,
    }));

    res.json({ rooms: conversations });

  } catch (err) {
    console.error('[ROOM][GET_FOR_USER]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/rooms
 * body: { participants: [userId1, userId2] }
 * Returns existing room for the same two participants or creates a new one.
 */
exports.createOrGet = async (req, res) => {
  try {
    const participants = req.body.participants;
    if (!Array.isArray(participants) || participants.length !== 2) {
      return res.status(400).json({ message: 'participants must be an array of two user ids' });
    }

    // canonical order to avoid duplicates
    const sorted = participants.slice().sort();
    // find existing room containing exactly these two participants
    const existing = await Room.findOne({
      participants: { $all: sorted, $size: 2 }
    });

    if (existing) {
      return res.json({ room: existing });
    }

    const room = await Room.create({ participants: sorted });
    return res.status(201).json({ room });
  } catch (err) {
    console.error('[ROOM][CREATE_OR_GET]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/rooms/:roomId
 * Return room and recent messages
 */
exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      // Log the invalid attempt and return a 400 Bad Request
      console.warn(`[ROOM][GET] Invalid roomId received: ${roomId}`);
      return res.status(400).json({ message: 'Invalid roomId provided' });
    }
    const room = await Room.findById(roomId).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const messages = await Message.find({ roomId: room._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ room, messages });
  } catch (err) {
    console.error('[ROOM][GET]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/rooms/:roomId/messages
 */
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).lean();
    return res.json({ messages });
  } catch (err) {
    console.error('[ROOM][GET_MESSAGES]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/rooms/:roomId/messages
 * body: { senderId, content }
 * Saves message and emits via socket.io to room.
 */
exports.postMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { senderId, content } = req.body;
    if (!senderId || !content) return res.status(400).json({ message: 'senderId and content required' });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const message = await Message.create({
      roomId: room._id,
      senderId,
      content,
      createdAt: new Date(),
    });

    // update room last message
    room.lastMessage = content;
    room.updatedAt = new Date();
    await room.save();

    // emit via socket.io if available
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(String(room._id)).emit('message', {
          id: message._id,
          roomId: String(room._id),
          senderId: message.senderId,
          content: message.content,
          createdAt: message.createdAt,
          read: message.read,
        });
      }
    } catch (e) {
      console.warn('socket emit failed', e);
    }

    return res.status(201).json({ message });
  } catch (err) {
    console.error('[ROOM][POST_MESSAGE]', err);
    res.status(500).json({ message: 'Server error' });
  }
};