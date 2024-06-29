const express = require('express');
const routeAuth = require("./authUser");
const routeResep = require('./resep');
const route = express.Router();

route.use('/auth', routeAuth);
route.use('/resep', routeResep);

module.exports = route;