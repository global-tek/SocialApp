# JWT (JSON Web Tokens) Guide for SocialApp

## 🎯 What is JWT?

**JWT (JSON Web Token)** is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. In our SocialApp, JWT is used for **authentication and authorization**.

## 🔑 Why We Use JWT

1. **Stateless Authentication** - The server doesn't need to store session data
2. **Scalability** - Perfect for distributed systems and microservices
3. **Cross-Domain/CORS** - Works seamlessly across different domains
4. **Mobile-Friendly** - Easy to use in mobile apps (React Native)
5. **Self-Contained** - Token contains all necessary user information

## 📦 JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
header.payload.signature
```

### Example Token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2FiYzEyMzQ1Njc4OWFiY2RlZiIsImlhdCI6MTcwNjE4NDAwMCwiZXhwIjoxNzA2Nzg4ODAwfQ.K7xTJdM_9q3VnN8pZ2RkYmFzZTY0LXNpZ25hdHVyZQ
```

### 1. Header (Red)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
- **alg**: Algorithm used (HMAC SHA256)
- **typ**: Token type (JWT)

### 2. Payload (Purple)
```json
{
  "id": "657abc123456789abcdef",
  "iat": 1706184000,
  "exp": 1706788800
}
```
- **id**: User ID from MongoDB
- **iat**: Issued at timestamp
- **exp**: Expiration timestamp

### 3. Signature (Blue)
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```
- Ensures the token hasn't been tampered with
- Uses your `JWT_SECRET` from `.env`

---

## 🏗️ How JWT Works in Our SocialApp

### Authentication Flow:

```
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│   Mobile    │                 │   Backend   │                 │  Database   │
│     App     │                 │   Server    │                 │  (MongoDB)  │
└─────────────┘                 └─────────────┘                 └─────────────┘
      │                                │                                │
      │  1. POST /api/auth/signup     │                                │
      │  (username, email, password)  │                                │
      ├──────────────────────────────>│                                │
      │                                │  2. Hash password & Create user│
      │                                ├───────────────────────────────>│
      │                                │                                │
      │                                │  3. User created successfully  │
      │                                │<───────────────────────────────┤
      │                                │                                │
      │                                │  4. Generate JWT token         │
      │                                │     jwt.sign({ id: user._id }) │
      │                                │                                │
      │  5. Return user data + token  │                                │
      │<──────────────────────────────┤                                │
      │  { user: {...}, token: "..." }│                                │
      │                                │                                │
      │  6. Store token in AsyncStorage                                │
      │     (Mobile App)               │                                │
      │                                │                                │
```

### Accessing Protected Routes:

```
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│   Mobile    │                 │   Backend   │                 │  Database   │
│     App     │                 │   Server    │                 │  (MongoDB)  │
└─────────────┘                 └─────────────┘                 └─────────────┘
      │                                │                                │
      │  7. GET /api/posts             │                                │
      │  Header: Authorization:        │                                │
      │  Bearer eyJhbGci...            │                                │
      ├──────────────────────────────>│                                │
      │                                │  8. auth.js middleware         │
      │                                │     - Extract token            │
      │                                │     - Verify with JWT_SECRET   │
      │                                │     - Decode user ID           │
      │                                │                                │
      │                                │  9. Find user by ID            │
      │                                ├───────────────────────────────>│
      │                                │                                │
      │                                │  10. User data returned        │
      │                                │<───────────────────────────────┤
      │                                │                                │
      │                                │  11. Attach user to req.user   │
      │                                │      Continue to controller    │
      │                                │                                │
      │  12. Return posts data         │                                │
      │<──────────────────────────────┤                                │
```

---

## 📂 Implementation in Your Project

### 1. Environment Configuration (`.env`)

```env
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

**Important Security Notes:**
- ⚠️ **Change `JWT_SECRET` in production!** Use a long, random string (32+ characters)
- Generate a strong secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit `.env` to Git (add to `.gitignore`)

### 2. Token Generation (`authController.js`)

Located in: `backend/src/controllers/authController.js`

```javascript
const generateToken = (id) => {
  return jwt.sign(
    { id },                         // Payload: User ID
    process.env.JWT_SECRET,         // Secret key
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Expires in 7 days
  );
};
```

