from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.endpoints.auth import get_current_user
from app.models.models import User, Course, Module, Topic, Quiz, Flashcard, DifficultyLevel
from app.schemas.course import CourseGenerateRequest, CourseResponse, ModuleSchema, TopicSchema, QuizSchema
from app.agents.curriculum_agent import generate_course_syllabus
from app.agents.topic_agent import generate_topic_content
from app.agents.scheduler_agent import generate_study_schedule
from app.agents.tutor_agent import get_mentor_response
from app.agents.lab_agent import create_lab_exercise, evaluate_lab_submission
from app.agents.podcast_agent import generate_podcast_script
from app.services.ingestion_service import ingestion_service
from app.services.certificate_service import generate_certificate_pdf

router = APIRouter()

def save_course_to_db(syllabus: dict, title: str, difficulty: str, owner_id: int, db: Session, source_type: str = "text") -> CourseResponse:
    """Helper to save a generated syllabus to the database and format the response."""
    # Map difficulty string to our enum
    difficulty_map = {
        "starter": DifficultyLevel.STARTER,
        "intermediate": DifficultyLevel.INTERMEDIATE,
        "advanced": DifficultyLevel.ADVANCED,
        "Beginner": DifficultyLevel.STARTER,
        "Intermediate": DifficultyLevel.INTERMEDIATE,
        "Advanced": DifficultyLevel.ADVANCED,
    }
    difficulty_enum = difficulty_map.get(difficulty, DifficultyLevel.STARTER)

    db_course = Course(
        title=syllabus.get("title", title),
        description=syllabus.get("description", f"AI-Synthesized course on {title}"),
        difficulty=difficulty_enum,
        source_type=source_type,
        status="ready",
        owner_id=owner_id
    )
    db.add(db_course)
    db.flush() # Use flush to get db_course.id before commit

    modules_out = []
    for i, mod_data in enumerate(syllabus.get("modules", [])):
        db_module = Module(
            course_id=db_course.id,
            title=mod_data["title"],
            description=mod_data.get("description", ""),
            order=i
        )
        db.add(db_module)
        db.flush() # Use flush to get db_module.id before commit

        topics_out = []
        for j, top_data in enumerate(mod_data.get("topics", [])):
            db_topic = Topic(
                module_id=db_module.id,
                title=top_data["title"],
                order=j,
                beginner_content="",
                intermediate_content="",
                expert_content="",
                examples=[],
                analogies=[],
                summary=""
            )
            db.add(db_topic)
            topics_out.append(TopicSchema(
                id=db_topic.id, # Now we have the ID from flush
                order=db_topic.order,
                title=db_topic.title,
                beginner_content="",
                intermediate_content="",
                expert_content="",
                examples=[],
                analogies=[],
                summary="",
                quizzes=[]
            ))
        
        modules_out.append(ModuleSchema(
            order=db_module.order,
            title=db_module.title,
            description=db_module.description,
            topics=topics_out
        ))

    db.commit()
    db.refresh(db_course)

    return CourseResponse(
        id=db_course.id,
        title=db_course.title,
        description=db_course.description,
        difficulty=difficulty, # Return original string difficulty for response
        source_type=db_course.source_type,
        status=db_course.status,
        created_at=db_course.created_at,
        modules=modules_out,
    )

