import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Search, Filter } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function CoursesListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/course`);
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-red mx-auto mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      <div className="container mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neon-red hover:text-pink-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-red to-pink-500 bg-clip-text text-transparent">
            All Courses
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:border-neon-red focus:outline-none"
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
            <p className="text-gray-400 text-lg">
              {searchQuery ? 'No courses found matching your search' : 'No courses yet. Create your first course!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course._id || idx}
                onClick={() => navigate(`/course/${course._id}`)}
                className="bg-dark-card/80 backdrop-blur-sm rounded-xl p-6 border border-dark-border hover:border-neon-red/50 cursor-pointer transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-neon-red/20 rounded-lg group-hover:bg-neon-red/30 transition-colors">
                    <BookOpen className="w-6 h-6 text-neon-red" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-red transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {course.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {course.createdAt
                        ? new Date(course.createdAt).toLocaleDateString()
                        : 'Recently'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesListPage;






