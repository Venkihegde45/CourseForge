import express from 'express';
import Course from '../models/Course.js';
import { generateTutorResponse } from '../utils/tutorAI.js';

const router = express.Router();

/**
 * POST /api/tutor/chat
 * Chat with AI tutor about course content
 */
router.post('/chat', async (req, res) => {
  try {
    const { courseId, message, context, currentLevel } = req.body;

    if (!courseId || !message) {
      return res.status(400).json({ error: 'Course ID and message are required' });
    }

    // Get course for additional context
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Generate AI response
    const response = await generateTutorResponse(message, context, course, currentLevel);

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Tutor chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;






