import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate a complete course structure from content using AI
 * Structure: Course → Modules → Topics (NO LESSONS)
 */
export async function generateCourse(content) {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    // Fallback: create a simple course structure
    return createFallbackCourse(content);
  }

  try {
    // Detect if this is a broad topic request (like "Python full course")
    const isBroadTopic = content.length < 500 && (
      content.toLowerCase().includes('full course') ||
      content.toLowerCase().includes('complete course') ||
      content.toLowerCase().includes('from basics') ||
      content.toLowerCase().includes('comprehensive') ||
      content.toLowerCase().match(/^(python|javascript|java|react|web development|machine learning|data science)/i)
    );

    const prompt = `You are an expert course creator and curriculum designer. ${isBroadTopic ? 'The user has requested a comprehensive course on a broad topic. Analyze the topic and create a complete, detailed syllabus covering all essential aspects from fundamentals to advanced concepts.' : 'Convert the following content into a comprehensive, well-structured educational course.'}

IMPORTANT: The course structure MUST be: Course → Modules → Topics (NO LESSONS)

LEVEL DETECTION:
First, analyze the content/request and infer the appropriate course level:
- BEGINNER: Simple language, basic concepts, introductory topics, or explicit beginner requests
- INTERMEDIATE: Technical details, moderate complexity, assumes some background knowledge
- ADVANCED: Advanced topics, complex concepts, requires prior knowledge, production/enterprise scenarios

Based on the detected level, adjust ALL explanations to match that level while still providing all three levels (beginner/intermediate/expert) for each topic.

${isBroadTopic ? `TOPIC ANALYSIS:
The user wants a comprehensive course on: "${content}"
Analyze this topic and create a complete curriculum that covers:
- All fundamental concepts
- Progressive learning path (basics → intermediate → advanced)
- Real-world applications
- Best practices
- Common patterns and idioms
- Industry standards

Break it down into logical modules that build upon each other.` : ''}

Content/Request:
${content.substring(0, 20000)} ${content.length > 20000 ? '... [content truncated for processing]' : ''}

Generate a JSON response with this EXACT structure:
{
  "title": "Course Title",
  "description": "Comprehensive course description (2-3 sentences)",
  "modules": [
    {
      "moduleTitle": "Module Name (e.g., 'HTML Fundamentals', 'CSS Styling', 'JavaScript Basics')",
      "moduleDescription": "Brief module overview (1-2 sentences)",
      "topics": [
        {
          "topicTitle": "Specific, Descriptive Topic Name (e.g., 'What is Python?', 'Installing Python & Running Your First Program', 'Variables and Data Types', 'Input and Output Operations', 'Type Conversion in Python') - NEVER use generic names like 'Topic 1', 'Concept 1', etc.",
          "beginner": "⭐ [TOPIC NAME] — BEGINNER LEVEL\n\n# Overview\n[Start with a clear definition and overview - 2-3 sentences]\n\n# Why This Matters\n[Explain why this concept is important - 1-2 paragraphs]\n\n# Step-by-Step Explanation\n[Break down the concept into clear, numbered steps. Use simple language, everyday analogies, and avoid jargon. 400-600 words total.]\n\n## Key Points:\n• [Point 1 with explanation]\n• [Point 2 with explanation]\n• [Point 3 with explanation]\n\n## Example:\n[Include a practical, beginner-friendly example with detailed comments]\n\n## Common Mistakes:\n• [Mistake 1 and how to avoid it]\n• [Mistake 2 and how to avoid it]\n\n## Quick Recap:\n[2-3 sentence summary of key takeaways]",
          "intermediate": "⭐ [TOPIC NAME] — INTERMEDIATE LEVEL\n\n# Deep Dive\n[Technical overview with more depth - 2-3 paragraphs]\n\n# How It Works Internally\n[Explain the internal mechanisms, how things work under the hood - 2-3 paragraphs]\n\n# Advanced Concepts\n[Cover intermediate-level concepts, patterns, and techniques - 500-800 words total]\n\n## Practical Examples:\n[Include multiple code examples with explanations]\n\n## Real-World Use Cases:\n• [Use case 1 with explanation]\n• [Use case 2 with explanation]\n• [Use case 3 with explanation]\n\n## Best Practices:\n• [Best practice 1]\n• [Best practice 2]\n• [Best practice 3]\n\n## Common Patterns:\n[Explain common patterns and idioms related to this topic]\n\n## Performance Considerations:\n[If applicable, discuss performance implications]\n\n## Key Takeaways:\n[Summary of important points]",
          "expert": "⭐ [TOPIC NAME] — EXPERT LEVEL\n\n# Architecture & Design\n[Deep architectural discussion - 2-3 paragraphs]\n\n# Internal Implementation Details\n[Explain how it's implemented internally, memory management, optimization strategies - 700-1000+ words total]\n\n# Advanced Patterns & Techniques\n[Cover advanced patterns, design principles, and expert-level techniques]\n\n## Advanced Examples:\n[Complex, production-ready examples]\n\n## Edge Cases & Gotchas:\n• [Edge case 1 with detailed explanation]\n• [Edge case 2 with detailed explanation]\n• [Edge case 3 with detailed explanation]\n\n## Performance Optimization:\n[Deep dive into performance considerations, optimization techniques]\n\n## Industry Standards & Best Practices:\n[Discuss industry standards, conventions, and production best practices]\n\n## Production Scenarios:\n[Real-world production use cases and considerations]\n\n## Advanced Concepts:\n• [Advanced concept 1 with detailed explanation]\n• [Advanced concept 2 with detailed explanation]\n• [Advanced concept 3 with detailed explanation]\n\n## Key Takeaways:\n[Summary of expert-level insights]",
          "examples": [
            "Practical example 1 with detailed explanation",
            "Code example or real-world scenario 2",
            "Use case example 3"
          ],
          "analogies": [
            "Creative analogy 1 that helps understanding (e.g., 'Think of HTML like a building blueprint...')",
            "Relatable analogy 2 that explains complex concepts simply"
          ],
          "summary": "Concise summary of the topic (2-3 sentences covering key points)",
          "quiz": [
            {
              "questionText": "Clear, well-formulated multiple choice question",
              "type": "mcq",
              "options": ["Option A (plausible but incorrect)", "Option B (correct answer)", "Option C (plausible but incorrect)", "Option D (plausible but incorrect)"],
              "correctAnswer": 1,
              "explanation": "Detailed explanation (2-3 sentences) of why the correct answer is right, why other options are wrong, and what concept this tests",
              "difficulty": "Beginner"
            },
            {
              "questionText": "True or False: [Statement about the topic]",
              "type": "true_false",
              "options": ["True", "False"],
              "correctAnswer": 0,
              "explanation": "Detailed explanation of why this statement is true/false, with context and examples",
              "difficulty": "Beginner"
            },
            {
              "questionText": "Complete the code: [Provide code snippet with blank]",
              "type": "code",
              "options": ["Option A (correct code)", "Option B (syntax error)", "Option C (wrong logic)", "Option D (runtime error)"],
              "correctAnswer": 0,
              "explanation": "Explain what the code does, why the correct answer works, and why others fail",
              "difficulty": "Intermediate"
            },
            {
              "questionText": "Find the error in this code: [Provide code with error]",
              "type": "code",
              "options": ["Error description A (correct)", "Error description B", "Error description C", "No error"],
              "correctAnswer": 0,
              "explanation": "Explain what the error is, why it occurs, and how to fix it",
              "difficulty": "Intermediate"
            },
            {
              "questionText": "More challenging multiple choice question",
              "type": "mcq",
              "options": ["Option A", "Option B (correct)", "Option C", "Option D"],
              "correctAnswer": 1,
              "explanation": "Detailed explanation with technical details",
              "difficulty": "Intermediate"
            },
            {
              "questionText": "Advanced, complex question requiring deep understanding",
              "type": "mcq",
              "options": ["Option A", "Option B", "Option C (correct)", "Option D"],
              "correctAnswer": 2,
              "explanation": "Comprehensive explanation covering advanced concepts, edge cases, and best practices",
              "difficulty": "Expert"
            }
          ]
        }
      ],
      "quiz": [
        {
          "questionText": "Module-level multiple choice question",
          "type": "mcq",
          "options": ["Option A", "Option B (correct)", "Option C", "Option D"],
          "correctAnswer": 1,
          "explanation": "Detailed explanation of the correct answer",
          "difficulty": "Beginner"
        },
        {
          "questionText": "Module-level true/false question",
          "type": "true_false",
          "options": ["True", "False"],
          "correctAnswer": 0,
          "explanation": "Explanation of why true/false",
          "difficulty": "Beginner"
        },
        {
          "questionText": "Module-level code completion question",
          "type": "code",
          "options": ["Code option A (correct)", "Code option B", "Code option C", "Code option D"],
          "correctAnswer": 0,
          "explanation": "Explanation of the code",
          "difficulty": "Intermediate"
        },
        {
          "questionText": "Module-level find the error question",
          "type": "code",
          "options": ["Error description A (correct)", "Error description B", "Error description C", "No error"],
          "correctAnswer": 0,
          "explanation": "Explanation of the error",
          "difficulty": "Intermediate"
        },
        {
          "questionText": "Advanced module-level question",
          "type": "mcq",
          "options": ["Option A", "Option B", "Option C (correct)", "Option D"],
          "correctAnswer": 2,
          "explanation": "Comprehensive explanation",
          "difficulty": "Expert"
        }
      ]
    }
  ],
  "quiz": [
    {
      "questionText": "Course-level comprehensive multiple choice question",
      "type": "mcq",
      "options": ["Option A", "Option B", "Option C (correct)", "Option D"],
      "correctAnswer": 2,
      "explanation": "Comprehensive explanation covering multiple concepts",
      "difficulty": "Expert"
    },
    {
      "questionText": "Course-level true/false question",
      "type": "true_false",
      "options": ["True", "False"],
      "correctAnswer": 1,
      "explanation": "Detailed explanation",
      "difficulty": "Intermediate"
    },
    {
      "questionText": "Course-level code question",
      "type": "code",
      "options": ["Code option A (correct)", "Code option B", "Code option C", "Code option D"],
      "correctAnswer": 0,
      "explanation": "Comprehensive code explanation",
      "difficulty": "Expert"
    }
  ],
  "summary": "Overall course summary (3-5 sentences covering main concepts)"
}

CRITICAL REQUIREMENTS:
1. Generate 4-10 modules based on the content/topic (more modules for broad topics like "Python full course")
2. Each module should have 8-25 topics with MEANINGFUL, DESCRIPTIVE NAMES (comprehensive coverage)
3. NO LESSONS - Modules contain topics directly
4. TOPIC NAMES MUST BE SPECIFIC AND DESCRIPTIVE:
   - ✅ GOOD: "Variables and Data Types", "Installing Python & Running Your First Program", "Input and Output Operations", "Type Conversion in Python", "Control Flow with If-Else Statements"
   - ❌ BAD: "Topic 1", "Concept 1", "Introduction", "Basics", "Advanced Topics"
5. Each topic MUST have deep, structured explanations:
   - Beginner: 400-600 words with Overview, Why This Matters, Step-by-Step Explanation, Examples, Common Mistakes, Recap
   - Intermediate: 500-800 words with Deep Dive, How It Works Internally, Advanced Concepts, Practical Examples, Best Practices, Real-World Use Cases
   - Expert: 700-1000+ words with Architecture & Design, Internal Implementation, Advanced Patterns, Edge Cases, Performance Optimization, Production Scenarios
6. ALL explanations must be:
   - Structured with clear markdown headings (##, ###), bullet points, and sections
   - Educational and teaching-focused (not just summarizing)
   - Directly tied to the content/topic
   - Match the inferred course level while providing progressive learning
   - Include multiple examples, code snippets (if applicable), and practical scenarios
7. QUIZ GENERATION - Generate 5-10 questions PER TOPIC with variety:
   - Multiple Choice Questions (mcq): 40-50% of questions
   - True/False (true_false): 20-30% of questions
   - Code Completion (code): 20-30% of questions
   - Find the Error (code): 10-20% of questions
   - Each question MUST have: questionText, type, options, correctAnswer (index), explanation (2-3 sentences), difficulty (Beginner/Intermediate/Expert)
8. Module-level quizzes: Generate 10-15 questions per module (same variety as topic quizzes)
9. Course-level quiz: Generate 15-20 comprehensive questions covering all modules
10. Examples should be practical, real-world, and directly tied to the content
11. Analogies should be creative and help understanding complex concepts
12. Make explanations progressive - each level builds on the previous
13. Use clear, engaging language appropriate for the detected course level
14. Include real-world applications, use cases, and industry best practices
15. For broad topics, create a complete curriculum covering fundamentals → intermediate → advanced
16. Ensure ALL content is detailed, thorough, and educational - teach, don't just summarize!

MODULE GENERATION STRATEGY:
- Break the subject into major logical sections
- Each module should cover a distinct area
- Modules should flow logically (foundation → advanced)
- Example for "Web Development": HTML → CSS → JavaScript → Frameworks → Deployment

TOPIC GENERATION STRATEGY:
- For each module, identify ALL important concepts that need to be covered
- Create 8-25 specific, descriptive topics with MEANINGFUL NAMES
- Topics should flow logically and build upon each other
- Topics should be comprehensive and cover the module thoroughly
- NEVER use generic names like "Topic 1", "Concept 1", "Introduction", "Basics"
- Use descriptive names like "Variables and Data Types", "Installing Python & Running Your First Program", "Control Flow with If-Else Statements", "Working with Lists and Tuples", "File I/O Operations", "Exception Handling and Error Management"
- For broad topics, ensure comprehensive coverage from absolute basics to advanced concepts

Return ONLY valid JSON, no markdown formatting, no code blocks.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Combine system and user prompts for Gemini
    const fullPrompt = `You are an expert educational content creator. Generate comprehensive, well-structured courses with Modules → Topics structure (NO LESSONS). Always return valid JSON only. Create specific, descriptive topic names based on the content - never use generic names like "Topic 1".

${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonContent = responseText.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '');
    }

    const courseData = JSON.parse(jsonContent);
    return courseData;
  } catch (error) {
    console.error('AI generation error:', error);
    // Fallback to simple course
    return createFallbackCourse(content);
  }
}

