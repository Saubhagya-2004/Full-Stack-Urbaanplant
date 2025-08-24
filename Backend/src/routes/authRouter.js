const express = require('express');
const { signup, login, getProfile, logout, updatePassword } = require('../controllers/authcontroller');
const { userAuth } = require('../middleware/auth');

const authRouter = express.Router();

// Routes now point to controllers
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/profile', userAuth, getProfile);
authRouter.post('/logout', userAuth, logout);
authRouter.patch('/profile/password', updatePassword);

module.exports = authRouter;
