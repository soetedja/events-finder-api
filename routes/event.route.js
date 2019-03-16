const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load controller
const EventController = require('../controllers/event.controller');

// @route   GET api/events/register
// @desc    Register events
// @access  Public
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  EventController.Create
);

module.exports = router;
