"""
Topic Agent
Generates deep, multi-level content for a specific topic, including quizzes and flashcards.
"""
import json
from app.core.llm import invoke_with_retry

SYSTEM_PROMPT = """You are an elite educational content creator. Your goal is to explain complex topics with absolute clarity across three levels of expertise.

You MUST return your response as a valid JSON object with this exact schema:
{
  "beginner_content": "Simple, accessible explanation of the topic (2-3 paragraphs)",
  "intermediate_content": "More detailed explanation with technical depth (2-3 paragraphs)",
  "expert_content": "Advanced-level deep explanation (2-3 paragraphs)",
  "examples": ["Practical example 1", "Practical example 2", "Practical example 3"],
  "analogies": ["Mental model/analogy 1", "Mental model/analogy 2"],
  "summary": "A concise 2-3 sentence summary of the entire topic.",
  "quizzes": [
    {
      "question": "Quiz question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Why this is correct.",
      "difficulty": "medium"
    }
  ],
  "flashcards": [
    { "front": "Key term or concept", "back": "Definition or explanation" }
  ]
}

RULES:
- Return ONLY valid JSON, no markdown wrapping.
- Be technical but accessible.
- Include at least 3 quizzes and 3 flashcards.
"""

def generate_topic_content(course_title: str, module_title: str, topic_title: str, context_text: str = "") -> dict:
    """
    Generates educational content for a topic within a course/module context.
    """
    user_prompt = f"Course: {course_title}\nModule: {module_title}\nTopic: {topic_title}\n"
    if context_text:
        user_prompt += f"Context/Source Materials: {context_text}\n"
    
    user_prompt += "\nPlease generate comprehensive educational content for this topic following the structured JSON guidelines."

    raw = invoke_with_retry(
        prompt=user_prompt,
        system_instruction=SYSTEM_PROMPT
    ).strip()

    # Clean up markdown if necessary
    if raw.startswith("```json"):
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif raw.startswith("```"):
        raw = raw.split("```")[1].split("```")[0].strip()
    
    try:
        return json.loads(raw)
    except:
        # Fallback to structured dictionary if JSON parsing fails
        return {
            "beginner_content": raw,
            "intermediate_content": "",
            "expert_content": "",
            "examples": [],
            "analogies": [],
            "summary": f"Content for {topic_title}",
            "quizzes": [],
            "flashcards": []
        }
