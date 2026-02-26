import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { validateEmail, validatePassword, validateText } from '../middleware/validator.js';

const router = express.Router();

// JWT secret from environment or default
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    if (!validateEmail(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return errorResponse(res, passwordValidation.message, 400);
    }

    if (name) {
      const nameValidation = validateText(name, 2, 50);
      if (!nameValidation.valid) {
        return errorResponse(res, 'Name must be between 2 and 50 characters', 400);
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 409);
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name: name?.trim() || email.split('@')[0]
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    }, 'Account created successfully', 201);
  } catch (error) {
    console.error('Signup error:', error);
    return errorResponse(res, 'Failed to create account', 500, error);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    if (!validateEmail(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Failed to login', 500, error);
  }
});

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Get user's course count
    const Course = (await import('../models/Course.js')).default;
    const courseCount = await Course.countDocuments({ userId: user._id });

    return successResponse(res, {
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      courseCount
    }, 'User data retrieved successfully');
  } catch (error) {
    console.error('Auth check error:', error);
    return errorResponse(res, 'Invalid or expired token', 401);
  }
});

export default router;

