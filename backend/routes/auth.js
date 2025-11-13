// ...existing code...
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authcontroller');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', ctrl.me);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

module.exports = router;