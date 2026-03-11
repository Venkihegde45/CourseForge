"""
Topic Specialist Agent
Powered by Google Gemini.
Generates deep, multi-level content for a specific topic, including quizzes and flashcards.
"""
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.7,
)

SYSTEM_PROMPT = """You are an elite educational content creator. Your goal is to explain complex topics with absolute clarity across three levels of expertise.

You MUST respond with ONLY a valid JSON object.

The JSON structure:
{
  "beginner_content": "150-300 words. Simple language, no jargon, focus on WHAT and WHY.",
  "intermediate_content": "200-400 words. Technical details, practical application, HOW it works internally.",
  "expert_content": "300-500 words. Architecture, performance, edge cases, industry standards.",
  "examples": ["Example 1 description", "Example 2 description"],
  "analogies": ["Analogy 1", "Analogy 2"],
  "summary": "A concise 2-3 sentence wrap-up.",
  "quizzes": [
    {
      "question": "The question text",
      "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
      "correct_answer": 0,
      "explanation": "Why this is correct",
      "difficulty": "easy"
    }
  ],
  "flashcards": [
    {
      "front": "Term or Question",
      "back": "Definition or Answer"
    }
  ]
}

Ensure the content is engaging, accurate, and follows the word count guidelines."""

def generate_topic_content(course_title: str, module_title: str, topic_title: str) -> dict:
    """
    Generates detailed content for a topic within its course context.
    """
    user_prompt = f"""Generate comprehensive educational content for the following topic:

Course: {course_title}
Module: {module_title}
Topic: {topic_title}

Requirements:
1. Provide 3 levels of explanation (Beginner, Intermediate, Expert).
2. Include 2-3 practical examples and 2-3 analogies.
3. Generate 3-5 quiz questions of varying difficulty (easy, medium, hard).
4. Generate 3-5 high-quality flashcards.
5. Respond ONLY with the JSON object."""

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt),
    ]

    response = llm.invoke(messages)
    raw = response.content.strip()

    # Clean up markdown if necessary
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        elif raw.startswith("\n"):
            raw = raw[1:]
    raw = raw.strip()
    if raw.endswith("```"):
        raw = raw[:-3].strip()

    return json.loads(raw)
