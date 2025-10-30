# Backend API Setup Instructions

## 📋 Overview

The backend API is a Node.js/Express server that handles photo restoration requests from the mobile app.

## 🚀 Quick Start

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

**IMPORTANT:** Create a `.env` file in the `backend` directory and add your OpenAI API key:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
ENABLE_GRAYSCALE=false
```

To get your OpenAI API key:
1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Create a new API key
4. Copy and paste it into the `.env` file

⚠️ **Security Note:** Never commit your `.env` file to Git! It's already in `.gitignore`.

### 4. Start the Server

```bash
npm start
```

Or with auto-reload for development:
```bash
npm run dev
```

## 📱 Connect Mobile App to Backend

### Option A: Local Development (Emulator)

In `app/restore-process.tsx`, update line 78:

```typescript
const API_URL = 'http://localhost:3000/restore';
```

### Option B: Physical Device Testing

1. **Find your computer's IP address:**

   **Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

   **Mac:**
   ```bash
   ifconfig | grep "inet "
   ```

   **Linux:**
   ```bash
   hostname -I
   ```

2. **Update API URL in `app/restore-process.tsx` (line 78):**

   ```typescript
   const API_URL = 'http://192.168.1.100:3000/restore';
   ```
   Replace `192.168.1.100` with your actual IP address.

3. **Make sure:**
   - Your phone and computer are on the same WiFi network
   - Your firewall allows connections on port 3000

## 🧪 Test the API

### Browser Test
Visit: `http://localhost:3000/health`

You should see:
```json
{
  "status": "ok",
  "message": "Photo Restore API is running"
}
```

### cURL Test

```bash
curl -X POST http://localhost:3000/restore \
  -F "image=@path/to/your/photo.jpg" \
  -F "repairScratches=true" \
  -F "colorizePhoto=false" \
  -F "improveClarity=true"
```

## 📁 Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── README.md          # Detailed documentation
├── SETUP.md          # Setup guide
├── .gitignore        # Git ignore
├── uploads/          # Temporary uploaded files (auto-created)
└── restored/         # Processed images (auto-created)
```

## 🎯 What the API Does

1. **Receives** images from the mobile app
2. **Processes** them with:
   - Noise reduction (repair scratches)
   - Sharpening & clarity enhancement
   - Color enhancement & colorization
3. **Returns** the URL of the restored image
4. **Serves** the restored images via HTTP

## 🔧 Technologies Used

- **Express** - Web framework
- **Multer** - File upload handling
- **Sharp** - High-performance image processing
- **CORS** - Cross-origin support

## 📦 Dependencies Installed

After running `npm install`, you'll have:
- express (^4.18.2)
- multer (^1.4.5)
- sharp (^0.33.0)
- cors (^2.8.5)
- dotenv (^16.3.1)
- uuid (^9.0.1)
- nodemon (dev dependency)

## ⚙️ Configuration

### Environment Variables

The backend uses the following environment variables (configure in `.env` file):

```
# Required
OPENAI_API_KEY=sk-your-api-key-here    # Your OpenAI API key

# Optional
PORT=3000                               # Server port (default: 3000)
ENABLE_GRAYSCALE=false                  # Force grayscale output (default: false)
```

### Security Best Practices

- ✅ **DO:** Keep your `.env` file secure and never share it
- ✅ **DO:** Use `.env.example` as a template (safe to commit)
- ❌ **DON'T:** Commit `.env` to Git (already in `.gitignore`)
- ❌ **DON'T:** Share your OpenAI API key publicly

## 🌐 Deployment (Optional)

### Deploy to Railway:
1. Push code to GitHub
2. Connect to Railway
3. Deploy automatically
4. Get production URL

### Deploy to Render:
1. Connect GitHub repository
2. Create new Web Service
3. Build: `cd backend && npm install`
4. Start: `cd backend && npm start`

### Deploy to Heroku:
```bash
heroku create your-app-name
git push heroku main
```

Then update mobile app with production URL:
```typescript
const API_URL = 'https://your-app-name.herokuapp.com/restore';
```

## 🐛 Troubleshooting

### Port already in use:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9   # Mac/Linux
netstat -ano | findstr :3000     # Windows
```

### Sharp installation issues:
```bash
npm rebuild sharp
```

### Can't connect from mobile:
- Verify server is running
- Check IP address is correct
- Ensure same WiFi network
- Check firewall settings

## 📖 Full Documentation

See `backend/README.md` for complete documentation including:
- Advanced AI integration
- Production deployment guides
- Security best practices
- API specifications

## ✅ Verification

Once running, you should see in terminal:
```
🚀 Photo Restore API server running on port 3000
📍 Server URL: http://localhost:3000
🔗 Restore endpoint: http://localhost:3000/restore
💚 Health check: http://localhost:3000/health
```

Your backend is now ready! 🎉

