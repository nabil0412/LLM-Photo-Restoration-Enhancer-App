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

### How to Set Up

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Get your OpenAI API key:**
   - Visit https://platform.openai.com/api-keys
   - Sign in or create an account
   - Create a new API key
   - Copy the key (starts with `sk-`)

3. **Edit the `.env` file:**
   ```bash
   # Windows
   notepad .env
   
   # Mac/Linux
   nano .env
   ```

4. **Add your API key:**
   ```
   OPENAI_API_KEY=sk-proj-abc123...your-actual-key
   PORT=3000
   ENABLE_GRAYSCALE=false
   ```

5. **Save and close the file**

## ⚠️ Critical Security Rules

### DO ✅
- ✅ Keep your `.env` file secure on your local machine
- ✅ Use `.env.example` as a template (safe to commit)
- ✅ Add new environment variables to `.env.example` (without real values)
- ✅ Use environment variables for ALL sensitive configuration
- ✅ Regularly rotate your API keys
- ✅ Set up proper file permissions on `.env` (read-only for owner)

### DON'T ❌
- ❌ NEVER commit `.env` to Git
- ❌ NEVER share your `.env` file
- ❌ NEVER hardcode API keys in source code
- ❌ NEVER share your OpenAI API key publicly
- ❌ NEVER commit user-uploaded images
- ❌ NEVER push `.env` to GitHub, even in a "private" repo

## 🚨 What If I Accidentally Committed Sensitive Data?

If you accidentally committed your `.env` file or API keys:

### Immediate Actions:

1. **Rotate your API key immediately:**
   - Go to https://platform.openai.com/api-keys
   - Delete the exposed key
   - Create a new one
   - Update your local `.env` file

2. **Remove from Git history:**
   ```bash
   # Remove the file from Git but keep it locally
   git rm --cached backend/.env
   git commit -m "Remove .env file from tracking"
   
   # If already pushed, you may need to rewrite history
   # (This is dangerous - seek help if needed)
   ```

3. **Verify `.gitignore` is working:**
   ```bash
   git status
   # .env should NOT appear in the list
   ```

## 📂 Directory Structure

```
PRV2/
├── .gitignore                    # Root ignore rules
├── .env                          # ❌ NOT in Git (excluded)
├── SECURITY.md                   # ✅ This file (safe to commit)
│
└── backend/
    ├── .gitignore                # Backend ignore rules
    ├── .env                      # ❌ NOT in Git (your actual keys)
    ├── .env.example              # ✅ Template (safe to commit)
    │
    ├── uploads/                  # ❌ NOT in Git (user photos)
    │   └── .gitkeep              # ✅ Keeps directory in Git
    │
    └── restored/                 # ❌ NOT in Git (processed photos)
        └── .gitkeep              # ✅ Keeps directory in Git
```

## 🔍 Verification

To verify your security setup is correct:

```bash
# From project root
git status

# You should NOT see:
# - backend/.env
# - backend/uploads/*.png
# - backend/uploads/*.jpg
# - backend/restored/*.jpg
# - Any files with API keys

# You SHOULD see (if modified):
# - backend/.env.example
# - backend/.gitignore
# - .gitignore
# - SECURITY.md
```

## 🌐 Deployment Considerations

When deploying to production:

### Environment Variables in Production
- Use your hosting platform's environment variable settings
- **Railway**: Settings → Environment Variables
- **Render**: Environment tab → Add environment variables
- **Heroku**: `heroku config:set OPENAI_API_KEY=sk-...`
- **Vercel**: Settings → Environment Variables

### File Storage in Production
- The `uploads/` and `restored/` directories are temporary storage
- Consider using cloud storage (AWS S3, Cloudinary, etc.) for production
- Implement cleanup jobs to remove old files

### API Key Security
- Use different API keys for development and production
- Set spending limits on your OpenAI account
- Monitor API usage regularly
- Implement rate limiting in production

## 📞 Support

If you suspect your API key has been compromised:
1. **Immediately** revoke it at https://platform.openai.com/api-keys
2. Generate a new key
3. Update your environment variables
4. Monitor for unauthorized usage

## ✅ Security Checklist

Before committing code:
- [ ] No `.env` files in commit
- [ ] No API keys in source code
- [ ] No user-uploaded images in commit
- [ ] `.gitignore` rules are working
- [ ] `.env.example` is up to date (without real values)
- [ ] All sensitive config uses environment variables

---

**Remember:** Security is not optional. Always protect your API keys and user data! 🔒

