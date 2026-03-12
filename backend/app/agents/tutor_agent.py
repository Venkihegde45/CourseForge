import os
from app.core.llm import invoke_with_retry

SYSTEM_PROMPT = """You are the 'CourseForge Mentor', a high-tier AI tutor dedicated to helping users master complex topics.
Your knowledge is grounded in the provided course context. 
Rules:
1. Be encouraging, concise, and technical where appropriate.
2. If the user asks something outside the course context, politely guide them back to the topic.
3. Use analogies to explain difficult concepts if the user seems stuck.
4. You have access to the full course structure and the current topic content.
"""

def get_mentor_response(course_title: str, topic_title: str, topic_content: str, user_query: str, chat_history: list = []) -> str:
    """
    Generates a contextual response from the AI Mentor.
    """
    
    context = f"Course: {course_title}\nCurrent Topic: {topic_title}\nContent Context: {topic_content}\n"
    
    # Build prompt with history
    full_prompt = f"Here is the context for our session:\n{context}\n\nChat History:\n"
    for msg in chat_history:
        role = "Student" if msg['role'] == 'user' else "Mentor"
        full_prompt += f"{role}: {msg['content']}\n"
    
    full_prompt += f"\nStudent: {user_query}\n"

    return invoke_with_retry(
        prompt=full_prompt,
        system_instruction=SYSTEM_PROMPT,
        model_name="gemini-1.5-flash"
    )
