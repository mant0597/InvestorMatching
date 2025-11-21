// ...existing code...
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authcontroller');
const upload = require('../utils/multer');

router.post('/register', upload.single('pitchDeck'), ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', ctrl.me);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

module.exports = router;