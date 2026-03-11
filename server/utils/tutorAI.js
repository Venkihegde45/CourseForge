import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate AI tutor response based on user question and context
 */
export async function generateTutorResponse(userMessage, context, course, currentLevel = 'beginner') {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    // Fallback response
    return generateFallbackResponse(userMessage, context, course, currentLevel);
  }

  try {
    const prompt = `You are an expert AI tutor helping a student learn from a course.

Course Context:
${context || 'No specific context provided'}

Current Learning Level: ${currentLevel || 'beginner'}

Student Question: ${userMessage}

Instructions:
1. Provide a clear, helpful answer based on the course content
2. Match the explanation level to the student's current learning level (${currentLevel})
3. If the question is about a specific topic, reference the relevant content
4. Use examples and analogies when helpful
5. Be encouraging and educational
6. If you don't have enough context, ask clarifying questions
7. Keep responses concise but comprehensive (200-400 words)
8. Use the same formatting style as the course (with emojis and clear structure)

Provide your response:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Combine system and user prompts for Gemini
    const fullPrompt = `You are a helpful, knowledgeable AI tutor. You explain concepts clearly, provide examples, and help students understand course material. You adapt your explanations to the student's learning level.

${prompt}`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error('AI tutor error:', error);
    return generateFallbackResponse(userMessage, context, course, currentLevel);
  }
}

/**
 * Generate fallback response when AI is not available
 */
function generateFallbackResponse(userMessage, context, course, currentLevel) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
    return `Based on the course content, I can help explain this concept. ${context ? 'Based on the current context, ' : ''}Let me provide a ${currentLevel} level explanation:\n\n[Explanation based on available context]\n\nWould you like me to go deeper into any specific aspect?`;
  }

  if (lowerMessage.includes('example')) {
    return `Here are some examples:\n\n1. [Example 1]\n2. [Example 2]\n\nThese examples help illustrate the concept. Would you like more examples?`;
  }

  return `I understand you're asking about "${userMessage}". ${context ? 'Based on the course content, ' : ''}I can help explain this. Could you provide more details about what specifically you'd like to understand?`;
}





