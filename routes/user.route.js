const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load controller
const UserController = require('../controllers/user.controller');

// @route   GET api/users/register
// @desc    Register users
// @access  Public
/**
 * @swagger
 * /users/register:
 *    post:
 *      description: Register a user
 */
router.post('/register', UserController.Register);

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logs in a user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad email, not found in db
 *       403:
 *         description: Email and password don't match
 */
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
