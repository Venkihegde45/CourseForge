"""
Curriculum Architect Agent
Powered by Google Gemini via LangChain.
Takes a topic and generates a structured, chapter-wise course syllabus as JSON.
"""
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings

# Initialize the Gemini model using the free tier
# Note: gemini-2.0-flash is currently hitting quota limits in this project.
# gemini-2.5-flash (preview) verified as working with the current API key.
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.7,
)

SYSTEM_PROMPT = """You are an expert curriculum architect. Your job is to create a structured, 
comprehensive course syllabus from a given topic.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, no backticks.

The JSON must follow this exact structure:
{
  "title": "Course Title Here",
  "description": "A one-paragraph description of this course",
  "difficulty": "starter",
  "chapters": [
    {
      "order": 1,
      "title": "Chapter Title",
      "objective": "What the learner will know after this chapter",
      "key_concepts": ["concept1", "concept2", "concept3"],
      "content_summary": "2-3 paragraph detailed explanation of this chapter's content"
    }
  ]
}

Create exactly 5 chapters. Be thorough, educational, and structured."""

def generate_course_syllabus(topic: str, difficulty: str = "starter") -> dict:
    """
    Takes a topic string and calls Gemini to generate a full course syllabus.
    Returns a Python dict representing the course structure.
    """
    user_prompt = f"""Create a complete {difficulty}-level course on the following topic:

Topic: {topic}

Generate a 5-chapter course with clear objectives and detailed content summaries for each chapter.
Remember: respond ONLY with the JSON object."""

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt),
    ]

    response = llm.invoke(messages)
    raw = response.content.strip()

    # Clean up if Gemini wrapped in markdown code blocks (defensive)
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    course_data = json.loads(raw)
    return course_data
