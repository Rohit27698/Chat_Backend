const express = require('express');
const { getChats } = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticate, getChats);

module.exports = router;
