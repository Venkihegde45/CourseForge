import os
import json
from app.core.llm import invoke_with_retry

SYSTEM_PROMPT = """You are the 'CourseForge Lab Warden'. Your job is to create and evaluate practical 'Hands-on Labs' for students.
1. When asked to CREATE a lab:
   Return a JSON object with: { "exercise": "Description of task", "requirements": ["List of things to include"], "hints": ["Hint 1", "Hint 2"] }
2. When asked to EVALUATE a lab:
   Analyze the user's submission against the exercise.
   Return a JSON object with: { "passed": boolean, "feedback": "Constructive feedback", "score": number (0-100), "xp_awarded": number }
   Be strict but fair. If concepts are missing, explain why they failed.
"""

def create_lab_exercise(topic_title: str, topic_content: str) -> dict:
    content = invoke_with_retry(
        prompt=f"CREATE a hands-on lab exercise for the following topic:\nTitle: {topic_title}\nContent: {topic_content}",
        system_instruction=SYSTEM_PROMPT
    )
    
    try:
        if "```json" in content: content = content.split("```json")[1].split("```")[0].strip()
        return json.loads(content)
    except:
        return {"exercise": "Explain the core concepts of this topic in your own words.", "requirements": ["Clarity", "Accuracy"], "hints": ["Think about real-world use cases."]}

def evaluate_lab_submission(exercise: dict, submission: str) -> dict:
    content = invoke_with_retry(
        prompt=f"EVALUATE this lab submission.\nExercise: {json.dumps(exercise)}\nSubmission: {submission}",
        system_instruction=SYSTEM_PROMPT
    )
    
    try:
        if "```json" in content: content = content.split("```json")[1].split("```")[0].strip()
        return json.loads(content)
    except:
        return {"passed": True, "feedback": "Well done! The forge recognizes your effort.", "score": 80, "xp_awarded": 150}
