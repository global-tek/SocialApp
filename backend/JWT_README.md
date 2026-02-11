# 🔐 JWT Authentication Documentation

Complete guide to understanding and implementing JWT (JSON Web Tokens) in the SocialApp project.

---

## 📚 Documentation Files

This directory contains comprehensive JWT authentication documentation:

### 1. **JWT_GUIDE.md** 📖
**Start here!** Complete guide covering:
- What JWT is and why we use it
- JWT structure (header, payload, signature)
- How JWT works in our SocialApp
- Implementation details for all components
- Security best practices
- Testing and troubleshooting

### 2. **JWT_FLOW_DIAGRAM.md** 🎨
Visual diagrams showing:
- Registration flow
- Login flow
- Protected route access
- Token structure
- File structure overview
- Timeline view
- Security flow

### 3. **JWT_QUICK_REFERENCE.md** ⚡
Quick code snippets for:
- Generating tokens
- Verifying tokens
- Protected routes
- Mobile implementation
- Testing commands
- Common errors and solutions

### 4. **JWT_MOBILE_EXAMPLES.md** 📱
Complete mobile app integration:
- API service setup with interceptors
- AuthContext implementation
- Login/Signup screens
- Making authenticated requests
- Protected navigation
- Profile and logout functionality

---

## 🚀 Quick Start

### 1. Verify JWT is Set Up

Your JWT implementation is already configured! Check these files:

- ✅ `backend/.env` - JWT configuration
- ✅ `backend/src/controllers/authController.js` - Token generation
- ✅ `backend/src/middleware/auth.js` - Token verification
- ✅ `backend/src/models/User.js` - Password hashing

### 2. Update JWT Secret (Important!)

For security, generate a new JWT secret:

```bash
cd /home/rover/SocialApp/backend
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then update your `.env` file:

```env
JWT_SECRET=<paste_generated_secret_here>
```

### 3. Test Your Setup

Start the backend server:

```bash
cd /home/rover/SocialApp/backend
npm install
npm run dev
```

Test registration:

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

You should receive a response with a token!

---

## 🎯 How JWT Works in Your Project

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Mobile App  │ ───→  │   Backend   │ ───→  │   MongoDB   │
│             │       │   Server    │       │             │
│ 1. Login    │       │ 2. Verify   │       │ 3. Store    │
│             │       │    Generate │       │             │
│ 4. Store    │ ←───  │    Token    │       │             │
│    Token    │       │             │       │             │
│             │       │             │       │             │
│ 5. Send     │ ───→  │ 6. Verify   │       │             │
│    Token    │       │    Token    │       │             │
│             │       │             │       │             │
│ 7. Access   │ ←───  │ 8. Grant    │       │             │
│    Data     │       │    Access   │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
```

---

## 📂 Project Structure

```
SocialApp/
├── backend/
│   ├── .env                    🔒 JWT_SECRET stored here
│   ├── JWT_GUIDE.md           📖 Complete guide (YOU ARE HERE)
│   ├── JWT_FLOW_DIAGRAM.md    🎨 Visual diagrams
│   ├── JWT_QUICK_REFERENCE.md ⚡ Quick snippets
│   ├── JWT_MOBILE_EXAMPLES.md 📱 Mobile integration
│   └── src/
│       ├── middleware/
│       │   └── auth.js        🛡️ Token verification
│       ├── controllers/
│       │   └── authController.js 🔑 Token generation
│       ├── models/
│       │   └── User.js        👤 User model
│       └── routes/
│           ├── auth.js        🚪 Auth routes
│           └── posts.js       🔒 Protected routes
│
└── mobile/
    ├── context/
    │   └── AuthContext.js     📱 Auth state management
    └── services/
        └── api.js             🌐 HTTP client with JWT
```

---

## 🔑 Key Concepts

### What is JWT?

JWT (JSON Web Token) is a secure way to transmit information between parties. In our app:

- **Replaces sessions** - No server-side storage needed
- **Stateless** - Token contains all user info
- **Secure** - Cryptographically signed
- **Portable** - Works across web, mobile, APIs