**Used in:**
- ✅ `signup()` - When new user registers
- ✅ `login()` - When user logs in

**Response format:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "123...",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Token Verification (`auth.js` middleware)

Located in: `backend/src/middleware/auth.js`

```javascript
const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists with Bearer token
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // 2. Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded = { id: "user_id", iat: timestamp, exp: timestamp }

      // 4. Fetch user from database (without password)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Check if user still exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // 6. Continue to next middleware/controller
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};
```

### 4. Protected Routes

The `protect` middleware is used on routes that require authentication:

**Example in `routes/posts.js`:**
```javascript
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllPosts);        // Protected
router.post('/', protect, createPost);        // Protected
router.get('/:id', protect, getPostById);     // Protected
router.delete('/:id', protect, deletePost);   // Protected
```

**Example in `routes/auth.js`:**
```javascript
router.post('/signup', signup);               // Public
router.post('/login', login);                 // Public
router.get('/me', protect, getMe);            // Protected
router.put('/update-password', protect, updatePassword); // Protected
```

---

## 📱 Mobile App Integration

### Storing Token (React Native)

In your mobile app (`mobile/context/AuthContext.js`):

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// After login/signup
const token = response.data.token;
await AsyncStorage.setItem('userToken', token);
```

### Sending Token with Requests

In `mobile/services/api.js`:

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Intercept all requests and add token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔒 Security Best Practices

### ✅ Already Implemented:
1. ✅ Password hashing with bcrypt (in User model)
2. ✅ Password excluded from queries by default (`select: false`)
3. ✅ Token expiration (7 days)
4. ✅ HTTPS ready (use in production)

### 🚨 Important Security Improvements:

#### 1. Update JWT_SECRET in Production
```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 2. Add Token Refresh (Optional Enhancement)
Create a refresh token system for better security:
- Access token: Short-lived (15 minutes)
- Refresh token: Long-lived (7 days)

#### 3. Add Rate Limiting
Install and configure:
```bash
npm install express-rate-limit
```

#### 4. HTTPS in Production
Always use HTTPS to prevent token interception.

---

## 🧪 Testing JWT

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Use Token to Access Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

**Response:**
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Not authorized, no token"
**Cause:** Token not sent in request
**Solution:** Make sure you're sending the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue 2: "Not authorized, token failed"
**Causes:**
- Token expired (older than 7 days)
- Invalid token format
- JWT_SECRET changed
- Token tampered with

**Solution:** 
- Login again to get a new token
- Check token format: `Bearer <token>`
- Verify JWT_SECRET matches

### Issue 3: Token Expires Too Quickly
**Solution:** Update `.env`:
```env
JWT_EXPIRE=30d  # 30 days
# or
JWT_EXPIRE=24h  # 24 hours
```

---

## 📊 Token Lifecycle

```
Day 0: User logs in
       ↓
       Token generated (expires in 7 days)
       ↓
       Token stored in mobile app
       ↓
Day 1-6: Token valid ✅
       ↓
       All requests work with token
       ↓
Day 7: Token expires ⏰
       ↓
       401 Unauthorized error
       ↓
       User must login again
```

---

## 🎓 Summary

### What JWT Does in Your SocialApp:

1. **Authentication** - Verifies user identity
2. **Authorization** - Grants access to protected resources
3. **Stateless** - No server-side session storage needed
4. **Secure** - Cryptographically signed to prevent tampering
5. **Portable** - Works across web, mobile, and APIs

### Key Files:
- 📄 `.env` - JWT configuration
- 📄 `authController.js` - Token generation
- 📄 `middleware/auth.js` - Token verification
- 📄 `models/User.js` - User model with password hashing
- 📄 All route files - Use `protect` middleware for secured routes

### Next Steps:
1. ✅ JWT is already set up
2. ⚠️ Change `JWT_SECRET` before production
3. 🚀 Test with your mobile app
4. 📚 Consider adding refresh tokens for better security

---

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - Decode and verify JWTs
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519) - Official specification
- [OWASP JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) - Security best practices

---

**Need help?** Feel free to ask questions about JWT implementation! 🚀
