const express = require('express');
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
const routeAuth = express.Router();

routeAuth.post('/register', authController.register);
routeAuth.post('/login', authController.login);
routeAuth.get('/validation',authController.tokenValidation);

routeAuth.get('/logout',authMiddleware.verifyToken,authController.logout);


module.exports = routeAuth;