// ...existing code...
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rajsony1113:LORBg1gkm7X5FWZ8@cluster0.ckfeyfa.mongodb.net/innovaconnect?retryWrites=true&w=majority&appName=Cluster0';

// allow frontend origin & credentials
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server requests or tools like curl
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
// optional explicit header for credentials
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.sendStatus(204);
  }
  next();
});

// optional explicit header for credentials
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/auth', authRoutes);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Auth server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });