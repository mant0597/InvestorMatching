// ...existing code...
const User = require('../models/User');
const { signAccess, signRefresh, hashToken, verifyTokenHash } = require('../utils/token');
const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'refresh_token';
const COOKIE_OPTIONS = (secure) => ({
  httpOnly: true,
  secure,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// ...existing code...
exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email taken' });

    // validate role value
    const allowedRoles = ['investor', 'startup'];
    const assignedRole = allowedRoles.includes(role) ? role : 'user';

    const user = new User({ email, name, role: assignedRole });
    await user.setPassword(password);
    await user.save();

    const refreshToken = signRefresh(user._id.toString());
    user.refreshToken = await hashToken(refreshToken);
    await user.save();

    const accessToken = signAccess(user._id.toString());
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS(secure));
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, accessToken });
  } catch (err) {
    console.error('[AUTH][REGISTER] error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// ...existing code...

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const refreshToken = signRefresh(user._id.toString());
    user.refreshToken = await hashToken(refreshToken);
    await user.save();

    const accessToken = signAccess(user._id.toString());
    const secure = req.app.get('trust proxy') ? true : false;
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS(secure));
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'please-change-me');
    const user = await User.findById(payload.sub).select('-passwordHash -refreshToken');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies['refresh_token'];
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'please-change-me');
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshToken) return res.status(401).json({ message: 'Unauthorized' });
    const ok = await verifyTokenHash(user.refreshToken, token);
    if (!ok) return res.status(401).json({ message: 'Unauthorized' });
    const accessToken = signAccess(user._id.toString());
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies['refresh_token'];
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'please-change-me');
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshToken: '' } });
      } catch {}
    }
    res.clearCookie('refresh_token', COOKIE_OPTIONS(true));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};