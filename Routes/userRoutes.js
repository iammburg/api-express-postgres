//importing modules
const express = require('express');
const userController = require('../Controllers/userController');
const { signup, login, getUsers } = userController;
const userAuth = require('../Middlewares/userAuth');
const authenticateToken = require('../Middlewares/authMiddleware');

const router = express.Router();

// Define your routes here
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/', authenticateToken, userController.getUsers);

module.exports = router;