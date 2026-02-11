# JWT Quick Reference Card

## 🔐 Generate Strong Secret (Run Once)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Then update `.env` with the generated secret.

---

## 📋 Common Code Snippets

### Backend - Generate Token
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: user._id },           // Payload
  process.env.JWT_SECRET,     // Secret
  { expiresIn: '7d' }         // Options
);
```

### Backend - Verify Token
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// decoded = { id: "user_id", iat: 1234567890, exp: 1234567890 }
```

### Backend - Protected Route
```javascript
const { protect } = require('../middleware/auth');

router.get('/protected', protect, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### Mobile - Store Token
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save token
await AsyncStorage.setItem('userToken', token);

// Get token
const token = await AsyncStorage.getItem('userToken');

// Remove token (logout)
await AsyncStorage.removeItem('userToken');
```

### Mobile - Send Token in Request
```javascript
// Using axios
axios.get('/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Using fetch
fetch('http://localhost:5000/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🧪 Test Commands

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route
```bash
# Replace YOUR_TOKEN with actual token from login/signup
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Not authorized, no token` | Missing Authorization header | Add `Authorization: Bearer <token>` |
| `Not authorized, token failed` | Invalid/expired token | Login again to get new token |
| `User not found` | User deleted but token still valid | Login again |
| `jwt expired` | Token older than JWT_EXPIRE | Login again |
| `jwt malformed` | Invalid token format | Check token format: `Bearer <token>` |

---

## 🔄 Token Flow

```
1. User Signs Up/Logs In
   ↓
2. Server Generates JWT Token
   ↓
3. Token Sent to Client
   ↓
4. Client Stores Token (AsyncStorage/localStorage)
   ↓
5. Client Sends Token with Each Request
   ↓
6. Server Verifies Token (middleware)
   ↓
7. Server Attaches User to req.user
   ↓
8. Controller Accesses req.user
```

---

## 📊 Environment Variables

```env
# Required
JWT_SECRET=your_super_long_random_secret_key_here
JWT_EXPIRE=7d

# Options for JWT_EXPIRE:
# 60, "2 days", "10h", "7d", "1y"
```

---

## 🛠️ Debugging Tips

### 1. Decode Token (without verification)
```bash
# Visit https://jwt.io and paste your token
# Or use Node.js:
node -e "console.log(JSON.parse(Buffer.from('YOUR_TOKEN'.split('.')[1], 'base64').toString()))"
```

### 2. Check Token Expiration
```javascript
const jwt = require('jsonwebtoken');
const decoded = jwt.decode(token); // Don't verify, just decode
console.log('Expires:', new Date(decoded.exp * 1000));
console.log('Issued:', new Date(decoded.iat * 1000));
```

### 3. Test Token in Middleware
```javascript
// Add console.log in auth.js
console.log('Token:', token);
console.log('Decoded:', decoded);
console.log('User:', req.user);
```

---

## 🚀 Routes Summary

### Public Routes (No Token Required)
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### Protected Routes (Token Required)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/follow` - Follow user

---

## 🔒 Security Checklist

- [ ] Changed JWT_SECRET from default
- [ ] JWT_SECRET is 32+ characters
- [ ] JWT_SECRET not committed to Git
- [ ] HTTPS enabled in production
- [ ] Passwords hashed with bcrypt
- [ ] Token expiration set appropriately
- [ ] Rate limiting implemented (recommended)
- [ ] Input validation on all routes

---

**Quick Start:** See `JWT_GUIDE.md` for detailed explanations!
