const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const feedController = require('../controllers/feedController');

// @route   GET /api/feed
// @desc    Get user's feed
// @access  Private
router.get('/', protect, feedController.getFeed);

// @route   GET /api/feed/discover
// @desc    Get discover feed (all public posts)
// @access  Public
router.get('/discover', feedController.getDiscoverFeed);

module.exports = router;
