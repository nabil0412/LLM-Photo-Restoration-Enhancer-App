# Photo Restore AI - Quick Start Guide

## 🎯 Complete Setup (2 terminals)

### Terminal 1: Start Backend API

```bash
cd backend
npm install

# Create .env file and add your OpenAI API key
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=sk-your-actual-key-here

npm start
```

⚠️ **Important:** You must add your OpenAI API key to the `.env` file!
- Get it from: https://platform.openai.com/api-keys
- Never commit your `.env` file to Git (it's already in `.gitignore`)

You should see:
```
🚀 Photo Restore API server running on port 3000
```

### Terminal 2: Start Mobile App

```bash
npx expo start
```

Then press:
- `w` for web
- `a` for Android emulator
- `i` for iOS simulator
- Or scan QR code with Expo Go app

## 📱 Complete App Flow

1. **Home Screen** - Tap "Restore Photo"
2. **Select Photo** - Choose "Upload from Gallery" or "Use Camera"
3. **Edit Photo** - Rotate/Flip your image, tap "Next"
4. **Enhancement Options** - Toggle restoration options, tap "Restore"
5. **Ad Screen** - Wait 5 seconds (unskippable)
6. **Processing** - Photo is sent to backend API
7. **Before/After** - Use slider to compare, save to device!

## 🔌 Backend API

### What It Does:
- Receives images from mobile app
- Applies restoration effects:
  - **Repair Scratches**: Noise reduction + sharpening
  - **Improve Clarity**: Contrast + brightness enhancement
  - **Colorize Photo**: Color saturation boost
- Returns processed image URL
- Serves restored images

### Tech Stack:
- Node.js + Express
- Multer (file uploads)
- Sharp (image processing)
- CORS enabled

### Endpoints:
- `POST /restore` - Process photo
- `GET /health` - Health check
- `GET /` - API info

## 📂 Project Structure

```
PRV2/
├── app/                          # React Native App
│   ├── (tabs)/
│   │   ├── index.tsx            # Home Screen (animated stars)
│   │   └── explore.tsx          # Photo Selection
│   ├── edit-photo.tsx           # Crop & Rotate
│   ├── restoration-options.tsx  # Enhancement Options
│   ├── ad-screen.tsx            # 5-second Ad
│   └── restore-process.tsx      # Processing & Results
│
├── backend/                      # Node.js API
│   ├── server.js                # Main server
│   ├── package.json             # Dependencies
│   ├── uploads/                 # Temp uploads (auto-created)
│   └── restored/                # Processed images (auto-created)
│
└── docs/
    ├── BACKEND_SETUP.md         # Backend setup guide
    ├── API_INTEGRATION.md       # API documentation
    └── QUICK_START.md           # This file
```

## 🧪 Testing

### Test Backend (Browser):
```
http://localhost:3000/health
```

### Test with cURL:
```bash
curl -X POST http://localhost:3000/restore \
  -F "image=@photo.jpg" \
  -F "repairScratches=true" \
  -F "colorizePhoto=false" \
  -F "improveClarity=true"
```

## 📱 Testing on Physical Device

1. **Find your computer's IP:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig | grep "inet "
   ```

2. **Update API URL** in `app/restore-process.tsx` (line 81):
   ```typescript
   const API_URL = 'http://192.168.1.100:3000/restore';
   ```
   (Replace with your IP)

3. **Ensure same WiFi network**

## ✨ Features Implemented

### Mobile App:
- ✅ Animated twinkling stars on home screen
- ✅ Gallery & camera photo selection
- ✅ Photo rotation and flipping
- ✅ Enhancement option toggles
- ✅ 5-second unskippable ad
- ✅ Backend API integration
- ✅ Interactive before/after slider
- ✅ Save restored photo to device
- ✅ Beautiful modern UI

### Backend API:
- ✅ Image upload handling
- ✅ Photo restoration processing
- ✅ Noise reduction
- ✅ Sharpening & clarity
- ✅ Color enhancement
- ✅ Error handling
- ✅ CORS support
- ✅ Static file serving

## 🔧 Configuration

### Backend Environment Variables:
Edit `backend/.env`:
```
# Required
OPENAI_API_KEY=sk-your-actual-key-here

# Optional
PORT=3000
ENABLE_GRAYSCALE=false
```

⚠️ **Never share or commit your `.env` file!**

### Update Mobile API URL:
Edit `app/restore-process.tsx` line 81:
```typescript
const API_URL = 'http://YOUR_IP:3000/restore';
```

## 🚀 Deployment

### Backend Options:
- **Railway**: Easiest, auto-deploy from GitHub
- **Render**: Free tier available
- **Heroku**: Classic choice
- **Vercel**: Serverless functions

### After Deployment:
Update mobile app API URL to production:
```typescript
const API_URL = 'https://your-app.railway.app/restore';
```

## 📝 Next Steps

1. ✅ Test the complete flow locally
2. 🔄 Integrate advanced AI models (optional)
3. 🌐 Deploy backend to production
4. 📱 Build mobile app for stores
5. 🎨 Customize UI/branding
6. 🔐 Add authentication
7. 📊 Add analytics

## 🐛 Common Issues

### Backend won't start:
```bash
# Check if port is in use
lsof -ti:3000 | xargs kill -9

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Mobile can't connect:
- Check server is running
- Verify IP address
- Check firewall
- Ensure same WiFi

### Sharp installation fails:
```bash
npm rebuild sharp
```

## 📚 Documentation

- `BACKEND_SETUP.md` - Complete backend setup
- `API_INTEGRATION.md` - API specifications
- `backend/README.md` - Detailed backend docs

## 🎉 You're Ready!

Both your mobile app and backend API are fully functional! Test the complete flow and enjoy your Photo Restore AI application! 📸✨

