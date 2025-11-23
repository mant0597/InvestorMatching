const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messagecontroller');

router.get('/', ctrl.getRoomsForUser);
router.post('/', ctrl.createOrGet);
router.get('/:roomId', ctrl.getRoom);
router.get('/:roomId/messages', ctrl.getMessages);
router.post('/:roomId/messages', ctrl.postMessage);

module.exports = router;