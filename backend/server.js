
// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const startupsRoutes = require('./routes/investor');
// const investorRoutes = require('./routes/startup');
// const roomsRoutes = require('./routes/message');

// const app = express();
// const PORT = process.env.PORT || 4000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rajsony1113:LORBg1gkm7X5FWZ8@cluster0.ckfeyfa.mongodb.net/innovaconnect?retryWrites=true&w=majority&appName=Cluster0";

// // CORS config
// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
// const corsOptions = {
//   origin: (origin, callback) => {
//     // allow same-origin tools (no origin) and the configured frontend origin
//     if (!origin) return callback(null, true);
//     if (origin === FRONTEND_ORIGIN) return callback(null, true);
//     return callback(new Error('CORS policy: origin not allowed'));
//   },
//   credentials: true,
//   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization'],
// };

// app.set('trust proxy', 1);
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors(corsOptions));

// // handle preflight and ensure headers for credentials
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   if (req.method === 'OPTIONS') return res.sendStatus(204);
//   next();
// });

// // serve uploaded files (pitch decks etc.)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // api routes
// app.use('/api/auth', authRoutes);
// app.use('/api/investor', startupsRoutes);
// app.use('/api/startup', investorRoutes);
// app.use('/api/rooms', roomsRoutes);


// // create http server + socket.io
// const http = require('http');
// const server = http.createServer(app);

// const { Server } = require('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: '*', // adjust to your frontend origin in production
//     methods: ['GET', 'POST']
//   }
// });

// // attach io to express app so controllers can emit
// app.set('io', io);

// // basic socket handlers
// io.on('connection', (socket) => {
//   console.log('socket connected', socket.id);

//   socket.on('joinRoom', (roomId) => {
//     if (!roomId) return;
//     socket.join(String(roomId));
//     console.log(`socket ${socket.id} joined room ${roomId}`);
//   });

//   socket.on('leaveRoom', (roomId) => {
//     if (!roomId) return;
//     socket.leave(String(roomId));
//     console.log(`socket ${socket.id} left room ${roomId}`);
//   });

//   // Optional: receive transient messages and broadcast
//   socket.on('sendMessage', (payload) => {
//     // payload: { roomId, senderId, content }
//     if (!payload || !payload.roomId) return;
//     io.to(String(payload.roomId)).emit('message', payload);
//   });

//   socket.on('disconnect', () => {
//     console.log('socket disconnected', socket.id);
//   });
// });


// // connect mongo and start server
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
//   })
//   .catch(err => {
//     console.error('Mongo connection error', err);
//     process.exit(1);
//   });

// module.exports = app;





















require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const startupsRoutes = require('./routes/investor');
const investorRoutes = require('./routes/startup');
const roomsRoutes = require('./routes/message');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rajsony1113:LORBg1gkm7X5FWZ8@cluster0.ckfeyfa.mongodb.net/innovaconnect?retryWrites=true&w=majority&appName=Cluster0";

// CORS config
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const corsOptions = {
  origin: (origin, callback) => {
    // allow same-origin tools (no origin) and the configured frontend origin
    if (!origin) return callback(null, true);
    if (origin === FRONTEND_ORIGIN) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// handle preflight and ensure headers for credentials
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// serve uploaded files (pitch decks etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/investor', startupsRoutes);
app.use('/api/startup', investorRoutes);
app.use('/api/rooms', roomsRoutes);


// create http server + socket.io
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io',
  transports: ['websocket', 'polling']
});

// attach io to express app so controllers can emit
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);
  console.log('   Transport:', socket.conn.transport.name);

  socket.on('joinRoom', (roomId) => {
    if (!roomId) {
      console.log('⚠️  joinRoom called without roomId');
      return;
    }
    const roomIdStr = String(roomId);
    socket.join(roomIdStr);
    console.log(`✅ Socket ${socket.id} joined room: ${roomIdStr}`);
    console.log('   Current rooms:', Array.from(socket.rooms));
  });

  socket.on('leaveRoom', (roomId) => {
    if (!roomId) return;
    const roomIdStr = String(roomId);
    socket.leave(roomIdStr);
    console.log(`👋 Socket ${socket.id} left room: ${roomIdStr}`);
  });

  // Optional: receive transient messages and broadcast
  socket.on('sendMessage', (payload) => {
    console.log('📨 Received sendMessage event:', payload);
    if (!payload || !payload.roomId) return;
    io.to(String(payload.roomId)).emit('message', payload);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('🚨 Socket error:', error);
  });
});


// connect mongo and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend origin: ${FRONTEND_ORIGIN}`);
      console.log(`🔌 Socket.IO ready`);
      console.log('=================================');
    });
  })
  .catch(err => {
    console.error('💥 Mongo connection error', err);
    process.exit(1);
  });

module.exports = app;