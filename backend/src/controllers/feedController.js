const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get user's personalized feed
// @route   GET /api/feed
// @access  Private
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get current user's following list
    const currentUser = await User.findById(req.user._id);
    const followingIds = currentUser.following;

    // Get posts from followed users and own posts
    const posts = await Post.find({
      $or: [
        { author: { $in: followingIds } },
        { author: req.user._id }
      ],
      visibility: { $in: ['public', 'followers'] }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('likes', 'username fullName profilePicture');

    const total = await Post.countDocuments({
      $or: [
        { author: { $in: followingIds } },
        { author: req.user._id }
      ],
      visibility: { $in: ['public', 'followers'] }
    });

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get discover feed (all public posts)
// @route   GET /api/feed/discover
// @access  Public
exports.getDiscoverFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get all public posts
    const posts = await Post.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('likes', 'username fullName profilePicture');

    const total = await Post.countDocuments({ visibility: 'public' });

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
