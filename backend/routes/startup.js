const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/startupcontroller');

const authMiddleware = require('../middleware/auth');

router.get('/', ctrl.list);
router.put('/update-profile', authMiddleware, ctrl.updateProfile);

module.exports = router;