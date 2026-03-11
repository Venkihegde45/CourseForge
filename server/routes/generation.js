import express from 'express';
import CourseGeneration from '../models/CourseGeneration.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { validateObjectId } from '../middleware/validator.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

/**
 * GET /api/generation/:id
 * Get generation status by ID
 */
router.get('/:id', async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return errorResponse(res, 'Invalid generation ID format', 400);
    }

    const generation = await CourseGeneration.findById(req.params.id);
    
    if (!generation) {
      return errorResponse(res, 'Generation status not found', 404);
    }

    // Check if user has access
    if (req.user && generation.userId && generation.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Access denied', 403);
    }

    return successResponse(res, generation, 'Generation status retrieved successfully');
  } catch (error) {
    console.error('Generation status fetch error:', error);
    return errorResponse(res, 'Failed to fetch generation status', 500, error);
  }
});

/**
 * GET /api/generation/course/:courseId
 * Get generation status by course ID
 */
router.get('/course/:courseId', async (req, res) => {
  try {
    if (!validateObjectId(req.params.courseId)) {
      return errorResponse(res, 'Invalid course ID format', 400);
    }

    const generation = await CourseGeneration.findOne({ 
      courseId: req.params.courseId 
    }).sort({ createdAt: -1 });
    
    if (!generation) {
      return errorResponse(res, 'Generation status not found for this course', 404);
    }

    // Check if user has access
    if (req.user && generation.userId && generation.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Access denied', 403);
    }

    return successResponse(res, generation, 'Generation status retrieved successfully');
  } catch (error) {
    console.error('Generation status fetch error:', error);
    return errorResponse(res, 'Failed to fetch generation status', 500, error);
  }
});

export default router;


