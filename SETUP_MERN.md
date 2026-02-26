# CourseForge MERN - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

## Quick Start

### Option 1: Using Scripts (Recommended)

**Windows:**
```bash
start_mern.bat
```

**Linux/Mac:**
```bash
chmod +x start_mern.sh
./start_mern.sh
```

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and add:
# MONGODB_URI=mongodb://localhost:27017/courseforge
# GEMINI_API_KEY=your_key_here
# JWT_SECRET=your_jwt_secret_here
# PORT=5000

npm run dev
```

#### 2. Frontend Setup (New Terminal)

```bash
cd client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

npm run dev
```

## MongoDB Setup

### Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/courseforge`

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

## Environment Variables

### Backend (`server/.env`)
```
MONGODB_URI=mongodb://localhost:27017/courseforge
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here_change_in_production
PORT=5000
UPLOAD_DIR=./uploads
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000
```

## Features

✅ Animated 3D homepage with Framer Motion
✅ Drag & drop file upload
✅ Multi-format support (PDF, images, Word docs, text)
✅ AI-powered course generation
✅ Single-page course display
✅ Smooth animations and transitions
✅ Export course as Markdown

## File Support

- **PDF**: Text extraction using pdf-parse
- **Images**: OCR using Tesseract.js
- **Word Docs**: Text extraction using mammoth
- **Text Files**: Direct reading

## API Endpoints

- `POST /api/auth/signup` - Create user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/upload` - Upload file and generate course
- `GET /api/course/:id` - Get course by ID
- `GET /api/course` - Get all courses (user-specific if authenticated)
- `GET /api/health` - Health check

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### File Upload Fails
- Check file size (max 50MB)
- Verify file type is supported
- Check server logs for errors

### AI Generation Fails
- Verify GEMINI_API_KEY is set in `.env`
- Get API key from: https://makersuite.google.com/app/apikey
- Check API key has credits/quota
- System will fallback to simple course structure

### Port Already in Use
- Change PORT in `server/.env`
- Update `VITE_API_URL` in `client/.env` accordingly

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- API docs: http://localhost:5000/api/health

## Production Build

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
# Serve the dist/ folder with a static server
```





