"""
Curriculum Architect Agent
Powered by Google Gemini.
Generates a structured course syllabus (Modules and Topics) as JSON.
"""
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", # Using flash for speed/cost
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
  "modules": [
    {
      "order": 1,
      "title": "Module Title",
      "description": "Short description of the module",
      "topics": [
        {
          "order": 1,
          "title": "Specific Topic Title"
        }
      ]
    }
  ]
}

Create 4-6 modules. Each module should contain 4-8 specific topics. 
Be thorough, educational, and ensure a logical learning flow from basics to advanced."""

def generate_course_syllabus(topic: str, difficulty: str = "Beginner", context_text: str = None) -> dict:
    """
    Generates a course syllabus using the LangChain Gemini model.
    If context_text is provided, it grounds the curriculum in that specific material.
    """
    user_prompt_parts = [f"Create a complete {difficulty}-level course on the following topic:"]
    user_prompt_parts.append(f"Topic: {topic}")

    if context_text:
        # Limit context_text to avoid exceeding token limits, 15000 chars is a rough estimate
        user_prompt_parts.append(f"\nBase the following curriculum strictly on this source material:\n{context_text[:15000]}")

    user_prompt_parts.append("\nGenerate a structured syllabus with 4-6 modules and clear topic titles.")
    user_prompt_parts.append("Remember: respond ONLY with the JSON object.")
    
    user_prompt = "\n".join(user_prompt_parts)

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt),
    ]

    response = llm.invoke(messages)
    raw = response.content.strip()

    # Clean up if Gemini wrapped in markdown code blocks
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        elif raw.startswith("\n"):
            raw = raw[1:]
    
    # Final strip to be safe
    raw = raw.strip()
    if raw.endswith("```"):
        raw = raw[:-3].strip()

    course_data = json.loads(raw)
    return course_data
