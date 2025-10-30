# Quick Setup Guide

## Step 1: Install Node.js

Make sure you have Node.js installed (v14 or higher):
```bash
node --version
```

If not installed, download from: https://nodejs.org/

## Step 2: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web server)
- multer (file uploads)
- sharp (image processing)
- cors (cross-origin support)
- And other dependencies...

## Step 3: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
🚀 Photo Restore API server running on port 3000
📍 Server URL: http://localhost:3000
🔗 Restore endpoint: http://localhost:3000/restore
💚 Health check: http://localhost:3000/health
```

## Step 4: Test the API

Open your browser and go to:
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Photo Restore API is running"
}
```

## Step 5: Connect to Mobile App

In your React Native app, update the API URL in `app/restore-process.tsx` (line 78):

```typescript
const API_URL = 'http://localhost:3000/restore';
```

### For Testing on Physical Device:

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac: System Preferences > Network
   - Linux: `ip addr`

2. Update the API URL:
```typescript
const API_URL = 'http://192.168.1.XXX:3000/restore';
```

Replace `192.168.1.XXX` with your actual IP address.

3. Make sure your phone and computer are on the same WiFi network.

## Step 6: Test the Complete Flow

1. Start the backend server (this terminal)
2. Start the mobile app: `npx expo start`
3. Open the app on your device
4. Go through the flow and test photo restoration!

## Troubleshooting

### Error: Port 3000 already in use

Change the port in backend or kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: Cannot find module 'sharp'

Rebuild sharp:
```bash
npm rebuild sharp
```

Or reinstall:
```bash
npm uninstall sharp
npm install sharp
```

### Mobile app can't connect

- Check firewall settings
- Make sure both devices are on same network
- Use your computer's IP address, not localhost
- Check if server is actually running

## Next Steps

- Deploy to production (Heroku, Railway, Render)
- Add authentication
- Integrate real AI models
- Add cloud storage (S3, Cloudinary)
- Add rate limiting
- Add logging

