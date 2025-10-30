# LLM Photo Restoration Enhancer App

A full-stack mobile application for AI-powered photo restoration using OpenAI's DALL-E 2 API. Built with React Native (Expo) and Node.js/Express.

## Overview

This application allows users to restore and enhance old or damaged photographs using advanced AI technology. Users can upload photos, apply various restoration options, and receive professionally restored images through an intuitive mobile interface.

## Features

### Mobile Application
- Photo selection from gallery or camera
- Interactive photo editing (rotate, flip)
- Multiple restoration options:
  - Repair scratches and damage
  - Colorize black and white photos
  - Improve clarity and sharpness
- Real-time processing status
- Interactive before/after comparison slider
- Save restored photos to device
- Ad-supported model with token-based authentication
- Modern, animated UI with smooth transitions

### Backend API
- Secure image upload handling
- OpenAI DALL-E 2 integration for photo restoration
- Image preprocessing and optimization
- Token-based authorization system
- CORS support for cross-origin requests
- Static file serving for restored images
- Comprehensive error handling
- Environment-based configuration

## Technology Stack

### Frontend
- React Native with Expo
- TypeScript
- Expo Image Picker
- Expo Media Library
- React Native Gesture Handler
- Expo Router for navigation

### Backend
- Node.js
- Express.js
- Multer for file uploads
- Sharp for image processing
- OpenAI API (DALL-E 2)
- dotenv for environment management

## Project Structure

```
LLM-Photo-Restoration-Enhancer-App/
├── app/                          # React Native application
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Home screen with animations
│   │   ├── explore.tsx          # Photo selection screen
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── ad-screen.tsx            # Advertisement screen
│   ├── edit-photo.tsx           # Photo editing screen
│   ├── restoration-options.tsx  # Restoration settings screen
│   ├── restore-process.tsx      # Processing and results screen
│   └── _layout.tsx              # Root layout
├── backend/                      # Node.js API server
│   ├── server.js                # Main server file
│   ├── uploads/                 # Temporary upload directory
│   ├── restored/                # Restored images directory
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   └── .gitignore               # Backend-specific ignore rules
├── components/                   # Reusable React components
│   ├── ui/                      # UI components
│   └── themed-*.tsx             # Themed components
├── constants/                    # App constants and themes
├── hooks/                        # Custom React hooks
└── assets/                       # Images and static assets
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- OpenAI API key
- iOS Simulator (Mac) or Android Emulator

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/nabil0412/LLM-Photo-Restoration-Enhancer-App.git
cd LLM-Photo-Restoration-Enhancer-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical device

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
OPENAI_API_KEY=your-openai-api-key-here
PORT=3000
ENABLE_GRAYSCALE=false
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

### Environment Variables

#### Backend (.env)
- `OPENAI_API_KEY` (Required): Your OpenAI API key from https://platform.openai.com/api-keys
- `PORT` (Optional): Server port, defaults to 3000
- `ENABLE_GRAYSCALE` (Optional): Force grayscale output, defaults to false

### API Connection

For local development with emulator:
```typescript
const API_URL = 'http://localhost:3000/restore';
```

For physical device testing:
```typescript
const API_URL = 'http://YOUR_COMPUTER_IP:3000/restore';
```

Find your IP address:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig | grep "inet "`

Ensure your phone and computer are on the same WiFi network.

## Usage

### Complete Workflow

1. **Home Screen**: Launch app and tap "Restore Photo"
2. **Photo Selection**: Choose "Upload from Gallery" or "Use Camera"
3. **Edit Photo**: Rotate or flip your image as needed, tap "Next"
4. **Restoration Options**: Toggle desired enhancements:
   - Repair Scratches: Remove physical damage and imperfections
   - Colorize Photo: Add natural colors to black and white photos
   - Improve Clarity: Enhance sharpness and detail
5. **Advertisement**: Wait for ad completion (5 seconds)
6. **Processing**: Photo is sent to backend for AI restoration
7. **Results**: View before/after comparison with interactive slider
8. **Save**: Download restored photo to your device

### API Endpoints

#### POST /restore
Process and restore a photo.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (JPEG, PNG, WEBP)
  - `adToken`: Ad completion token
  - `repairScratches`: boolean
  - `colorizePhoto`: boolean
  - `improveClarity`: boolean

**Response:**
```json
{
  "success": true,
  "restoredImageUrl": "http://localhost:3000/restored/restored-uuid.jpg",
  "options": {
    "repairScratches": true,
    "colorizePhoto": false,
    "improveClarity": true
  }
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Photo Restore API is running",
  "timestamp": "2025-10-30T22:00:00.000Z"
}
```

