const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const OpenAI = require('openai');
const { toFile } = require('openai/uploads');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Add this to your .env file
});

// Global Configuration
const ENABLE_GRAYSCALE = process.env.ENABLE_GRAYSCALE === 'true'; // Set to 'true' to force grayscale, 'false' to keep colors
console.log('🎨 Global Configuration:');
console.log('ENABLE_GRAYSCALE:', ENABLE_GRAYSCALE);

// Store used ad tokens (in production, use Redis or database)
const usedTokens = new Set();
const TOKEN_EXPIRY_MS = 60000; // 60 seconds

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  const tokensToDelete = [];
  
  usedTokens.forEach(token => {
    const parts = token.split('-');
    if (parts.length >= 2) {
      const timestamp = parseInt(parts[0]);
      if (!isNaN(timestamp) && now - timestamp > TOKEN_EXPIRY_MS) {
        tokensToDelete.push(token);
      }
    }
  });
  
  tokensToDelete.forEach(token => usedTokens.delete(token));
  
  if (tokensToDelete.length > 0) {
    console.log(`Cleaned up ${tokensToDelete.length} expired tokens`);
  }
}, 5 * 60 * 1000); // Every 5 minutes

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const restoredDir = path.join(__dirname, 'restored');
const publicDir = path.join(__dirname, 'public');

