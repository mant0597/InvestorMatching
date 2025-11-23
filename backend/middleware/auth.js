const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ message: 'Unauthorized' });

        const token = header.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const payload = jwt.verify(token, process.env.JWT_SECRET || 'please-change-me');

        req.user = {
            userId: payload.sub,
            role: payload.role
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
