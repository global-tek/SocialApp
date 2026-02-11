# Node.js Version Fix for Expo

## Problem
You encountered this error:
```
SyntaxError: Unexpected token '.'
```

This is because your Node.js version (v12.22.9) is too old for Expo, which requires Node.js v14+.

## Solution

### 1. Update Node.js to v18 LTS

The installation command has been run. After it completes, verify:

```bash
node --version   # Should show v18.x.x
npm --version    # Should show v9.x.x
```

### 2. Clean Mobile App Dependencies

```bash
cd /home/rover/SocialApp/mobile
rm -rf node_modules package-lock.json
npm install
```

### 3. Clean Backend Dependencies (Optional but Recommended)

```bash
cd /home/rover/SocialApp/backend
rm -rf node_modules package-lock.json
npm install
```

### 4. Start the Mobile App

```bash
cd /home/rover/SocialApp/mobile
npm start
```

## Version Requirements

### Minimum Versions
- **Node.js**: v14.0.0+
- **npm**: v7.0.0+

### Recommended Versions (2026)
- **Node.js**: v18.x LTS or v20.x LTS
- **npm**: v9.x or v10.x

### Why Expo Needs Node.js 14+

Expo and its dependencies use modern JavaScript features:
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- BigInt support
- ES2020+ features

These features are only available in Node.js v14 and above.

## Alternative: Use NVM

If you need to manage multiple Node.js versions:

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source the profile
source ~/.bashrc

# Install Node.js v18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
```

## Troubleshooting

### If you still see the error after updating:

1. **Verify Node.js version is actually updated:**
   ```bash
   which node
   node --version
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Reinstall global npm packages:**
   ```bash
   npm install -g npm@latest
   npm install -g expo-cli
   ```

4. **Complete clean reinstall:**
   ```bash
   cd /home/rover/SocialApp/mobile
   rm -rf node_modules package-lock.json
   npm install
   ```

### If installation fails:

Try using NodeSource repository directly:
```bash
# Remove old Node.js
sudo apt-get purge nodejs npm

# Install Node.js v18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

## After Fix

Once Node.js is updated and packages reinstalled:

1. **Start backend:**
   ```bash
   cd /home/rover/SocialApp/backend
   npm run dev
   ```

2. **Start mobile app (in new terminal):**
   ```bash
   cd /home/rover/SocialApp/mobile
   npm start
   ```

3. **Follow Expo instructions:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Success Indicators

✅ `node --version` shows v18.x.x or higher  
✅ No syntax errors when running `npm start`  
✅ Expo dev server starts successfully  
✅ QR code appears in terminal  

---

**Note:** The Node.js installation is currently running. Wait for it to complete, then follow steps 2-4 above.
