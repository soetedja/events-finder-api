const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load controller
const EventController = require('../controllers/event.controller');

// @route   GET api/events
// @desc    Get all events
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  EventController.GetAll
);

// @route   POST api/events
// @desc    Post an events
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  EventController.Create
);

// @route   POST api/events/fetchEventsInThisArea
// @desc    Fetch Events In This Area
// @access  Private
router.post(
  '/fetchEventsInThisArea',
  passport.authenticate('jwt', { session: false }),
  EventController.FetchEventsInThisArea
);

// @route   POST api/events/fetchEventsInThisArea
// @desc    Fetch Events In This Area
// @access  Private
router.get(
  '/fetchExplore',
  passport.authenticate('jwt', { session: false }),
  EventController.Fetch
);

// @route   POST api/events/like
// @desc    Like an events
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  EventController.Like
);

// @route   POST api/events/unlike
// @desc    Unlike an events
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  EventController.Unlike
);
module.exports = router;
