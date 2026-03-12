import json
from app.core.llm import invoke_with_retry

SYSTEM_PROMPT = """You are an expert curriculum designer. Your goal is to break down a user's chosen topic into a logical, high-quality course syllabus.
The syllabus must be structured into 'Modules', and each module must contain 'Lessons' (Topics).

SYLLABUS REQUIREMENTS:
1. Provide a course title and a short description.
2. Structure the course into 4-6 Modules.
3. Each Module SHOULD have 3-5 Lessons (Topics).
4. Return the result STRICTLY as a JSON object with this schema:
{
  "title": "Course Title",
  "description": "Short description",
  "modules": [
    {
      "title": "Module Name",
      "description": "Module summary",
      "lessons": [
        { "title": "Lesson name", "summary": "One sentence summary" }
      ]
    }
  ]
}
5. Content should be beginner-friendly.
"""

def generate_course_syllabus(topic: str, difficulty: str = "Beginner") -> dict:
    """
    Generates a full course structure using AI.
    """
    prompt = f"Topic: {topic}\nDifficulty: {difficulty}\n\nPlease generate a structured learning course as JSON."

    content = invoke_with_retry(
        prompt=prompt,
        system_instruction=SYSTEM_PROMPT
    ).strip()

    # Clean up markdown if necessary
    if content.startswith("```json"):
        content = content.split("```json")[1].split("```")[0].strip()
    elif content.startswith("```"):
        content = content.split("```")[1].split("```")[0].strip()

    try:
        return json.loads(content)
    except Exception as e:
        print(f"Failed to parse syllabus JSON: {e}")
        # Return a minimal valid structure if parsing fails
        return {
            "title": topic,
            "description": f"AI-Generated course on {topic}",
            "modules": []
        }
