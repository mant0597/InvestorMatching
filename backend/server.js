require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const startupsRoutes = require('./routes/investor');
const investorRoutes = require('./routes/startup');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rajsony1113:LORBg1gkm7X5FWZ8@cluster0.ckfeyfa.mongodb.net/innovaconnect?retryWrites=true&w=majority&appName=Cluster0";

// CORS config
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const corsOptions = {
  origin: (origin, callback) => {
    // allow same-origin tools (no origin) and the configured frontend origin
    if (!origin) return callback(null, true);
    const allowedOrigins = [FRONTEND_ORIGIN, 'http://localhost:5174', 'http://localhost:5173'];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// handle preflight and ensure headers for credentials
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [FRONTEND_ORIGIN, 'http://localhost:5174', 'http://localhost:5173'];
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
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
app.use('/api/contract', require('./routes/contract'));

// connect mongo and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Auth server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

module.exports = app;