# Social App Assets

This directory should contain the following app icons and images:

## Required Files

- `icon.png` - App icon (1024x1024px)
- `splash.png` - Splash screen (1242x2436px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)
- `favicon.png` - Web favicon (48x48px)

## Creating Assets

You can use the following tools to generate these assets:

1. **Figma/Sketch/Adobe XD**: Design your app icon
2. **Expo Asset Generator**: Use `npx expo-icon-generator` to auto-generate all sizes
3. **Online Tools**: 
   - https://makeappicon.com/
   - https://appicon.co/

## Icon Guidelines

### App Icon (icon.png)
- Size: 1024x1024px
- Format: PNG with transparency
- Should work on both light and dark backgrounds
- Keep important content within safe area (center 80%)

### Splash Screen (splash.png)
- Size: 1242x2436px (iPhone 13 Pro Max resolution)
- Format: PNG
- Background color should match `backgroundColor` in app.json
- Center your logo/branding

### Adaptive Icon (Android)
- Size: 1024x1024px
- Format: PNG with transparency
- Safe zone: 432x432px (center)
- Will be cropped to various shapes on different devices

## Placeholder

For development, you can use placeholder images:
- Create simple colored squares with your app name
- Or download free icons from: https://www.flaticon.com/

## After Adding Assets

Remember to restart your Expo development server to see the changes:

```bash
npx expo start -c
```
