const express = require('express');

const {login, logout} = require('../controllers/AuthController');
const { authorization } = require('../middlewares/auth');

const router = express.Router()

router.post("/login",login);
router.post("/logout",authorization,logout);

module.exports = router