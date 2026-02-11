const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', userController.searchUsers);

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateProfile);

// @route   PUT /api/users/profile-picture
// @desc    Upload profile picture
// @access  Private
router.put('/profile-picture', protect, upload.single('profilePicture'), userController.uploadProfilePicture);

// @route   PUT /api/users/cover-photo
// @desc    Upload cover photo
// @access  Private
router.put('/cover-photo', protect, upload.single('coverPhoto'), userController.uploadCoverPhoto);

// @route   POST /api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', protect, userController.followUser);

// @route   POST /api/users/:id/unfollow
// @desc    Unfollow a user
// @access  Private
router.post('/:id/unfollow', protect, userController.unfollowUser);

// @route   GET /api/users/:id/followers
// @desc    Get user followers
// @access  Public
router.get('/:id/followers', userController.getFollowers);

// @route   GET /api/users/:id/following
// @desc    Get users that user is following
// @access  Public
router.get('/:id/following', userController.getFollowing);

module.exports = router;
