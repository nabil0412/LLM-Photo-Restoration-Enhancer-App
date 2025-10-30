# OpenAI API Setup

## 🔑 Get Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key

## ⚙️ Configure the Backend

Create a `.env` file in the `backend` directory:

```bash
# backend/.env
PORT=3000
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
ENABLE_GRAYSCALE=false   # Set to 'true' to force all images to grayscale, 'false' to allow colors
```

⚠️ **IMPORTANT:** Replace `sk-your-actual-openai-api-key-here` with your actual OpenAI API key!

## 🎨 Grayscale Configuration

The `ENABLE_GRAYSCALE` setting controls whether all restored images are converted to black & white:

- **`ENABLE_GRAYSCALE=true`**: All images are converted to grayscale, regardless of user's "Colorize Photo" option
- **`ENABLE_GRAYSCALE=false`**: User's "Colorize Photo" option is respected, images can be in color

This is useful for:
- Testing B&W restoration specifically
- Vintage photo restoration where B&W is preferred
- Reducing API costs (colorization uses more tokens)

## 💰 Pricing Information

### DALL-E 2 Image Edit (Direct Restoration)
- **1024x1024**: $0.020 per image
- **Much cheaper than GPT-4o + DALL-E 3 approach!** 💰

### **Total Cost Per Restoration**: $0.020 per image
- ✅ **56% cheaper** than previous approach ($0.045)
- ✅ **Faster** - Single API call instead of two
- ✅ **Simpler** - Direct image-to-image editing

## 🎯 How It Works

1. **User uploads photo** → Mobile app
2. **DALL-E 2 Image Edit API** → Directly restores the image based on your custom prompt
3. **App receives result** → Displays in before/after slider

### ⚡ Direct Image Restoration (No GPT-4o Analysis)

The backend now uses OpenAI's **Image Edit API** which:
- ✅ **Single-step process** - Sends image + prompt directly to DALL-E 2
- ✅ **Faster** - No intermediate analysis step (saves ~15 seconds)
- ✅ **Cheaper** - Only DALL-E 2 editing cost, no GPT-4o cost
- ✅ **Direct editing** - AI modifies the actual image, not recreating from description

### Restoration Prompt Strategy

The backend uses a carefully crafted base prompt that:
- ✅ **Preserves identity** - "Do not alter the identity of the people"
- ✅ **Prevents additions** - "Do not add new elements"
- ✅ **Repairs damage** - Fixes scratches, folds, discoloration
- ✅ **Maintains authenticity** - Preserves original style, lighting, colors
- ✅ **User options** - Enhances based on selected features (repair, colorize, clarity)

## 🔒 Security

- ✅ Ad token system prevents abuse
- ✅ API key stored in .env (not committed to git)
- ✅ Rate limiting recommended for production
- ✅ No fallback - ensures consistent AI-powered quality

## 🚀 OpenAI API Required

**Important:** OpenAI API is **required** for image processing. There is no fallback.

If the OpenAI API fails, you will receive an error. Make sure:
- ✅ `OPENAI_API_KEY` is set in `.env`
- ✅ API key is valid
- ✅ You have credits in your OpenAI account
- ✅ Internet connection is working

## 📊 Models Used

- **dall-e-2 (Image Edit API)**: Directly edits and restores images based on text prompts

### Model Update Note
We switched from the GPT-4o + DALL-E 3 approach to the **DALL-E 2 Image Edit API** for:
- ✅ Direct image-to-image editing (no intermediate description step)
- ✅ 56% cost reduction ($0.020 vs $0.045 per image)
- ✅ ~15 seconds faster processing time
- ✅ Better preservation of original image structure

## ⚡ Optimization Tips

For production:
1. **Cache results** - Don't reprocess same images
2. **Queue system** - Process in background
3. **Rate limiting** - Prevent API abuse
4. **Batch processing** - Group similar requests