#### GET /
API information endpoint.

**Response:**
```json
{
  "name": "Photo Restore AI API",
  "version": "1.0.0",
  "endpoints": {
    "restore": "POST /restore",
    "health": "GET /health"
  }
}
```

## Testing

### Backend Testing

**Browser Test:**
```
http://localhost:3000/health
```

**cURL Test:**
```bash
curl -X POST http://localhost:3000/restore \
  -F "image=@path/to/photo.jpg" \
  -F "adToken=timestamp-randomstring" \
  -F "repairScratches=true" \
  -F "colorizePhoto=false" \
  -F "improveClarity=true"
```

### Mobile Testing

1. Start backend server
2. Update API URL in `app/restore-process.tsx`
3. Run mobile app
4. Test complete restoration flow

## Security

### Important Security Notes

- **Never commit `.env` files** - They contain sensitive API keys
- **Never share your OpenAI API key** - Keep it private
- **User uploads are temporary** - Files in `uploads/` and `restored/` directories are excluded from Git
- **Use environment variables** - All sensitive configuration uses environment variables
- **Token-based authorization** - Ad completion tokens prevent API abuse

### Protected Files (Not in Git)
- `backend/.env` - Your actual API keys
- `backend/uploads/*` - User uploaded photos
- `backend/restored/*` - Restored photos
- `backend/node_modules/*` - Dependencies

### Safe to Commit
- `backend/.env.example` - Template without real keys
- Source code files
- Documentation
- Configuration files

For detailed security information, see `SECURITY.md`.

## API Costs

### OpenAI DALL-E 2 Pricing
- Image restoration (1024x1024): $0.020 per image
- Average processing time: 15-30 seconds

### Cost Optimization Tips
- Implement result caching
- Use queue system for batch processing
- Set up rate limiting
- Monitor API usage on OpenAI dashboard

## Deployment

### Backend Deployment Options

#### Railway
1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

#### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

#### Heroku
```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your-key
git push heroku main
```

### Mobile App Deployment

#### iOS
1. Configure app.json with bundle identifier
2. Build: `expo build:ios`
3. Submit to App Store

#### Android
1. Configure app.json with package name
2. Build: `expo build:android`
3. Submit to Google Play Store

### Production Considerations

- Use production-grade database for token storage
- Implement proper rate limiting
- Set up monitoring and logging
- Use cloud storage for images (AWS S3, Cloudinary)
- Implement automatic cleanup for old files
- Use HTTPS in production
- Set up error tracking (Sentry, Rollbar)

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
# Find PID and kill it in Task Manager

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Sharp installation fails:**
```bash
npm rebuild sharp
```

**OpenAI API errors:**
- Verify API key is correct in `.env`
- Check account has available credits
- Ensure internet connection is stable
- Check OpenAI API status page

### Mobile App Issues

**Cannot connect to backend:**
- Verify backend server is running
- Check API URL is correct
- Ensure same WiFi network (for physical devices)
- Check firewall settings

**Expo build errors:**
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

**Image picker not working:**
- Check permissions in app settings
- Verify Expo Go app is up to date

## Documentation

- `QUICK_START.md` - Quick start guide for development
- `BACKEND_SETUP.md` - Detailed backend setup instructions
- `API_INTEGRATION.md` - API integration documentation
- `SECURITY.md` - Security best practices
- `SECURITY_SETUP_SUMMARY.md` - Security setup summary
- `backend/OPENAI_SETUP.md` - OpenAI API setup guide
- `backend/README.md` - Detailed backend documentation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write clear commit messages
- Update documentation for new features
- Test thoroughly before submitting
- Ensure no sensitive data in commits
- Follow existing code style

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## Acknowledgments

- OpenAI for DALL-E 2 API
- Expo team for excellent mobile framework
- React Native community
- All contributors and testers

## Project Status

Active development. Currently supports:
- iOS and Android platforms
- OpenAI DALL-E 2 integration
- Local and cloud deployment
- Multiple restoration options

## Roadmap

Future enhancements may include:
- Batch processing support
- Advanced editing tools
- Multiple AI model options
- User accounts and history
- Premium features
- Social sharing
- Before/after gallery

## Version History

### v1.0.0
- Initial release
- OpenAI DALL-E 2 integration
- Mobile app with React Native/Expo
- Backend API with Node.js/Express
- Photo restoration features
- Ad-supported model
- Comprehensive documentation
- Security best practices

---

Built with React Native, Node.js, and OpenAI's DALL-E 2 API.

Repository: https://github.com/nabil0412/LLM-Photo-Restoration-Enhancer-App