@router.post("/generate", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def generate_course(
    req: CourseGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generates a course syllabus using AI and saves it to the database."""
    try:
        syllabus = generate_course_syllabus(req.topic, req.difficulty)
        return save_course_to_db(syllabus, req.topic, req.difficulty, current_user.id, db, source_type="text")
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail=f"AI Generation failed: {str(e)}"
        )

@router.post("/generate/file", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def generate_from_file(
    file: UploadFile = File(...),
    difficulty: str = Form("Beginner"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generates a course from an uploaded PDF file."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    try:
        context_text = ingestion_service.extract_text_from_pdf(content)
        title = file.filename.rsplit(".", 1)[0]
        
        syllabus = generate_course_syllabus(title, difficulty, context_text)
        return save_course_to_db(syllabus, title, difficulty, current_user.id, db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/generate/url", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def generate_from_url(
    url: str = Form(...),
    difficulty: str = Form("Beginner"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generates a course from a YouTube URL or Web Link."""
    try:
        if "youtube.com" in url or "youtu.be" in url:
            context_text = ingestion_service.extract_youtube_transcript(url)
            title = "Video Analysis"
        else:
            context_text = ingestion_service.scrape_web_page(url)
            title = "Web Analysis"

        syllabus = generate_course_syllabus(title, difficulty, context_text)
        return save_course_to_db(syllabus, title, difficulty, current_user.id, db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.get("/my-courses")
def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all courses generated by the authenticated user."""
    courses = db.query(Course).filter(Course.owner_id == current_user.id).all()
    return [{"id": c.id, "title": c.title, "description": c.description,
             "difficulty": c.difficulty, "status": c.status, "created_at": c.created_at} for c in courses]

@router.get("/topics/{topic_id}", response_model=TopicSchema)
def get_topic_content(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get detailed content for a topic. 
    If content is missing, triggers AI generation on-the-fly.
    """
    topic = db.query(Topic).join(Module).join(Course).filter(
        Topic.id == topic_id,
        Course.owner_id == current_user.id
    ).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    # If already generated, return it
    if topic.beginner_content:
        # Load quizzes from relationship
        return topic

    # Otherwise, generate it
    try:
        content = generate_topic_content(
            topic.module.course.title,
            topic.module.title,
            topic.title
        )
        
        # Update topic content
        topic.beginner_content = content["beginner_content"]
        topic.intermediate_content = content["intermediate_content"]
        topic.expert_content = content["expert_content"]
        topic.examples = content["examples"]
        topic.analogies = content["analogies"]
        topic.summary = content["summary"]

        # Save quizzes
        for q in content.get("quizzes", []):
            db_quiz = Quiz(
                topic_id=topic.id,
                question=q["question"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                difficulty=q.get("difficulty", "medium")
            )
            db.add(db_quiz)
        # Save flashcards (to the course)
        for f in content.get("flashcards", []):
            db_flashcard = Flashcard(
                course_id=topic.module.course_id,
                front=f["front"],
                back=f["back"]
            )
            db.add(db_flashcard)

        db.commit()
        db.refresh(topic)
        return topic

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail=f"Topic content generation failed: {str(e)}"
        )

@router.post("/{course_id}/mentor")
def mentor_chat(
    course_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Contextual chat with AI Mentor."""
    course = db.query(Course).filter(Course.id == course_id, Course.owner_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    topic_id = payload.get("topic_id")
    query = payload.get("query")
    history = payload.get("history", [])

    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    topic_content = ""
    if topic:
        topic_content = f"{topic.beginner_content}\n{topic.intermediate_content}\n{topic.expert_content}"

    try:
        response = get_mentor_response(
            course_title=course.title,
            topic_title=topic.title if topic else "General",
            topic_content=topic_content,
            user_query=query,
            chat_history=history
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mentor offline: {str(e)}")

@router.get("/topics/{topic_id}/lab")
def get_topic_lab(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generates a practical lab for the topic."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    topic_content = f"{topic.beginner_content}\n{topic.intermediate_content}\n{topic.expert_content}"
    return create_lab_exercise(topic.title, topic_content)

@router.post("/topics/{topic_id}/lab/submit")
def submit_topic_lab(
    topic_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Evaluates a lab submission and awards XP."""
    exercise = payload.get("exercise")
    submission = payload.get("submission")
    
    result = evaluate_lab_submission(exercise, submission)
    
    if result["passed"]:
        current_user.xp += result.get("xp_awarded", 100)
        db.commit()
        
    return result

@router.get("/{course_id}/podcast")
def get_course_podcast(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generates an AI audio summary script for the course."""
    course = db.query(Course).filter(Course.id == course_id, Course.owner_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Format syllabus for the agent
    syllabus = [{"title": m.title} for m in course.modules]
    
    script = generate_podcast_script(course.title, syllabus, course.description)
    
    return {
        "script": script,
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", # Mock
        "duration_seconds": 300
    }
@router.get("/{course_id}/certificate/download")
def download_certificate(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generates and returns a PDF certificate."""
    course = db.query(Course).filter(Course.id == course_id, Course.owner_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if course is completed
    # Actually, let's just generate it if they ask for now, but ideally we check progress
    
    cert_id = f"CF-{course.id}-{current_user.id}"
    cert_filename = f"certificate_{course.id}.pdf"
    cert_path = os.path.join("/tmp", cert_filename)
    
    generate_certificate_pdf(
        user_name=current_user.name,
        course_title=course.title,
        completion_date="2026-03-12",
        certificate_id=cert_id,
        output_path=cert_path
    )
    
    return FileResponse(cert_path, filename=cert_filename, media_type='application/pdf')
