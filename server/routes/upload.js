import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fileProcessor from '../utils/fileProcessor.js';
import { generateCourse } from '../utils/aiGenerator.js';
import Course from '../models/Course.js';
import CourseGeneration from '../models/CourseGeneration.js';
import { optionalAuth } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { validateText, validateURL } from '../middleware/validator.js';

const router = express.Router();

// Use optional auth - allows guests but attaches user if authenticated
router.use(optionalAuth);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, Images, Word docs, Text files'));
    }
  }
});

/**
 * POST /api/upload
 * Upload file, text, or link - extract content, generate course
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    let extractedText = '';
    let sourceType = 'text';
    let sourceFile = '';

    // Handle different input types
    if (req.file) {
      // File upload
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;

      console.log(`Processing file: ${req.file.originalname}`);
      extractedText = await fileProcessor.processFile(filePath, mimeType);
      sourceType = fileProcessor.getFileType(mimeType);
      sourceFile = req.file.filename;

      if (!extractedText || extractedText.trim().length === 0) {
        fs.unlinkSync(filePath);
        return errorResponse(res, 'Could not extract text from file. The file may be corrupted or in an unsupported format.', 400);
      }
    } else if (req.body.text) {
      // Text/Topic input
      const textValidation = validateText(req.body.text, 10, 50000);
      if (!textValidation.valid) {
        return errorResponse(res, textValidation.message, 400);
      }
      extractedText = req.body.text.trim();
      sourceType = 'topic';
      console.log(`Processing topic/text input: ${extractedText.substring(0, 50)}...`);
    } else if (req.body.link) {
      // URL input
      if (!validateURL(req.body.link)) {
        return errorResponse(res, 'Invalid URL format. Please provide a valid http:// or https:// URL.', 400);
      }
      console.log(`Processing URL: ${req.body.link}`);
      try {
        extractedText = await fileProcessor.processLink(req.body.link);
        sourceType = 'link';
        
        if (!extractedText || extractedText.trim().length === 0) {
          return errorResponse(res, 'Could not extract content from URL. The page may be empty or inaccessible.', 400);
        }
      } catch (linkError) {
        return errorResponse(res, `Failed to process URL: ${linkError.message}`, 400);
      }
    } else {
      return errorResponse(res, 'No input provided. Please upload a file, enter text (min 10 characters), or provide a valid URL.', 400);
    }

    // Create generation status record
    const generationStatus = new CourseGeneration({
      userId: req.user ? req.user._id : null,
      status: 'processing',
      progress: 10,
      stage: 'Extracting content',
      sourceType: sourceType
    });
    await generationStatus.save();

    // Generate course using AI
    console.log('Generating course with AI...');
    
    // Update status
    generationStatus.status = 'generating';
    generationStatus.progress = 30;
    generationStatus.stage = 'Analyzing content and generating course structure';
    await generationStatus.save();

    let courseData;
    try {
      courseData = await generateCourse(extractedText);
      
      // Update status
      generationStatus.progress = 80;
      generationStatus.stage = 'Saving course to database';
      await generationStatus.save();
    } catch (genError) {
      generationStatus.status = 'failed';
      generationStatus.error = genError.message;
      generationStatus.progress = 0;
      await generationStatus.save();
      throw genError;
    }

    // Save course to database
    const course = new Course({
      ...courseData,
      sourceFile: sourceFile,
      sourceType: sourceType,
      userId: req.user ? req.user._id : null // Associate with user if authenticated
    });

    await course.save();

    // Link generation status to course
    generationStatus.courseId = course._id;
    generationStatus.status = 'completed';
    generationStatus.progress = 100;
    generationStatus.stage = 'Course generated successfully';
    await generationStatus.save();

    return successResponse(res, {
      courseId: course._id,
      title: course.title,
      description: course.description,
      moduleCount: course.modules?.length || 0,
      topicCount: course.modules?.reduce((sum, m) => sum + (m.topics?.length || 0), 0) || 0,
      generationId: generationStatus._id
    }, 'Course generated successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    return errorResponse(
      res,
      error.message || 'Failed to process input. Please try again.',
      500,
      process.env.NODE_ENV !== 'production' ? error : null
    );
  }
});

export default router;

