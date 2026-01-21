const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'socialapp/posts',
        resource_type: resourceType
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { text, links, visibility } = req.body;

    // Validate that post has content
    if (!text && (!req.files || req.files.length === 0) && !links) {
      return res.status(400).json({
        success: false,
        message: 'Post must have text, media, or links'
      });
    }

    const postData = {
      author: req.user._id,
      content: {
        text: text || '',
        media: [],
        links: links ? JSON.parse(links) : []
      },
      visibility: visibility || 'public'
    };

    // Upload media files if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const resourceType = file.mimetype.startsWith('video') ? 'video' : 'image';
        const result = await uploadToCloudinary(file.buffer, resourceType);
        
        postData.content.media.push({
          type: resourceType,
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    }

    const post = await Post.create(postData);
    await post.populate('author', 'username fullName profilePicture isVerified');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
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

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username fullName profilePicture')
      .populate('likes', 'username fullName profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        post
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

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { text, links, visibility } = req.body;

    if (text !== undefined) post.content.text = text;
    if (links !== undefined) post.content.links = JSON.parse(links);
    if (visibility !== undefined) post.visibility = visibility;
    
    post.isEdited = true;
    post.editedAt = Date.now();

    await post.save();
    await post.populate('author', 'username fullName profilePicture isVerified');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post
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

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Delete media from Cloudinary
    for (const media of post.content.media) {
      if (media.publicId) {
        await cloudinary.uploader.destroy(media.publicId);
      }
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if already liked
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Post already liked'
      });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: {
        likesCount: post.likes.length
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

// @desc    Unlike a post
// @route   POST /api/posts/:id/unlike
// @access  Private
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if liked
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Post not liked yet'
      });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: {
        likesCount: post.likes.length
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

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();
    await post.populate('comments.user', 'username fullName profilePicture');

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: post.comments[post.comments.length - 1]
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

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment author or post author
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username fullName profilePicture');

    const total = await Post.countDocuments({ author: req.params.userId });

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
