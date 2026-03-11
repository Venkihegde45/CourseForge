import mongoose from 'mongoose';

// Topic Schema - Contains 3 explanation levels
const topicSchema = new mongoose.Schema({
  topicTitle: { type: String, required: true },
  beginner: { type: String, default: '' },
  intermediate: { type: String, default: '' },
  expert: { type: String, default: '' },
  examples: [{ type: String }],
  analogies: [{ type: String }],
  summary: { type: String, default: '' },
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  }]
});

// Module Schema - Contains only topics (no lessons)
const moduleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  moduleDescription: { type: String, default: '' },
  topics: [topicSchema],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  }]
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  modules: [moduleSchema],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  }],
  summary: { type: String, default: '' },
  sourceFile: { type: String, default: '' },
  sourceType: { type: String, default: 'text' },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
