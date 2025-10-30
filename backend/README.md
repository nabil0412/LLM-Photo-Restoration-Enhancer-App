# Photo Restore AI - Backend API

Node.js/Express backend API for the Photo Restore AI mobile application with **OpenAI DALL-E 2 Image Edit API** integration.

## Features

- ✅ **AI-Powered Restoration** - Uses OpenAI DALL-E 2 Image Edit API (direct image-to-image)
- ✅ **Global Grayscale Control** - Environment variable to force B&W or allow colors
- ✅ Image upload handling with Multer
- ✅ Smart prompt generation based on user options
- ✅ RESTful API endpoints
- ✅ Ad token security system
- ✅ CORS support for mobile app integration
- ✅ Comprehensive logging for debugging
- ✅ Error handling and validation
- ✅ Static file serving for restored images
- ✅ Health check endpoint

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **OpenAI** - DALL-E 2 Image Edit API (direct restoration)
- **Multer** - File upload handling
- **Sharp** - Image format conversion (JPEG to PNG for OpenAI API)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- **UUID** - Unique filename generation

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
# backend/.env
PORT=3000
OPENAI_API_KEY=sk-your-actual-api-key-here
ENABLE_GRAYSCALE=true   # 'true' = force B&W, 'false' = allow colors
```

**Get your OpenAI API key:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file

**Important:** OpenAI API key is **required** - there is no fallback processing.

**Grayscale Configuration:**
- `ENABLE_GRAYSCALE=true`: All images converted to B&W
- `ENABLE_GRAYSCALE=false`: Respects user's colorize option

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /restore

Restore and enhance a photo.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file) - The photo to restore
  - `repairScratches` (string) - "true" or "false"
  - `colorizePhoto` (string) - "true" or "false"
  - `improveClarity` (string) - "true" or "false"

**Response:**
```json
{
  "success": true,
  "restoredImageUrl": "http://localhost:3000/restored/restored-abc123.jpg",
  "options": {
    "repairScratches": true,
    "colorizePhoto": false,
    "improveClarity": true
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Photo Restore API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /

API information.

## Image Processing

The API uses Sharp for image processing with the following techniques:

### Repair Scratches
- Median filter for noise reduction
- Sharpening to restore details

### Improve Clarity
- Contrast normalization
- Advanced sharpening
- Brightness and saturation enhancement

### Colorize Photo
- Color saturation boost
- Warm tone tinting
- (In production, integrate AI colorization models)

## Testing

### Using cURL

```bash
curl -X POST http://localhost:3000/restore \
  -F "image=@/path/to/photo.jpg" \
  -F "repairScratches=true" \
  -F "colorizePhoto=false" \
  -F "improveClarity=true"
```

### Using Postman

1. Create a new POST request to `http://localhost:3000/restore`
2. In Body, select "form-data"
3. Add key "image" with type "File" and upload a photo
4. Add keys "repairScratches", "colorizePhoto", "improveClarity" with values "true"/"false"
5. Send request

## Connecting to Mobile App

Update the API URL in your React Native app (`app/restore-process.tsx`):

```typescript
// For local development
const API_URL = 'http://localhost:3000/restore';

// For production
const API_URL = 'https://your-domain.com/restore';
```

### Testing on Mobile Device

If testing on a physical device, use your computer's local IP:

```typescript
const API_URL = 'http://192.168.1.100:3000/restore';
```

Find your IP:
- **Windows:** `ipconfig`
- **Mac/Linux:** `ifconfig` or `ip addr`

## Production Deployment

### Deploy to Heroku

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Deploy:
```bash
git push heroku main
```

3. Set environment variables:
```bash
heroku config:set PORT=3000
```

### Deploy to Railway

1. Connect your GitHub repository
2. Select the backend folder
3. Deploy automatically

### Deploy to Render

1. Create a new Web Service
2. Connect repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`

## Advanced AI Integration

To integrate advanced AI models:

### Option 1: Replicate API

```javascript
const Replicate = require('replicate');
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// For colorization
const output = await replicate.run(
  "arielreplicate/deoldify_image:0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
  { input: { image: imageUrl } }
);
```

### Option 2: DeepAI

```javascript
const axios = require('axios');

const response = await axios.post('https://api.deepai.org/api/colorizer', {
  image: fs.createReadStream(imagePath)
}, {
  headers: { 'api-key': process.env.DEEPAI_API_KEY }
});
```

### Option 3: Custom ML Model

Deploy your own PyTorch/TensorFlow model and call it from Node.js.

## File Structure

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
├── uploads/           # Temporary uploaded files
├── restored/          # Processed images
└── README.md          # This file
```

## Security Considerations

- ✅ File type validation (images only)
- ✅ File size limit (10MB)
- ✅ Temporary file cleanup
- ⚠️ Add authentication for production
- ⚠️ Add rate limiting
- ⚠️ Use cloud storage (S3, Cloudinary) for production

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Sharp installation issues
```bash
npm rebuild sharp
```

## License

MIT

