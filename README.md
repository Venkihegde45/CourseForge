# CourseForge

**Upload anything → AI analyzes → Generates full course → Display everything in one clean page**

## 🎯 Overview

CourseForge is a full-stack web application that transforms any uploaded content into a complete AI-generated interactive course with beautiful 3D animations and modern UI.

## 🏗️ Available Versions

### 1. MERN Stack Version (Recommended) ⭐
- **Location**: `client/` and `server/` directories
- **Tech**: React (Vite) + Express + MongoDB
- **Features**: Animated 3D homepage, Framer Motion effects, single-page course display
- **Setup**: See [SETUP_MERN.md](SETUP_MERN.md)
- **Quick Start**: Run `start_mern.bat` (Windows) or `start_mern.sh` (Linux/Mac)

### 2. FastAPI + Next.js Version
- **Location**: `backend/` and `frontend/` directories  
- **Tech**: FastAPI (Python) + Next.js + SQLite/PostgreSQL
- **Features**: Full-featured API, AI tutor, progress tracking, flashcards
- **Setup**: See [SETUP.md](SETUP.md)

## 🚀 Quick Start (MERN Version)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Windows
```bash
start_mern.bat
```

### Linux/Mac
```bash
chmod +x start_mern.sh
./start_mern.sh
```

### Manual Setup

**Backend:**
```bash
cd server
npm install
# Create .env with MONGODB_URI and GEMINI_API_KEY
npm run dev
```

**Frontend:**
```bash
cd client
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

## ✨ Features

- 🎨 **Animated 3D Homepage** - Framer Motion with tilt effects, glow animations
- 📤 **Drag & Drop Upload** - Support for PDF, images, Word docs, text files
- 🔍 **Multi-Format Processing** - OCR for images, text extraction for PDFs/docs
- 🤖 **AI Course Generation** - Google Gemini-powered structured course creation
- 📚 **Single-Page Display** - Complete course on one scrollable page
- 💫 **Smooth Animations** - Transitions, hover effects, loading states
- 📥 **Export Functionality** - Download course as Markdown

## 🎨 Design

- **Theme**: Neon red + black color scheme
- **Effects**: 3D tilt on hover, glow animations, floating elements
- **Layout**: Minimal, clean, centered design
- **Responsive**: Works on desktop and mobile

## 📖 Documentation

- [MERN Setup Guide](SETUP_MERN.md) - Detailed MERN stack setup
- [Project Structure](PROJECT_STRUCTURE.md) - Architecture overview
- [README_MERN.md](README_MERN.md) - MERN version details

## 🛠️ Tech Stack

### MERN Version
- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI**: Google Gemini API
- **File Processing**: Tesseract.js, pdf-parse, mammoth

## 💡 Enhancement Ideas

See [ENHANCEMENT_IDEAS.md](ENHANCEMENT_IDEAS.md) for a comprehensive list of features and improvements planned for CourseForge.

## 📝 License

MIT
