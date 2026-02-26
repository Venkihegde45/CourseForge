import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, LogOut, User, Plus, Clock, TrendingUp, 
  ChevronRight, Loader2, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCourses();
  }, [user, navigate]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/course`);
      const courses = response.data.data || response.data;
      setCourses(Array.isArray(courses) ? courses : []);
      setError('');
    } catch (error) {
      console.error('Failed to load courses:', error);
      setError(error.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8 border-b border-dark-border">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-red via-pink-500 to-purple-500 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {user.name || user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border hover:border-neon-red transition-all text-gray-300 hover:text-white flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span>New Course</span>
          </motion.button>
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-dark-card border border-dark-border hover:border-red-500 transition-all text-gray-300 hover:text-red-400 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-white">{courses.length}</p>
              </div>
              <div className="p-3 bg-neon-red/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-neon-red" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Account</p>
                <p className="text-lg font-semibold text-white">{user.email}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Member Since</p>
                <p className="text-lg font-semibold text-white">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Courses List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-neon-red" />
              My Courses
            </h2>
            <button
              onClick={() => navigate('/')}
              className="text-neon-red hover:text-pink-500 transition-colors flex items-center gap-1 text-sm"
            >
              Create New
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-neon-red animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-12 border border-dark-border text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
              <p className="text-gray-400 mb-6">Start creating your first course!</p>
              <motion.button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-neon-red to-pink-500 text-white font-semibold rounded-lg hover:shadow-neon-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Course
              </motion.button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => (
                <motion.div
                  key={course._id || idx}
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="bg-dark-card/50 backdrop-blur-sm p-6 rounded-xl border border-dark-border hover:border-neon-red/50 cursor-pointer transition-all group"
                  whileHover={{ scale: 1.02, y: -3 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-neon-red/20 rounded-lg group-hover:bg-neon-red/30 transition-colors">
                      <BookOpen className="w-6 h-6 text-neon-red" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2 group-hover:text-neon-red transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
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
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

