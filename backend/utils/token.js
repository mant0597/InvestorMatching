// ...existing code...
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'please-change-me';
const ACCESS_EXP = '15m';
const REFRESH_EXP = '7d';

function signAccess(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: ACCESS_EXP });
}
function signRefresh(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: REFRESH_EXP });
}

async function hashToken(token) {
  return bcrypt.hash(token, 12);
}
async function verifyTokenHash(hash, token) {
  return bcrypt.compare(token, hash);
}

module.exports = { signAccess, signRefresh, hashToken, verifyTokenHash };