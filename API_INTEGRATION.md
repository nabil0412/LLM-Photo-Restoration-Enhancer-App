# API Integration Guide

## Backend API Requirements

The Photo Restore AI app sends image restoration requests to your backend API. Here's how to integrate it:

### Endpoint

```
POST https://your-api-endpoint.com/restore
```

### Request Format

The app sends a `multipart/form-data` request with the following fields:

**Form Fields:**
- `image` (File) - The photo to be restored
- `repairScratches` (String) - "true" or "false"
- `colorizePhoto` (String) - "true" or "false"
- `improveClarity` (String) - "true" or "false"

### Example Request (Node.js/Express)

```javascript
// Backend endpoint example
app.post('/restore', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    const { repairScratches, colorizePhoto, improveClarity } = req.body;
    
    // Process the image with your AI model
    const restoredImage = await processImage(imageFile, {
      repairScratches: repairScratches === 'true',
      colorizePhoto: colorizePhoto === 'true',
      improveClarity: improveClarity === 'true',
    });
    
    // Upload restored image to your storage (S3, Cloud Storage, etc.)
    const restoredImageUrl = await uploadToStorage(restoredImage);
    
    // Return the URL of the restored image
    res.json({
      restoredImageUrl: restoredImageUrl,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process image',
      message: error.message,
    });
  }
});
```

### Response Format

Your API should return a JSON response with the restored image URL:

```json
{
  "restoredImageUrl": "https://your-cdn.com/restored-images/abc123.jpg",
  "success": true
}
```

### Error Response

If processing fails, return an error:

```json
{
  "error": "Failed to process image",
  "message": "Detailed error message",
  "success": false
}
```

## Updating the API URL

To connect your backend API to the app, update the API_URL in `app/restore-process.tsx`:

```typescript
// Line 78 in app/restore-process.tsx
const API_URL = 'https://your-api-endpoint.com/restore';
```

Replace with your actual backend endpoint.

## Demo Mode

The app includes a fallback demo mode that:
1. Shows an error message if the API request fails
2. Automatically retries after 3 seconds
3. Falls back to showing the original image

This allows the app to work even without a backend during development/testing.

## Image Processing Flow

1. User selects photo and enhancement options
2. After watching the ad, app navigates to processing screen
3. App sends image + options to your backend API
4. Backend processes the image with AI model
5. Backend returns URL of restored image
6. App displays before/after comparison with slider
7. User can save restored image to device

## Recommended AI Models

- **Repair Scratches**: Old Photo Restoration models (e.g., Microsoft Bringing-Old-Photos-Back-to-Life)
- **Colorize Photo**: Image colorization models (e.g., DeOldify)
- **Improve Clarity**: Super-resolution models (e.g., Real-ESRGAN)

## Security Considerations

- Implement rate limiting to prevent abuse
- Add authentication/API keys if needed
- Validate file types and sizes
- Sanitize uploaded files
- Use secure cloud storage for images
- Set appropriate CORS headers

## Testing

You can test the API integration using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

Example cURL command:
```bash
curl -X POST https://your-api-endpoint.com/restore \
  -F "image=@/path/to/photo.jpg" \
  -F "repairScratches=true" \
  -F "colorizePhoto=false" \
  -F "improveClarity=true"
```