[uploadsDir, restoredDir, publicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files (restored images)
app.use('/restored', express.static(restoredDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  
  // Reject HEIC/HEIF files (not supported by Sharp on Windows)
  if (file.mimetype === 'image/heic' || file.mimetype === 'image/heif') {
    return cb(new Error('HEIC/HEIF format not supported. Please convert to JPG or PNG first.'), false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB max file size
  }
});

// Validate ad completion token
function validateAdToken(token) {
  if (!token) {
    return { valid: false, error: 'No ad token provided' };
  }

  // Check if token was already used
  if (usedTokens.has(token)) {
    return { valid: false, error: 'Token already used' };
  }

  // Parse timestamp from token (format: timestamp-randomstring)
  const parts = token.split('-');
  if (parts.length < 2) {
    return { valid: false, error: 'Invalid token format' };
  }

  const timestamp = parseInt(parts[0]);
  if (isNaN(timestamp)) {
    return { valid: false, error: 'Invalid token timestamp' };
  }

  // Check if token is expired (older than 60 seconds)
  const now = Date.now();
  if (now - timestamp > TOKEN_EXPIRY_MS) {
    return { valid: false, error: 'Token expired' };
  }

  // Check if token is from the future (clock skew protection)
  if (timestamp > now + 5000) {
    return { valid: false, error: 'Invalid token timestamp' };
  }

  return { valid: true };
}

// Photo restoration endpoint
app.post('/restore', upload.single('image'), async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('📸 NEW RESTORATION REQUEST RECEIVED');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    
    // Validate ad completion token
    const adToken = req.body.adToken;
    console.log('\n🔒 VALIDATING AD TOKEN');
    console.log('Token received:', adToken ? `${adToken.substring(0, 20)}...` : 'NONE');
    
    const tokenValidation = validateAdToken(adToken);
    
    if (!tokenValidation.valid) {
      console.log('❌ Token validation FAILED:', tokenValidation.error);
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: ' + tokenValidation.error
      });
    }
    
    console.log('✅ Token validation SUCCESS');
    
    // Mark token as used
    usedTokens.add(adToken);
    console.log('🔐 Token marked as used. Total used tokens:', usedTokens.size);
    
    if (!req.file) {
      console.log('❌ No image file provided');
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }
    
    console.log('\n📁 FILE DETAILS:');
    console.log('Filename:', req.file.filename);
    console.log('Original name:', req.file.originalname);
    console.log('Size:', (req.file.size / 1024).toFixed(2), 'KB');
    console.log('Mimetype:', req.file.mimetype);
    console.log('Path:', req.file.path);

    const { repairScratches, colorizePhoto, improveClarity } = req.body;
    const options = {
      repairScratches: repairScratches === 'true',
      colorizePhoto: colorizePhoto === 'true',
      improveClarity: improveClarity === 'true'
    };

    console.log('\n⚙️  USER OPTIONS:');
    console.log('Repair Scratches:', options.repairScratches ? '✅ YES' : '❌ NO');
    console.log('Colorize Photo:', options.colorizePhoto ? '✅ YES' : '❌ NO');
    console.log('Improve Clarity:', options.improveClarity ? '✅ YES' : '❌ NO');

    console.log('\n🎨 STARTING IMAGE PROCESSING...');
    const startTime = Date.now();
    
    // Process the image
    const restoredImagePath = await processImage(req.file.path, options);
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ PROCESSING COMPLETE in ${processingTime}s`);
    
    // Get the base URL for the server
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const restoredImageUrl = `${baseUrl}/restored/${path.basename(restoredImagePath)}`;

    console.log('\n📤 SENDING RESPONSE:');
    console.log('Restored Image URL:', restoredImageUrl);
    console.log('Success: true');

    // Clean up uploaded file after processing
    fs.unlinkSync(req.file.path);
    console.log('🧹 Cleaned up temporary upload file');

    console.log('\n========================================');
    console.log('✨ REQUEST COMPLETED SUCCESSFULLY');
    console.log('========================================\n');

    res.json({
      success: true,
      restoredImageUrl: restoredImageUrl,
      options: options
    });

  } catch (error) {
    console.error('\n❌❌❌ ERROR OCCURRED ❌❌❌');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Clean up uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process image',
      message: error.message
    });
  }
});

// Build prompt based on user options and global config
function buildPrompt(options) {
  // Direct, actionable prompt for image restoration
  let prompt = "A perfectly restored, clean version of this photograph with: ";
  
  const fixes = [];
  
  // Always include basic restoration
  fixes.push("all tears completely filled in and invisible");
  fixes.push("all scratches removed");
  fixes.push("all stains and discoloration removed");
  fixes.push("all fold lines removed");
  fixes.push("damaged or missing areas reconstructed seamlessly");
  fixes.push("smooth, clean background");
  
  // Check global grayscale setting
  if (ENABLE_GRAYSCALE) {
    fixes.push("converted to high-quality black and white with proper contrast");
    console.log('  ⚠️  ENABLE_GRAYSCALE is TRUE - forcing grayscale conversion');
  }
  
  // User-selected enhancements
  if (options.repairScratches) {
    fixes.push("extra attention to repairing even the smallest physical damage");
  }
  
  if (options.colorizePhoto && !ENABLE_GRAYSCALE) {
    fixes.push("vibrant, natural colors restored (no fading or yellowing)");
  } else if (options.colorizePhoto && ENABLE_GRAYSCALE) {
    console.log('  ⚠️  Colorize requested but ENABLE_GRAYSCALE is TRUE - ignoring colorize option');
  }
  
  if (options.improveClarity) {
    fixes.push("enhanced clarity and sharpness");
    fixes.push("improved overall image quality");
  }
  
  prompt += fixes.join(", ") + ". ";
  prompt += "The person's face, features, and clothing must remain exactly the same. ";
  prompt += "The composition and pose must remain unchanged. ";
  prompt += "Only repair and enhance - do not alter the subject.";
  
  console.log('  ✓ Generated prompt:', prompt);
  return prompt;
}

// Image processing function using DALL-E 2 Image Edit API
async function processImage(inputPath, options) {
  const outputFilename = `restored-${uuidv4()}.jpg`;
  const outputPath = path.join(restoredDir, outputFilename);

  console.log('\n  🔧 PROCESS IMAGE FUNCTION STARTED');
  console.log('  Input path:', inputPath);
  console.log('  Output path:', outputPath);

  try {
    console.log('\n  📖 STEP 1: Preparing image for DALL-E 2 Image Edit API...');
    
    // Convert image to PNG with alpha channel and resize to max 1000px
    // Create a unique temporary PNG file name (handles all formats: jpg, jpeg, png, webp, etc.)
    const pngPath = inputPath.replace(/\.[^.]+$/, '-processed.png');
    console.log('  Converting to PNG format with alpha channel and resizing...');
    
    // Get original dimensions
    const metadata = await sharp(inputPath).metadata();
    console.log(`  Original size: ${metadata.width}x${metadata.height}`);
    
    // Resize to max 1000px while maintaining aspect ratio
    const maxDimension = 1000;
    let resizeOptions = {};
    
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      if (metadata.width > metadata.height) {
        resizeOptions = { width: maxDimension };
      } else {
        resizeOptions = { height: maxDimension };
      }
      console.log(`  Resizing to fit within ${maxDimension}px...`);
    } else {
      console.log('  No resize needed (already under 1000px)');
    }
    
    const sharpInstance = sharp(inputPath);
    
    // Only apply resize if needed
    if (Object.keys(resizeOptions).length > 0) {
      sharpInstance.resize(resizeOptions);
    }
    
    // Convert to PNG with alpha channel (RGBA) - required by DALL-E 2 Edit API
    await sharpInstance
      .ensureAlpha()  // Add alpha channel if missing
      .png()
      .toFile(pngPath);
    
    // Get new dimensions
    const newMetadata = await sharp(pngPath).metadata();
    console.log(`  ✓ Converted to PNG: ${newMetadata.width}x${newMetadata.height}`);
    
    // Build restoration prompt
    console.log('\n  📝 STEP 2: Building restoration prompt...');
    const prompt = buildPrompt(options);
    console.log('  ✓ Prompt built successfully');
    
    // STEP 3: Call DALL-E 2 Image Edit API to restore the original photo
    console.log('\n  🎨 STEP 3: Calling DALL-E 2 Image Edit API...');
    console.log('  Model: dall-e-2 (image editing - preserves original content)');
    console.log('  Size: 1024x1024');
    console.log('  Prompt:', prompt.substring(0, 100) + '...');
    
    const editStartTime = Date.now();
    
    // Read PNG as buffer and use toFile with explicit type
    const pngBuffer = fs.readFileSync(pngPath);
    const imageFile = await toFile(pngBuffer, path.basename(pngPath), { type: 'image/png' });
    
    const imageEdit = await openai.images.edit({
      image: imageFile,
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });
    
    const editTime = ((Date.now() - editStartTime) / 1000).toFixed(2);
    console.log(`  ✓ Image restoration completed in ${editTime}s`);
    
    const restoredImageUrl = imageEdit.data[0].url;
    console.log('  ✓ Restored image URL:', restoredImageUrl);
    
    // Download the restored image
    console.log('\n  ⬇️  STEP 4: Downloading restored image...');
    const downloadStartTime = Date.now();
    
    const imageResponse = await fetch(restoredImageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const downloadTime = ((Date.now() - downloadStartTime) / 1000).toFixed(2);
    console.log(`  ✓ Image downloaded in ${downloadTime}s`);
    console.log('  ✓ Downloaded size:', (buffer.length / 1024).toFixed(2), 'KB');
    
    // Save to file
    console.log('\n  💾 STEP 5: Saving to file...');
    fs.writeFileSync(outputPath, buffer);
    
    // Clean up temporary PNG file
    fs.unlinkSync(pngPath);
    console.log('  🧹 Cleaned up temporary PNG file');
    
    console.log('  ✅ Restored image saved successfully!');
    console.log('  Output path:', outputPath);
    return outputPath;

  } catch (error) {
    console.error('\n  ❌❌❌ ERROR in OpenAI processing ❌❌❌');
    console.error('  Error name:', error.name);
    console.error('  Error message:', error.message);
    if (error.response) {
      console.error('  OpenAI API response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('  Stack trace:', error.stack);
    
    console.log('\n  ⚠️  NO FALLBACK - OpenAI API is required');
    console.log('  Please check:');
    console.log('  1. OPENAI_API_KEY is set in .env file');
    console.log('  2. API key is valid and has credits');
    console.log('  3. Internet connection is working');
    console.log('  4. OpenAI API is not experiencing outages');
    
    // Re-throw the error - no fallback
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Photo Restore API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Photo Restore AI API',
    version: '1.0.0',
    endpoints: {
      restore: 'POST /restore',
      health: 'GET /health'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Maximum file size is 10MB'
      });
    }
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Photo Restore API server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Restore endpoint: http://localhost:${PORT}/restore`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

