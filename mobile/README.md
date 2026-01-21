# Social App Mobile

A React Native mobile application for iOS and Android built with Expo.

## Features

- 📱 Cross-platform (iOS & Android)
- 🔐 User Authentication
- 👤 User Profiles
- 📝 Create Posts (text, images, videos, links)
- 💬 Like and Comment on Posts
- 📰 Personalized Feed
- 🔍 Discover Feed
- 🔎 User Search
- 👥 Follow/Unfollow Users

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Secure Storage**: Expo SecureStore

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (optional)

## Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `services/api.js`:
```javascript
const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

For iOS Simulator use: `http://localhost:5000/api`
For Android Emulator use: `http://10.0.2.2:5000/api`
For physical devices use: `http://YOUR_COMPUTER_IP:5000/api`

## Running the App

### Start the development server:
```bash
npm start
```

### Run on iOS Simulator (Mac only):
```bash
npm run ios
```

### Run on Android Emulator:
```bash
npm run android
```

### Run on Physical Device:
1. Install the Expo Go app from App Store or Play Store
2. Scan the QR code shown in the terminal
3. Make sure your device is on the same network as your computer

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── login.js
│   │   └── signup.js
│   ├── (tabs)/              # Main app screens with tabs
│   │   ├── index.js         # Feed screen
│   │   ├── discover.js      # Discover feed
│   │   ├── create.js        # Create post
│   │   ├── search.js        # Search users
│   │   └── profile.js       # User profile
│   └── _layout.js           # Root layout with navigation
├── components/
│   └── PostCard.js          # Post component
├── context/
│   └── AuthContext.js       # Authentication context
├── services/
│   ├── api.js               # API configuration
│   └── index.js             # API service functions
├── app.json                 # Expo configuration
├── babel.config.js
└── package.json
```

## Screens

### Authentication
- **Login**: Email and password login
- **Signup**: User registration with username, email, password, and full name

### Main App (Tab Navigation)
- **Feed**: Personalized feed from followed users
- **Discover**: Public posts from all users
- **Create**: Create new posts with text, media, and links
- **Search**: Search for users
- **Profile**: View and edit user profile

## Features in Detail

### Posts
- Create posts with:
  - Text content
  - Multiple images/videos
  - Embedded links with preview
- Like and unlike posts
- Comment on posts
- View post author profiles

### User Profiles
- View user information
- See followers and following counts
- Edit profile (bio, username, etc.)
- Upload profile picture and cover photo
- Follow/unfollow users

### Feed
- Personalized feed based on following
- Pull to refresh
- Infinite scroll pagination
- Real-time like and comment counts

## Development Tips

### Debugging
- Press `j` in the Expo terminal to open the debugger
- Use React Native Debugger for better debugging experience
- Check Expo logs for error messages

### Hot Reload
- Changes to your code will automatically reload the app
- Press `r` in the terminal to manually reload

### Clear Cache
```bash
npx expo start -c
```

## Building for Production

### iOS (Mac only with Apple Developer Account)
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Note: You'll need to set up EAS (Expo Application Services) for production builds.

## Environment Configuration

The app expects the backend API to be running. Make sure to:

1. Start the backend server
2. Update the API_URL in `services/api.js` to point to your backend
3. Ensure your device/emulator can reach the backend server

## Troubleshooting

### Can't connect to backend
- Make sure backend server is running
- Check that API_URL is correct for your setup
- For Android Emulator, use `10.0.2.2` instead of `localhost`
- For physical devices, use your computer's local IP address

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### Image picker not working
- Make sure you've granted camera roll permissions
- On iOS simulator, you may need to add photos to the simulator

## License

ISC
