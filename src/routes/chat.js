const express = require('express');

const { generateRoom } = require('../controllers/ChatController.js');
const { authorization } = require('../middlewares/auth.js');

const router = express.Router()

router.post("/generate-room",authorization,generateRoom);

module.exports = router