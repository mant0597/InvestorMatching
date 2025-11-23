const Startup = require('../models/Startup');

/**
 * GET /api/startups
 * Optional query params:
 *  - q: search string (companyName, name, description, category)
 *  - category: exact category filter
 */
exports.list = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();

    const filter = {};
    if (category) filter.category = category;

    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { companyName: re },
        { name: re },
        { description: re },
        { category: re },
      ];
    }

    const startups = await Startup.find(filter)
      .select('-passwordHash -refreshToken -__v')
      .lean()
      .limit(500);

    res.json({ startups });
  } catch (err) {
    console.error('[STARTUP][LIST] error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/investor/:id
 */
exports.getById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).select('-passwordHash -refreshToken -__v');
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.json(startup);
  } catch (err) {
    console.error('[STARTUP][GET] error', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};