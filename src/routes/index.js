const express = require('express');
const customerRoute = require('./customer')
const authRoute = require('./auth')
const chatRoute = require('./chat')

const routes = express.Router()

routes.use('/chat',chatRoute);
routes.use("/customer",customerRoute);
routes.use("/auth",authRoute);

module.exports = routes