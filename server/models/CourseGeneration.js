import mongoose from 'mongoose';

/**
 * Course Generation Status Model
 * Tracks the progress of course generation
 */
const courseGenerationSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'generating', 'completed', 'failed'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stage: {
    type: String,
    default: 'Initializing'
  },
  error: {
    type: String,
    default: null
  },
  sourceType: {
    type: String,
    enum: ['file', 'text', 'link', 'topic'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Update updatedAt on save
courseGenerationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

// Auto-delete old pending/processing records after 1 hour
courseGenerationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.model('CourseGeneration', courseGenerationSchema);