/**
 * Create a simple course structure without AI (fallback)
 * Structure: Course → Modules → Topics (NO LESSONS)
 */
function createFallbackCourse(content) {
  const words = content.split(/\s+/);
  const chunkSize = 500;
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }

  // Extract potential topic names from content - try to get meaningful names
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const topicNames = [];
  
  // Try to extract meaningful topic names
  sentences.slice(0, 50).forEach(s => {
    const words = s.trim().split(/\s+/);
    if (words.length >= 3 && words.length <= 8) {
      const potentialName = words.slice(0, Math.min(6, words.length)).join(' ');
      if (potentialName.length > 10 && potentialName.length < 60) {
        topicNames.push(potentialName.charAt(0).toUpperCase() + potentialName.slice(1));
      }
    }
  });
  
  // Fallback to numbered topics if we don't have enough
  while (topicNames.length < 30) {
    topicNames.push(`Topic ${topicNames.length + 1}`);
  }

  const modules = [];
  const maxModules = Math.min(6, Math.ceil(chunks.length / 10));
  
  for (let i = 0; i < maxModules; i++) {
    const moduleChunks = chunks.slice(i * 10, (i + 1) * 10);
    if (moduleChunks.length === 0) break;

    // Create 8-15 topics per module
    const topicsPerModule = Math.min(15, Math.max(8, moduleChunks.length));
    const topics = [];
    
    for (let t = 0; t < topicsPerModule; t++) {
      const chunk = moduleChunks[t % moduleChunks.length] || moduleChunks[0];
      const topicName = topicNames[t + (i * 15)] || `Concept ${t + 1}`;
      
      const beginnerContent = `⭐ ${topicName.toUpperCase()} — BEGINNER LEVEL\n\n1️⃣ Beginner Level (Simple & Easy to Understand)\n\n${chunk.substring(0, 200)} This is a beginner-friendly explanation that introduces the concept in simple terms. It uses everyday language and avoids technical jargon.`;
      const intermediateContent = `⭐ ${topicName.toUpperCase()} — INTERMEDIATE LEVEL\n\n2️⃣ Intermediate Level (More Technical + Practical)\n\n${chunk.substring(0, 350)} This intermediate explanation provides more technical details and context. It explains how things work and includes practical considerations.`;
      const expertContent = `⭐ ${topicName.toUpperCase()} — EXPERT LEVEL\n\n3️⃣ Expert Level (Deep, Architectural & Internal Concepts)\n\n${chunk} This expert-level explanation delves deep into technical details, best practices, and advanced concepts. It covers internal mechanisms and production considerations.`;

      topics.push({
        topicTitle: topicName,
        beginner: beginnerContent,
        intermediate: intermediateContent,
        expert: expertContent,
        examples: [`Example ${t + 1}: ${chunk.substring(0, 100)}...`],
        analogies: [`Think of this like... ${chunk.substring(0, 80)}...`],
        summary: chunk.substring(0, 150) + '...',
        quiz: [
          {
            questionText: `What is the main concept of ${topicName}?`,
            type: 'mcq',
            options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
            correctAnswer: 0,
            explanation: 'Based on the topic content',
            difficulty: 'Beginner'
          }
        ]
      });
    }

    if (topics.length > 0) {
      modules.push({
        moduleTitle: `Module ${i + 1}`,
        moduleDescription: `Module ${i + 1} covering important topics`,
        topics: topics,
        quiz: [
          {
            questionText: `Module ${i + 1} question?`,
            type: 'mcq',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: 'Explanation',
            difficulty: 'Beginner'
          }
        ]
      });
    }
  }

  return {
    title: 'Generated Course',
    description: 'Course generated from uploaded content with structured explanations',
    modules: modules,
    quiz: [
      {
        questionText: 'What is the main topic of this course?',
        type: 'mcq',
        options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
        correctAnswer: 0,
        explanation: 'Based on the course content',
        difficulty: 'Intermediate'
      }
    ],
    summary: content.substring(0, 500) + '...'
  };
}
