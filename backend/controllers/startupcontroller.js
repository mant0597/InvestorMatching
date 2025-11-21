const Investor = require('../models/Investor');

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

    const investors = await Investor.find(filter)
      .select('-passwordHash -refreshToken -__v')
      .lean()
      .limit(500);

    res.json({ investors });
  } catch (err) {
    console.error('[INVESTOR][LIST] error', err);
    res.status(500).json({ message: 'Server error' });
  }
};