### JWT Structure

```
eyJhbGci...   .   eyJpZCI6...   .   K7xTJdM...
  Header           Payload          Signature
```

### Token Lifecycle

1. User logs in → Server generates token (valid 7 days)
2. Client stores token → AsyncStorage (mobile) or localStorage (web)
3. Client sends token → Every request to protected routes
4. Server verifies token → Checks signature and expiration
5. Token expires → User must login again

---

## 🛡️ Security Features

Your JWT implementation includes:

✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Token Expiration** - 7 days default  
✅ **Signature Verification** - Prevents tampering  
✅ **Protected Routes** - Middleware authentication  
✅ **Secure Storage** - AsyncStorage for mobile  
✅ **Error Handling** - 401 for unauthorized access  

---

## 🧪 Testing Guide

### 1. Test User Registration

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

**Expected Response:**
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

### 2. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route

```bash
# Save the token from login/signup response
TOKEN="your_token_here"

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

---

## 🐛 Common Issues

### Issue: "Not authorized, no token"
**Solution:** Make sure you're sending the Authorization header:
```
Authorization: Bearer <token>
```

### Issue: "Not authorized, token failed"
**Causes:**
- Token expired (older than 7 days)
- Invalid token format
- JWT_SECRET changed
- Token tampered with

**Solution:** Login again to get a new token

### Issue: Token expires too quickly
**Solution:** Update `JWT_EXPIRE` in `.env`:
```env
JWT_EXPIRE=30d  # 30 days
```

---

## 📱 Mobile App Integration

See `JWT_MOBILE_EXAMPLES.md` for complete code examples including:

- Setting up API service with interceptors
- Creating AuthContext
- Login/Signup screens
- Making authenticated requests
- Protected navigation
- Logout functionality

**Quick snippet:**

```javascript
// Send authenticated request
const response = await api.get('/posts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔒 Security Best Practices

### ✅ Already Implemented

1. Password hashing with bcrypt
2. Token expiration (7 days)
3. Signature verification
4. Protected route middleware
5. Error handling for invalid tokens

### ⚠️ Recommendations

1. **Change JWT_SECRET in production**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Use HTTPS in production**
   - Prevents token interception
   - Essential for security

3. **Implement refresh tokens** (optional)
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)

4. **Add rate limiting**
   ```bash
   npm install express-rate-limit
   ```

---

## 📖 Learn More

### External Resources

- [JWT.io](https://jwt.io/) - Decode and verify tokens
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519) - Official spec
- [OWASP JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

### Documentation Files

1. **Complete Guide**: `JWT_GUIDE.md`
2. **Visual Diagrams**: `JWT_FLOW_DIAGRAM.md`
3. **Quick Reference**: `JWT_QUICK_REFERENCE.md`
4. **Mobile Examples**: `JWT_MOBILE_EXAMPLES.md`

---

## 💡 Quick Tips

✅ Always send token with `Bearer` prefix  
✅ Store token securely (AsyncStorage on mobile)  
✅ Handle 401 errors globally  
✅ Clear token on logout  
✅ Verify token on app startup  
✅ Use HTTPS in production  
✅ Never commit `.env` to Git  

---

## 🎓 Summary

### What You Have

- ✅ Complete JWT authentication system
- ✅ Token generation (signup/login)
- ✅ Token verification (middleware)
- ✅ Protected routes
- ✅ Password hashing
- ✅ Error handling

### What You Need to Do

1. ⚠️ Change JWT_SECRET before production
2. 📱 Integrate with mobile app (see JWT_MOBILE_EXAMPLES.md)
3. 🧪 Test all endpoints
4. 🚀 Deploy with HTTPS

---

## 🤝 Need Help?

- Read `JWT_GUIDE.md` for detailed explanations
- Check `JWT_QUICK_REFERENCE.md` for code snippets
- See `JWT_FLOW_DIAGRAM.md` for visual guides
- Review `JWT_MOBILE_EXAMPLES.md` for mobile integration

---

**Your JWT authentication is ready to use! 🎉**

Start by testing the endpoints, then integrate with your mobile app.
