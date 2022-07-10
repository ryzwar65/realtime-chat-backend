const express = require('express');

const {login, logout, refreshToken, isLogin} = require('../controllers/AuthController');
const { authorization } = require('../middlewares/auth');

const router = express.Router()

router.get("/me",authorization,isLogin);
router.post("/login",login);
router.post("/token",refreshToken);
router.post("/logout",authorization,logout);

module.exports = router