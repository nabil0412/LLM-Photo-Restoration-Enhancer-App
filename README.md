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
- OpenAI DALL-E 2 and Google Gemini integration for photo restoration
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
- Google Gemini API
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


