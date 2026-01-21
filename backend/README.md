# Social App Backend

A RESTful API backend for a social media mobile application built with Node.js, Express, and MongoDB.

## Features

- 🔐 User Authentication (JWT)
- 👤 User Profiles with profile pictures and cover photos
- 📝 Create posts with text, media (images/videos), and embedded links
- 💬 Comments and likes on posts
- 👥 Follow/Unfollow users
- 📱 Personalized feed based on following
- 🔍 Discover feed with all public posts
- 🔎 User search functionality
- ☁️ Cloud-based media storage (Cloudinary)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Validation**: Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for media uploads)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/update-password` - Update password (Protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (Protected)
- `PUT /api/users/profile-picture` - Upload profile picture (Protected)
- `PUT /api/users/cover-photo` - Upload cover photo (Protected)
- `POST /api/users/:id/follow` - Follow user (Protected)
- `POST /api/users/:id/unfollow` - Unfollow user (Protected)
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following
- `GET /api/users/search?q=query` - Search users

### Posts
- `POST /api/posts` - Create post (Protected)
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (Protected)
- `DELETE /api/posts/:id` - Delete post (Protected)
- `POST /api/posts/:id/like` - Like post (Protected)
- `POST /api/posts/:id/unlike` - Unlike post (Protected)
- `POST /api/posts/:id/comment` - Comment on post (Protected)
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment (Protected)
- `GET /api/posts/user/:userId` - Get user's posts

### Feed
- `GET /api/feed` - Get personalized feed (Protected)
- `GET /api/feed/discover` - Get discover feed (all public posts)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── userController.js  # User management logic
│   │   ├── postController.js  # Post management logic
│   │   └── feedController.js  # Feed logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── upload.js          # File upload middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Post.js            # Post model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User routes
│   │   ├── posts.js           # Post routes
│   │   └── feed.js            # Feed routes
│   └── server.js              # App entry point
├── .env.example
├── .gitignore
└── package.json
```

## Error Handling

All API responses follow this format:

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## License

ISC
