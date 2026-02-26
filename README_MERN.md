# CourseForge - MERN Stack Version

**Upload anything → AI analyzes → Generates full course → Display everything in one clean page**

## 🎯 Project Overview

CourseForge is a full MERN-stack web application that transforms any uploaded content into a complete AI-generated interactive course with beautiful 3D animations and modern UI.

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Framer Motion (3D animations, tilt effects, transitions)
- React Icons / Lucide Icons
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Multer (file uploads)
- OpenAI API (course generation)
- Tesseract.js (OCR)
- pdf-parse (PDF extraction)

## 🚀 Quick Start

### Backend Setup
```bash
cd server
npm install
# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/courseforge
# OPENAI_API_KEY=your_key_here
# PORT=5000
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:5000
npm run dev
```

## 📁 Project Structure

```
CourseForge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utilities
│   │   └── App.jsx        # Main app
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── models/           # Mongoose models
│   ├── middleware/      # Middleware
│   ├── utils/           # Utilities (file processing, AI)
│   └── server.js        # Entry point
└── README_MERN.md
```

## ✨ Features

- 🎨 Animated 3D homepage with Framer Motion
- 📤 Drag & drop file upload
- 🔍 Multi-format support (PDF, images, docs, audio)
- 🤖 AI-powered course generation
- 📚 Single-page course display
- 💫 Smooth animations and transitions
- 📥 Export course as PDF/notes

## 🎨 Design Theme

- Neon red + black color scheme
- 3D tilt effects on hover
- Glow animations
- Floating background elements
- Minimal, clean layout






