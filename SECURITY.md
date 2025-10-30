# Security & Environment Configuration

## 🔒 Security Setup Complete

This project has been configured with proper security measures to protect sensitive information like API keys and user data.

## 📁 Files Protected by .gitignore

### Backend Directory (`backend/.gitignore`)
The following files and directories are excluded from Git:

#### Environment Files
- `.env` - Contains your actual API keys (NEVER commit this!)
- `.env.local` - Local environment overrides
- `.env.*.local` - Any local environment variants

#### User Data Directories
- `uploads/` - Temporary uploaded photos from users
- `restored/` - Processed/restored photos

These directories contain user-uploaded images and should never be committed to version control for privacy and storage reasons.

#### Other Protected Files
- `node_modules/` - Dependencies
- `*.log` - Log files
- `.DS_Store`, `Thumbs.db` - OS-generated files

### Root Directory (`.gitignore`)
Additional protections at the project root:
- `.env`, `.env.local`, `.env*.local` - Environment files
- `backend/uploads/*` - User uploads
- `backend/restored/*` - Restored images
- `node_modules/` - Dependencies
- `/ios`, `/android` - Generated native folders

## 🔑 Environment Variables

### Required Configuration

The backend requires the following environment variables to be set in `backend/.env`:

```bash
# OpenAI API Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Server Configuration (OPTIONAL)
PORT=3000

# Feature Flags (OPTIONAL)
ENABLE_GRAYSCALE=false
```







