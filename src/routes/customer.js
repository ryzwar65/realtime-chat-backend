const express = require('express');

const {getIndex} = require('../controllers/CustomerController.js');
const { authorization } = require('../middlewares/auth.js');

const router = express.Router()

router.get("/",authorization,getIndex);

module.exports = router