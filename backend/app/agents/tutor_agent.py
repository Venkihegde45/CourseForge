import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import SystemMessage, HumanMessage

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
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
    
    context = f"Course: {course_title}\nCurrent Topic: {topic_title}\nContent Context: {topic_content}\n"
    
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    
    # Add context as first message
    messages.append(HumanMessage(content=f"Here is the context for our session:\n{context}"))
    
    # Add history
    for msg in chat_history:
        if msg['role'] == 'user':
            messages.append(HumanMessage(content=msg['content']))
        else:
            messages.append(SystemMessage(content=msg['content'])) # Treating assistant as sys/ai
            
    # Final user query
    messages.append(HumanMessage(content=user_query))

    response = llm.invoke(messages)
    return response.content
