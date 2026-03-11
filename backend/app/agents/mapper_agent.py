import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage, HumanMessage

SYSTEM_PROMPT = """You are the 'CourseForge Cartographer'. Your job is to analyze a collection of courses and find semantic connections between them.

INPUT: A list of course titles and their descriptions.
OUTPUT: A JSON object containing:
1. "nodes": A list of all course IDs with their titles and categories.
2. "links": A list of objects { "source": course_id, "target": course_id, "label": "Reason for connection" }.

Rules:
- Only create links where a genuine educational or topical overlap exists.
- Be concise with link labels (e.g., "Advanced Algebra overlap", "Shared UI/UX principles").
- Ensure the output is valid JSON.
"""

def generate_knowledge_graph(courses: list) -> dict:
    """
    Analyzes multiple courses to create a graph of semantic connections.
    courses: List of objects with id, title, description, category.
    """
    if not courses:
        return {"nodes": [], "links": []}

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
    
    course_data = "\n".join([
        f"ID: {c['id']} | Title: {c['title']} | Category: {c['category']} | Desc: {c['description']}" 
        for c in courses
    ])
    
    response = llm.invoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Analyze these courses and generate a semantic graph:\n{course_data}")
    ])
    
    try:
        content = response.content
        if "```json" in content: content = content.split("```json")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        print(f"Mapper Agent error: {e}")
        # Fallback: Just return nodes without links
        return {
            "nodes": courses,
            "links": []
        }
