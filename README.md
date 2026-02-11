# Social App

A full-stack mobile social media application that allows users to create profiles, share posts with text/media/links, follow other users, and interact through likes and comments.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT
- **User Profiles**: Customizable profiles with profile pictures and cover photos
- **Posts**: Create posts with text, images, videos, and embedded links
- **Social Interactions**: Like, comment, and share posts
- **Follow System**: Follow and unfollow users
- **Feeds**: 
  - Personalized feed from followed users
  - Discover feed with all public posts
- **Search**: Find users by username or name
- **Real-time Updates**: Dynamic feed updates

## 📁 Project Structure

```
socialApp/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── config/      # Database and service configurations
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth and upload middleware
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   └── package.json
│
└── mobile/              # React Native mobile app
    ├── app/             # Screens (Expo Router)
    │   ├── (auth)/     # Login/Signup screens
    │   └── (tabs)/     # Main app screens
    ├── components/      # Reusable components
    ├── context/         # React context (Auth)
    ├── services/        # API service layer
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express Validator

### Mobile App
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **UI Components**: React Native Paper
- **HTTP Client**: Axios
- **Storage**: Expo SecureStore

## 📋 Prerequisites

- **Node.js v18 LTS or higher** (v12 will NOT work with Expo)
  - Check version: `node --version`
  - If you have v12, see `NODEJS_FIX.md` for upgrade instructions
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for media storage)
- Expo CLI (installed automatically with the project)
- iOS Simulator (Mac) or Android Emulator

## 🚀 Getting Started

### 1. Clone the repository
```bash
cd socialApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Mobile App Setup

In a new terminal:
```bash
cd mobile
npm install
```

Update API URL in `mobile/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api'; // or your IP address
```

Start the mobile app:
```bash
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## 📱 App Screens

### Authentication
- **Login**: Email and password authentication
- **Signup**: New user registration

### Main App
- **Feed**: Personalized feed from followed users
- **Discover**: Explore public posts from all users
- **Create**: Post text, images, videos, and links
- **Search**: Find and follow other users
- **Profile**: View and edit your profile

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/profile-picture` - Upload profile picture
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/search` - Search users

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Comment on post

### Feed
- `GET /api/feed` - Get personalized feed
- `GET /api/feed/discover` - Get discover feed

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. User signs up or logs in
2. Backend generates a JWT token
3. Token is stored securely on the device
4. Token is sent with each API request in the Authorization header
5. Backend validates the token for protected routes

## 📦 Database Schema

### User Model
- username, email, password (hashed)
- fullName, bio
- profilePicture, coverPhoto
- followers[], following[]
- isVerified, timestamps

### Post Model
- author (ref: User)
- content (text, media[], links[])
- likes[], comments[], shares[]
- visibility (public/followers/private)
- timestamps

## 🎨 UI/UX Features

- Modern, clean design
- Smooth animations and transitions
- Pull-to-refresh on feeds
- Infinite scroll pagination
- Image/video preview before posting
- Real-time like counts
- Verified badge for users

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Mobile Development
```bash
cd mobile
npm start    # Start Expo dev server
```

### Clear Cache (if issues occur)
```bash
# Mobile
npx expo start -c

# Backend
rm -rf node_modules
npm install
```

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Ensure MongoDB is accessible
3. Deploy using Git or CLI

### Mobile Deployment
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

Note: Requires EAS (Expo Application Services) setup

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRE` - Token expiration time
- `CLOUDINARY_*` - Cloudinary credentials

### Mobile (services/api.js)
- `API_URL` - Backend API base URL

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify .env file exists and is configured
- Check port 5000 is not in use

**Mobile app can't connect:**
- Verify backend is running
- Check API_URL matches your setup
- Use correct IP for emulator/device

**Images won't upload:**
- Verify Cloudinary credentials
- Check file size limits
- Ensure permissions are granted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👥 Authors

Your Name

## 🙏 Acknowledgments

- Expo for the amazing React Native framework
- React Native Paper for UI components
- Cloudinary for media storage
- MongoDB for the database

---

Built with ❤️ using React Native and Node.js
