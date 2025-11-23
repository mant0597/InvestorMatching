const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contractcontroller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.put('/:id/respond', ctrl.respond);
router.put('/:id/release', ctrl.releaseFunds);

module.exports = router;
