// ...existing code...
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');
const { signAccess, signRefresh, hashToken, verifyTokenHash } = require('../utils/token');
const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'refresh_token';
const COOKIE_OPTIONS = (secure) => ({
  httpOnly: true,
  secure,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// helper to find model by role
function modelForRole(role) {
  return role === 'startup' ? Startup : Investor;
}

// ...existing code...
exports.register = async (req, res) => {
  try {
    // When using multer, fields come in req.body and file in req.file
    const { email, password, name, role } = req.body;
    // startup-specific fields may be passed directly (companyName, category, foundingYear, founderName, fundingTaken, fundingRound, description)
    const profile = {
      companyName: req.body.companyName,
      category: req.body.category,
      foundingYear: req.body.foundingYear,
      founderName: req.body.founderName,
      fundingTaken: req.body.fundingTaken === 'true' || req.body.fundingTaken === true,
      fundingRound: req.body.fundingRound,
      description: req.body.description,
    };

    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    // ensure email uniqueness across both collections
    const existsInStartup = await Startup.findOne({ email });
    const existsInInvestor = await Investor.findOne({ email });
    if (existsInStartup || existsInInvestor) return res.status(409).json({ message: 'Email taken' });

    const allowedRoles = ['investor', 'startup'];
    const assignedRole = allowedRoles.includes(role) ? role : 'investor';

    let doc;
    if (assignedRole === 'startup') {
      doc = new Startup({
        email,
        companyName: profile.companyName || name || '',
        name: name || profile.founderName || '',
        category: profile.category,
        foundingYear: profile.foundingYear ? Number(profile.foundingYear) : undefined,
        founderName: profile.founderName,
        fundingTaken: !!profile.fundingTaken,
        fundingRound: profile.fundingRound || null,
        description: profile.description,
        role: 'startup',
        profileCompleted: !!req.body.profileCompleted,
      });
    } else {
      doc = new Investor({
        email,
        name: name || req.body.name || '',
        investmentPreferences: { sectors: (req.body.sectors && JSON.parse(req.body.sectors)) || [] },
        role: 'investor',
        profileCompleted: !!req.body.profileCompleted,
      });
    }

    // if multer saved a file, attach path (relative URL) to doc
    if (req.file) {
      // store relative URL so frontend can fetch: /uploads/pitchDeck/<filename>
      doc.pitchDeckFile = `/uploads/pitchDeck/${req.file.filename}`;
    }

    await doc.setPassword(password);
    await doc.save();

    // create tokens and save hashed refresh
    const refreshToken = signRefresh(doc._id.toString(), doc.role);
    doc.refreshToken = await hashToken(refreshToken);
    await doc.save();

    const accessToken = signAccess(doc._id.toString(), doc.role);
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS(secure));

    const userPayload = {
      id: doc._id,
      email: doc.email,
      name: doc.name || doc.companyName || '',
      role: doc.role,
      pitchDeckFile: doc.pitchDeckFile || null,
    };

    res.status(201).json({ user: userPayload, accessToken });
  } catch (err) {
    console.error('[AUTH][REGISTER] error', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    // try both collections
    let doc = await Startup.findOne({ email });
    let role = 'startup';
    if (!doc) {
      doc = await Investor.findOne({ email });
      role = 'investor';
    }
    if (!doc) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await doc.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const refreshToken = signRefresh(doc._id.toString(), role);
    doc.refreshToken = await hashToken(refreshToken);
    await doc.save();

    const accessToken = signAccess(doc._id.toString(), role);
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS(secure));

    res.json({
      user: { id: doc._id, email: doc.email, name: doc.name || doc.companyName || '', role },
      accessToken
    });
  } catch (err) {
    console.error('[AUTH][LOGIN] error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'please-change-me');

    const RoleModel = modelForRole(payload.role);
    const user = await RoleModel.findById(payload.sub).select('-passwordHash -refreshToken').lean();
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

    const RoleModel = modelForRole(payload.role);
    const user = await RoleModel.findById(payload.sub);
    if (!user || !user.refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const ok = await verifyTokenHash(user.refreshToken, token);
    if (!ok) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = signAccess(user._id.toString(), payload.role);
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
        const RoleModel = modelForRole(payload.role);
        await RoleModel.findByIdAndUpdate(payload.sub, { $unset: { refreshToken: '' } });
      } catch {}
    }
    res.clearCookie('refresh_token', COOKIE_OPTIONS(true));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// ...existing code...