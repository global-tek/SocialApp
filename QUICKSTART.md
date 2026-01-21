# Quick Start Guide - Social App

Follow these steps to get your social media app up and running!

## Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed or MongoDB Atlas account
- [ ] Cloudinary account (free tier works)
- [ ] Expo CLI installed: `npm install -g expo-cli`

## Step 1: Install Dependencies

From the root directory:

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Use it in the `.env` file

## Step 3: Set Up Cloudinary

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

## Step 4: Configure Backend

```bash
cd backend

# Copy the example env file
cp .env.example .env

# Edit .env with your values
# On Mac: nano .env
# Or open in your text editor
```

Update these values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_random_secret_key_change_this
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

## Step 5: Configure Mobile App

Find your computer's local IP address:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Update `mobile/services/api.js`:
```javascript
// For iOS Simulator
const API_URL = 'http://localhost:5000/api';

// For Android Emulator
const API_URL = 'http://10.0.2.2:5000/api';

// For Physical Device (replace with your IP)
const API_URL = 'http://192.168.1.XXX:5000/api';
```

## Step 6: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

## Step 7: Start the Mobile App

In a new terminal:

```bash
cd mobile
npm start
```

Then choose your platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Step 8: Test the App

1. The app should open to the login screen
2. Click "Don't have an account? Sign Up"
3. Create a test account:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Click Sign Up
5. You should be logged in and see the Feed!

## Common Issues & Solutions

### Backend Issues

**Can't connect to MongoDB:**
```bash
# Check if MongoDB is running
brew services list  # macOS
# Or
sudo systemctl status mongod  # Linux
```

**Port 5000 already in use:**
```bash
# Find what's using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)

# Or change PORT in .env to another port like 3000
```

### Mobile App Issues

**Can't connect to backend:**
- Make sure backend is running (check terminal)
- Verify API_URL matches your setup
- For physical device, ensure it's on the same WiFi

**Metro bundler won't start:**
```bash
# Clear cache
npx expo start -c
```

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

Now that your app is running:

1. **Create a few test users** to test the social features
2. **Create some posts** with text, images, or links
3. **Follow other users** to populate your feed
4. **Explore the discover feed** to see all posts

## Development Tips

### Backend Development
- API runs on http://localhost:5000
- Use Postman or curl to test endpoints
- Check `backend/src/server.js` for available routes

### Mobile Development
- Changes auto-reload (hot reload)
- Shake device for developer menu
- Press `r` in terminal to reload manually
- Press `j` to open debugger

### Database Management
```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use socialapp database
use socialapp

# Show collections
show collections

# Find all users
db.users.find()

# Find all posts
db.posts.find()
```

## Useful Commands

```bash
# Backend
cd backend
npm run dev      # Start with auto-reload
npm start        # Start normally

# Mobile
cd mobile
npm start        # Start Expo
npm run ios      # Run on iOS
npm run android  # Run on Android

# Both (from root)
npm run backend  # Start backend only
npm run mobile   # Start mobile only
```

## File Structure Reference

```
socialApp/
├── backend/
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── server.js     # Entry point
│   └── .env             # Configuration
│
└── mobile/
    ├── app/
    │   ├── (auth)/      # Login/Signup
    │   └── (tabs)/      # Main app
    └── services/        # API calls
```

## Support

If you encounter any issues:

1. Check the error message carefully
2. Verify all environment variables are set
3. Ensure all services (MongoDB, Backend) are running
4. Check that your device/emulator can reach the backend
5. Try restarting everything

## Success! 🎉

You now have a fully functional social media app! Explore the code, make changes, and build something amazing!

---

**Happy Coding!** 🚀
