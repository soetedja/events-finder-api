const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load controller
const UserController = require('../controllers/user.controller');

// @route   GET api/users/register
// @desc    Register users
// @access  Public
router.post('/register', UserController.Register);

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', UserController.Login);

// @route   POST api/users/googleSignIn
// @desc    Sign in user with google token
// @access  Public
router.post('/googleSignIn', UserController.GoogleSignIn);

// Require('../../config/passport')(passport);
// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  UserController.Current
);

module.exports = router;
