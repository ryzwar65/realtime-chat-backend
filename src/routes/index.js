const express = require('express');
const customerRoute = require('./customer')
const authRoute = require('./auth')

const routes = express.Router()

routes.use("/customer",customerRoute);
routes.use("/auth",authRoute);

module.exports = routes