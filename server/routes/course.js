import express from 'express';
import Course from '../models/Course.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHelper.js';
import { validateObjectId } from '../middleware/validator.js';

const router = express.Router();

// Use optional auth - allows guests but attaches user if authenticated
router.use(optionalAuth);

/**
 * GET /api/course/:id
 * Get course by ID
 */
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!validateObjectId(req.params.id)) {
      return errorResponse(res, 'Invalid course ID format', 400);
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }

    // Check if user has access (if authenticated, only show their courses or public courses)
    if (req.user && course.userId && course.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Access denied. This course belongs to another user.', 403);
    }

    return successResponse(res, course, 'Course retrieved successfully');
  } catch (error) {
    console.error('Course fetch error:', error);
    return errorResponse(res, 'Failed to fetch course', 500, error);
  }
});

/**
 * GET /api/course
 * Get all courses (user-specific if authenticated, otherwise all)
 * Supports pagination: ?page=1&limit=20
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // If user is authenticated, show only their courses
    // Otherwise show all courses (guest mode)
    const query = req.user ? { userId: req.user._id } : {};
    
    const [courses, total] = await Promise.all([
      Course.find(query)
        .select('title description createdAt userId sourceType moduleCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query)
    ]);

    // Add module count to each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const fullCourse = await Course.findById(course._id).select('modules');
        return {
          ...course,
          moduleCount: fullCourse?.modules?.length || 0,
          topicCount: fullCourse?.modules?.reduce((sum, m) => sum + (m.topics?.length || 0), 0) || 0
        };
      })
    );
    
    return paginatedResponse(res, coursesWithCounts, {
      page,
      limit,
      total
    }, 'Courses retrieved successfully');
  } catch (error) {
    console.error('Courses fetch error:', error);
    return errorResponse(res, 'Failed to fetch courses', 500, error);
  }
});

/**
 * DELETE /api/course/:id
 * Delete a course (requires authentication)
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return errorResponse(res, 'Invalid course ID format', 400);
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }

    // Check if user owns the course
    if (course.userId && course.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Access denied. You can only delete your own courses.', 403);
    }

    await Course.findByIdAndDelete(req.params.id);
    
    return successResponse(res, null, 'Course deleted successfully');
  } catch (error) {
    console.error('Course delete error:', error);
    return errorResponse(res, 'Failed to delete course', 500, error);
  }
});

export default router;





