# CourseForge Project Structure

```
CourseForge/
├── backend/                    # FastAPI backend
│   ├── api/                   # API route handlers
│   │   ├── __init__.py
│   │   ├── courses.py         # Course CRUD endpoints
│   │   ├── uploads.py         # File upload & processing
│   │   ├── tutor.py           # AI tutor chat endpoints
│   │   ├── progress.py        # Progress tracking endpoints
│   │   └── export.py          # Export functionality
│   ├── services/              # Business logic
│   │   ├── __init__.py
│   │   ├── file_processor.py  # PDF, image, audio, video processing
│   │   ├── course_generator.py # AI course generation
│   │   └── ai_tutor.py        # AI tutor service
│   ├── models.py              # SQLAlchemy database models
│   ├── database.py            # Database configuration
│   ├── main.py                # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
│
├── frontend/                  # Next.js frontend
│   ├── app/                   # Next.js app router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   └── courses/           # Course pages
│   │       ├── page.tsx       # Course list
│   │       └── [id]/          # Individual course page
│   │           ├── page.tsx
│   │           └── layout.tsx
│   ├── components/            # React components
│   │   ├── UploadInterface.tsx    # File/text/link upload
│   │   ├── CourseList.tsx         # Course listing
│   │   ├── TutorChat.tsx          # AI tutor chat UI
│   │   ├── QuizComponent.tsx      # Quiz interface
│   │   └── ExportMenu.tsx         # Export options
│   ├── lib/                   # Utilities
│   │   └── api.ts             # API client functions
│   ├── package.json           # Node dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── next.config.js         # Next.js config
│
├── README.md                   # Main documentation
├── SETUP.md                    # Detailed setup guide
├── PROJECT_STRUCTURE.md        # This file
├── .gitignore                  # Git ignore rules
├── start_backend.sh/.bat      # Backend startup script
└── start_frontend.sh/.bat     # Frontend startup script
```

## Key Components

### Backend

**API Routes:**
- `/api/v1/upload` - Upload files, text, or URLs
- `/api/v1/courses` - List and get courses
- `/api/v1/tutor/{course_id}/chat` - AI tutor chat
- `/api/v1/progress/{course_id}` - Track learning progress
- `/api/v1/courses/{course_id}/export/*` - Export course content

**Services:**
- `FileProcessor` - Handles PDF, images (OCR), audio/video (speech-to-text), links
- `CourseGenerator` - Uses AI to generate structured courses
- `AITutor` - Provides contextual Q&A about courses

**Database Models:**
- `Course` - Main course entity
- `Module` - Course modules
- `Lesson` - Individual lessons with 3 explanation levels
- `Quiz` - Multiple choice questions
- `Flashcard` - Study flashcards
- `CourseProgress` - User progress tracking
- `TutorConversation` - Chat history

### Frontend

**Pages:**
- `/` - Home page with upload interface
- `/courses` - List all courses
- `/courses/[id]` - Course viewer with lessons, quizzes, tutor

**Components:**
- `UploadInterface` - Multi-format upload (file/text/URL)
- `CourseList` - Display all courses
- `TutorChat` - AI tutor chat interface
- `QuizComponent` - Interactive quiz with feedback
- `ExportMenu` - Export course content

## Data Flow

1. **Upload** → File/text/URL processed → Content extracted
2. **Generation** → AI generates course structure → Saved to database
3. **Learning** → User views lessons → Takes quizzes → Tracks progress
4. **Tutor** → User asks questions → AI provides contextual answers
5. **Export** → User exports summaries, notes, or flashcards

## Technology Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- OpenAI API (LLM for course generation & tutor)
- Tesseract (OCR)
- Whisper (Speech-to-text)
- pdfplumber (PDF parsing)

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Axios (HTTP client)
- Lucide React (Icons)






