import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, User, Sparkles, FileText, Image, Video, Link as LinkIcon, 
  Type, Zap, BookOpen, TrendingUp, Clock, Star, ChevronRight,
  X, File, Loader2, Lightbulb, Globe, Code, Music, FileCheck, LogIn, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UploadBox from '../components/UploadBox';
import LoadingAnimation from '../components/LoadingAnimation';
import ProgressTracker from '../components/ProgressTracker';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function HomePage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // upload, topic, url
  const [topicInput, setTopicInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [recentCourses, setRecentCourses] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [error, setError] = useState('');
  const [generationProgress, setGenerationProgress] = useState(null);
  const [progressInterval, setProgressInterval] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadRecentCourses();
    loadSuggestedTopics();
  }, []);

  const loadRecentCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/course`);
      const courses = response.data.data || response.data;
      setRecentCourses(Array.isArray(courses) ? courses.slice(0, 6) : []);
    } catch (error) {
      console.error('Failed to load recent courses:', error);
    }
  };

  const loadSuggestedTopics = () => {
    // Suggested topics for quick start
    setSuggestedTopics([
      'Python Programming Basics',
      'Machine Learning Fundamentals',
      'Web Development with React',
      'Data Structures and Algorithms',
      'JavaScript Advanced Concepts',
      'Database Design Principles'
    ]);
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setActiveTab('upload');
    }
  };

  const checkGenerationProgress = async (generationId) => {
    try {
      const response = await axios.get(`${API_URL}/api/generation/${generationId}`);
      const status = response.data.data;
      
      setGenerationProgress({
        progress: status.progress || 0,
        stage: status.stage || 'Processing...',
        status: status.status || 'processing'
      });

      if (status.status === 'completed' && status.courseId) {
        if (progressInterval) {
          clearInterval(progressInterval);
          setProgressInterval(null);
        }
        setIsAnalyzing(false);
        setGenerationProgress(null);
        navigate(`/course/${status.courseId}`);
      } else if (status.status === 'failed') {
        if (progressInterval) {
          clearInterval(progressInterval);
          setProgressInterval(null);
        }
        setIsAnalyzing(false);
        setError(status.error || 'Course generation failed');
        setGenerationProgress(null);
        setTimeout(() => setError(''), 10000);
      }
    } catch (error) {
      console.error('Progress check error:', error);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    setGenerationProgress({
      progress: 0,
      stage: 'Initializing...',
      status: 'pending'
    });

    try {
      let result;

      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        result = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (activeTab === 'topic' && topicInput.trim()) {
        // Generate course from topic
        const formData = new FormData();
        formData.append('text', topicInput);
        result = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (activeTab === 'url' && urlInput.trim()) {
        const formData = new FormData();
        formData.append('link', urlInput);
        result = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        setError('Please provide input (file, topic, or URL)');
        setIsAnalyzing(false);
        setGenerationProgress(null);
        setTimeout(() => setError(''), 5000);
        return;
      }

      if (result.data.success) {
        const generationId = result.data.data?.generationId;
        
        if (generationId) {
          // Start polling for progress
          const interval = setInterval(() => {
            checkGenerationProgress(generationId);
          }, 2000); // Check every 2 seconds
          setProgressInterval(interval);
        } else {
          // Fallback: navigate directly if no generation ID
          navigate(`/course/${result.data.data.courseId}`);
        }
      } else {
        setError(result.data.message || result.data.error || 'Failed to generate course');
        setIsAnalyzing(false);
        setGenerationProgress(null);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to analyze. Please try again.';
      setError(errorMessage);
      setIsAnalyzing(false);
      setGenerationProgress(null);
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
      setTimeout(() => setError(''), 10000);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const handleSuggestedTopic = (topic) => {
    setTopicInput(topic);
    setActiveTab('topic');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-red rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-neon-red/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-red via-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-neon-red" />
            CourseForge
          </h1>
          <p className="text-gray-400 text-sm mt-1">AI-Powered Course Generator</p>
        </motion.div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-card border border-dark-border hover:border-neon-red transition-all text-gray-300 hover:text-white"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>
              <motion.div
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center cursor-pointer hover:border-neon-red transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={user?.email}
              >
                <User className="w-5 h-5 text-neon-red" />
              </motion.div>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border hover:border-neon-red transition-all text-gray-300 hover:text-white flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Sign In</span>
              </motion.button>
            </>
          )}
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12">
        {isAnalyzing ? (
          <div className="w-full max-w-2xl">
            {generationProgress ? (
              <ProgressTracker
                progress={generationProgress.progress}
                stage={generationProgress.stage}
                status={generationProgress.status}
                error={error}
              />
            ) : (
              <LoadingAnimation />
            )}
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <motion.div
              className="text-center mb-12 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Transform Anything Into
                <br />
                <span className="bg-gradient-to-r from-neon-red via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Interactive Courses
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Upload files, enter topics, or paste URLs. Our AI creates comprehensive, structured learning courses instantly.
              </p>
            </motion.div>

            {/* Input Tabs */}
            <motion.div
              className="w-full max-w-4xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex gap-2 mb-6 justify-center flex-wrap">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white shadow-neon-lg'
                      : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload File
                </button>
                <button
                  onClick={() => setActiveTab('topic')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'topic'
                      ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white shadow-neon-lg'
                      : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                  Enter Topic
                </button>
                <button
                  onClick={() => setActiveTab('url')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'url'
                      ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white shadow-neon-lg'
                      : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
                  }`}
                >
                  <LinkIcon className="w-5 h-5" />
                  Paste URL
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <UploadBox
                    file={file}
                    onFileSelect={handleFileSelect}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    fileInputRef={fileInputRef}
                  />
                  <div className="mt-4 flex flex-wrap gap-3 justify-center">
                    <div className="flex items-center gap-2 px-3 py-2 bg-dark-card/50 rounded-lg border border-dark-border">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">PDF</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-dark-card/50 rounded-lg border border-dark-border">
                      <Image className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-400">Images</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-dark-card/50 rounded-lg border border-dark-border">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">Word Docs</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-dark-card/50 rounded-lg border border-dark-border">
                      <Video className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-gray-400">Video</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-dark-card/50 rounded-lg border border-dark-border">
                      <Music className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400">Audio</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Topic Tab */}
              {activeTab === 'topic' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-dark-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-neon-red/20 to-pink-500/20 rounded-lg">
                        <Lightbulb className="w-6 h-6 text-neon-red" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Enter a Topic</h3>
                        <p className="text-sm text-gray-400">Type any topic and AI will create a comprehensive course</p>
                      </div>
                    </div>
                    <textarea
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g., Python Programming, Machine Learning, Web Development, Data Structures..."
                      className="w-full h-32 bg-dark-bg border-2 border-dark-border rounded-xl p-4 text-white placeholder-gray-500 focus:border-neon-red focus:outline-none resize-none"
                    />
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      <span>{topicInput.length} characters</span>
                      <span>AI will analyze and generate course</span>
                    </div>
                  </div>

                  {/* Suggested Topics */}
                  {suggestedTopics.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Quick Start Topics
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map((topic, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleSuggestedTopic(topic)}
                            className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-300 hover:border-neon-red hover:text-white transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {topic}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* URL Tab */}
              {activeTab === 'url' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-dark-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <LinkIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Paste URL</h3>
                      <p className="text-sm text-gray-400">Extract content from any webpage</p>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/article or https://wikipedia.org/wiki/..."
                    className="w-full bg-dark-bg border-2 border-dark-border rounded-xl p-4 text-white placeholder-gray-500 focus:border-neon-red focus:outline-none"
                  />
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span>Supports: Articles, Wikipedia, Documentation, Blog Posts</span>
                  </div>
                </motion.div>
              )}

              {/* Analyze Button */}
              <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={handleAnalyze}
                  disabled={
                    (activeTab === 'upload' && !file) ||
                    (activeTab === 'topic' && !topicInput.trim()) ||
                    (activeTab === 'url' && !urlInput.trim())
                  }
                  className={`px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                    (activeTab === 'upload' && file) ||
                    (activeTab === 'topic' && topicInput.trim()) ||
                    (activeTab === 'url' && urlInput.trim())
                      ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white shadow-neon-lg hover:shadow-neon cursor-pointer'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={
                    (activeTab === 'upload' && file) ||
                    (activeTab === 'topic' && topicInput.trim()) ||
                    (activeTab === 'url' && urlInput.trim())
                      ? { scale: 1.05, y: -2 }
                      : {}
                  }
                  whileTap={
                    (activeTab === 'upload' && file) ||
                    (activeTab === 'topic' && topicInput.trim()) ||
                    (activeTab === 'url' && urlInput.trim())
                      ? { scale: 0.95 }
                      : {}
                  }
                >
                  <Sparkles className="w-6 h-6" />
                  <span>Analyze & Generate Course</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Status Message */}
              {file && activeTab === 'upload' && (
                <motion.p
                  className="mt-4 text-center text-gray-400 text-sm flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FileCheck className="w-4 h-4 text-green-400" />
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </motion.p>
              )}
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-12 w-full max-w-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border hover:border-neon-red/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="p-3 bg-neon-red/20 rounded-lg w-fit mb-4">
                  <Zap className="w-6 h-6 text-neon-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered</h3>
                <p className="text-gray-400 text-sm">
                  Advanced AI analyzes your content and creates structured courses with multiple explanation levels
                </p>
              </motion.div>

              <motion.div
                className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border hover:border-neon-red/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Multi-Format</h3>
                <p className="text-gray-400 text-sm">
                  Support for PDFs, images, documents, videos, URLs, and even just topic names
                </p>
              </motion.div>

              <motion.div
                className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border hover:border-neon-red/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Interactive</h3>
                <p className="text-gray-400 text-sm">
                  Quizzes, flashcards, AI tutor, and progress tracking for complete learning experience
                </p>
              </motion.div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="w-full max-w-4xl mb-6 bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Auth Banner for Guests */}
            {!isAuthenticated && (
              <motion.div
                className="w-full max-w-4xl mb-8 bg-gradient-to-r from-neon-red/10 to-pink-500/10 border-2 border-neon-red/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Sign up to save your courses
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Create an account to access your course history and save your progress
                    </p>
                  </div>
                  <motion.button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-3 bg-gradient-to-r from-neon-red to-pink-500 text-white font-semibold rounded-lg hover:shadow-neon-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up Free
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Recent Courses */}
            {recentCourses.length > 0 && (
              <motion.div
                className="w-full max-w-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-6 h-6 text-neon-red" />
                    Recent Courses
                  </h3>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-neon-red hover:text-pink-500 transition-colors flex items-center gap-1 text-sm"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {recentCourses.map((course, idx) => (
                    <motion.div
                      key={course._id || idx}
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="bg-dark-card/50 backdrop-blur-sm p-5 rounded-xl border border-dark-border hover:border-neon-red/50 cursor-pointer transition-all group"
                      whileHover={{ scale: 1.02, y: -3 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-neon-red/20 rounded-lg group-hover:bg-neon-red/30 transition-colors">
                          <BookOpen className="w-5 h-5 text-neon-red" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1 group-hover:text-neon-red transition-colors line-clamp-2">
                            {course.title}
                          </h4>
                          {course.description && (
                            <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                              {course.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {course.createdAt
                                ? new Date(course.createdAt).toLocaleDateString()
                                : 'Recently'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;
