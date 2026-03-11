import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, BookOpen, GraduationCap, Award, Sparkles, CheckCircle2, MessageCircle, Brain, Zap, Target, ChevronDown, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import ChatBot from '../components/ChatBot';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [analysisLevel, setAnalysisLevel] = useState('beginner');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState('easy');
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [completedTopics, setCompletedTopics] = useState(new Set());

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course && course.modules?.length > 0) {
      const firstModule = course.modules[0];
      setSelectedModule(firstModule);
      setExpandedModules(new Set([firstModule._id || 0]));
      if (firstModule.topics?.length > 0) {
        setSelectedTopic(firstModule.topics[0]);
      }
    }
  }, [course]);

  const [error, setError] = useState('');

  const fetchCourse = async () => {
    try {
      setError('');
      const response = await axios.get(`${API_URL}/api/course/${id}`);
      setCourse(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to load course. Please try again.';
      setError(errorMessage);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    if (module.topics?.length > 0) {
      setSelectedTopic(module.topics[0]);
    } else {
      setSelectedTopic(null);
    }
    setShowQuiz(false);
    
    // Toggle module expansion
    const moduleId = module._id || module.moduleTitle;
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setShowQuiz(false);
  };

  const toggleComplete = (moduleId, topicId) => {
    const key = `${moduleId}-${topicId}`;
    setCompletedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getCurrentContent = () => {
    if (selectedTopic) {
      const content = selectedTopic[analysisLevel] || selectedTopic.beginner || '';
      return content;
    }
    return '';
  };

  const getCurrentExamples = () => {
    if (selectedTopic) return selectedTopic.examples || [];
    return [];
  };

  const getCurrentAnalogies = () => {
    if (selectedTopic) return selectedTopic.analogies || [];
    return [];
  };

  const getCurrentSummary = () => {
    if (selectedTopic) return selectedTopic.summary || '';
    return '';
  };

  const getQuizQuestions = () => {
    if (!selectedModule) return [];
    
    let questions = [];
    
    // Get module-level questions
    if (selectedModule.quiz) {
      questions = [...questions, ...selectedModule.quiz];
    }
    
    // Get topic-level questions
    selectedModule.topics?.forEach(topic => {
      if (topic.quiz) {
        questions = [...questions, ...topic.quiz];
      }
    });

    // Normalize question format (support both old and new format)
    questions = questions.map(q => ({
      ...q,
      questionText: q.questionText || q.question || 'Question',
      type: q.type || 'mcq', // Default to mcq if type not specified
      difficulty: q.difficulty || 'Beginner'
    }));

    // Filter by difficulty (case-insensitive)
    if (quizDifficulty !== 'all') {
      questions = questions.filter(q => 
        q.difficulty?.toLowerCase() === quizDifficulty.toLowerCase() ||
        (quizDifficulty === 'easy' && q.difficulty?.toLowerCase() === 'beginner') ||
        (quizDifficulty === 'medium' && q.difficulty?.toLowerCase() === 'intermediate') ||
        (quizDifficulty === 'hard' && q.difficulty?.toLowerCase() === 'expert')
      );
    }

    return questions.slice(0, 20); // Increased from 15 to 20
  };

  const addMoreQuestions = async () => {
    alert('More questions will be generated based on the current content. This feature will be implemented with AI.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-neon-red animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center p-4">
        <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/50 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Course</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-neon-red to-pink-500 text-white font-semibold rounded-lg hover:shadow-neon-lg transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-neon-red border-t-transparent rounded-full"
          />
          <p className="text-gray-400 text-lg">Loading your course...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const totalTopics = course.modules?.reduce((acc, module) => acc + (module.topics?.length || 0), 0) || 0;
  const completedCount = completedTopics.size;
  const progress = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg text-white flex">
      {/* Left Sidebar - Navigation */}
      <aside className="w-80 bg-dark-card/50 backdrop-blur-sm border-r border-dark-border flex flex-col h-screen sticky top-0 overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-border hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-red to-pink-500 bg-clip-text text-transparent line-clamp-2 mb-2">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-gray-400 text-xs mb-4 line-clamp-2">{course.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <GraduationCap className="w-4 h-4" />
            <span>{completedCount}/{totalTopics} Topics</span>
          </div>
          <div className="mt-2 h-2 bg-dark-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-red to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {course.modules?.map((module, mIdx) => {
              const moduleId = module._id || mIdx;
              const isSelected = selectedModule?._id === module._id || selectedModule?.moduleTitle === module.moduleTitle;
              const isExpanded = expandedModules.has(moduleId);
              
              return (
                <div key={moduleId} className="space-y-1">
                  <button
                    onClick={() => handleModuleSelect(module)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-neon-red/20 border border-neon-red text-white'
                        : 'bg-dark-border/50 hover:bg-dark-border text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-neon-red text-white' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {mIdx + 1}
                      </div>
                      <span className="font-semibold flex-1 text-sm">{module.moduleTitle}</span>
                    </div>
                    {module.topics?.length > 0 && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    )}
                  </button>

                  {/* Topics under module */}
                  {isExpanded && module.topics?.map((topic, tIdx) => {
                    const topicId = topic._id || tIdx;
                    const isTopicSelected = selectedTopic?._id === topic._id || selectedTopic?.topicTitle === topic.topicTitle;
                    const topicKey = `${moduleId}-${topicId}`;
                    const isCompleted = completedTopics.has(topicKey);
                    
                    return (
                      <button
                        key={topicId}
                        onClick={() => handleTopicSelect(topic)}
                        className={`w-full text-left p-2.5 rounded-lg transition-all ml-6 flex items-center gap-2 text-sm ${
                          isTopicSelected
                            ? 'bg-purple-500/20 border border-purple-500/50 text-white font-medium'
                            : 'bg-dark-bg/50 hover:bg-dark-bg text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isCompleted ? 'text-green-400' : 'text-gray-600'}`} />
                        <span className="flex-1 text-left">{topic.topicTitle}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-dark-card/50 backdrop-blur-sm border-b border-dark-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {selectedTopic && (
                  <>
                    <h2 className="text-2xl font-bold text-white">{selectedTopic.topicTitle}</h2>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold">
                      Topic
                    </span>
                  </>
                )}
                {selectedModule && !selectedTopic && (
                  <h2 className="text-2xl font-bold text-white">{selectedModule.moduleTitle}</h2>
                )}
              </div>
              {selectedModule && selectedTopic && (
                <p className="text-gray-500 text-xs mt-1">Module: {selectedModule.moduleTitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Analysis Level Selector */}
              <div className="flex gap-2 bg-dark-border rounded-lg p-1">
                {['beginner', 'intermediate', 'expert'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setAnalysisLevel(level)}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                      analysisLevel === level
                        ? 'bg-gradient-to-r from-neon-red to-pink-500 text-white shadow-neon'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Quiz Button */}
              <button
                onClick={() => {
                  setShowQuiz(!showQuiz);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  showQuiz
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-dark-border hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Target className="w-4 h-4" />
                Quiz
              </button>

              {/* Complete Button */}
              {selectedTopic && (
                <button
                  onClick={() => {
                    const moduleId = selectedModule._id || selectedModule.moduleTitle;
                    const topicId = selectedTopic._id || selectedTopic.topicTitle;
                    toggleComplete(moduleId, topicId);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    completedTopics.has(`${selectedModule._id || selectedModule.moduleTitle}-${selectedTopic._id || selectedTopic.topicTitle}`)
                      ? 'bg-green-500 text-white'
                      : 'bg-dark-border hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </button>
              )}

              <button
                onClick={() => {
                  if (!course) return;
                  let content = `# ${course.title}\n\n`;
                  if (course.description) {
                    content += `${course.description}\n\n`;
                  }
                  course.modules?.forEach((module, mIdx) => {
                    content += `## Module ${mIdx + 1}: ${module.moduleTitle}\n\n`;
                    if (module.moduleDescription) {
                      content += `${module.moduleDescription}\n\n`;
                    }
                    module.topics?.forEach((topic, tIdx) => {
                      content += `### ${topic.topicTitle}\n\n`;
                      const levelContent = topic[analysisLevel] || topic.beginner || '';
                      content += `${levelContent}\n\n`;
                      if (topic.examples?.length > 0) {
                        content += `**Examples:**\n`;
                        topic.examples.forEach((example) => {
                          content += `- ${example}\n`;
                        });
                        content += `\n`;
                      }
                      if (topic.summary) {
                        content += `**Summary:** ${topic.summary}\n\n`;
                      }
                    });
                  });
                  const blob = new Blob([content], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${course.title.replace(/\s+/g, '_')}_course.md`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 rounded-lg bg-neon-red hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {showQuiz ? (
            <QuizSection
              questions={getQuizQuestions()}
              difficulty={quizDifficulty}
              setDifficulty={setQuizDifficulty}
              onAddMore={addMoreQuestions}
            />
          ) : (
            <>
              <ContentSection
                content={getCurrentContent()}
                examples={getCurrentExamples()}
                analogies={getCurrentAnalogies()}
                summary={getCurrentSummary()}
                analysisLevel={analysisLevel}
              />
              
              {/* Integrated Chat Bot at Bottom */}
              <div className="mt-12 max-w-4xl mx-auto">
                <ChatBot
                  course={course}
                  selectedModule={selectedModule}
                  selectedTopic={selectedTopic}
                  analysisLevel={analysisLevel}
                  isIntegrated={true}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Content Section Component
function ContentSection({ content, examples, analogies, summary, analysisLevel }) {
  const getLevelInfo = () => {
    switch(analysisLevel) {
      case 'beginner':
        return {
          icon: '🎯',
          title: 'Beginner Level',
          description: 'Simple, easy-to-understand explanation for complete beginners',
          color: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400'
        };
      case 'intermediate':
        return {
          icon: '📚',
          title: 'Intermediate Level',
          description: 'More detailed explanation with technical context',
          color: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-400'
        };
      case 'expert':
        return {
          icon: '🚀',
          title: 'Expert Level',
          description: 'Advanced, technical, in-depth explanation',
          color: 'from-purple-500/20 to-pink-500/20',
          borderColor: 'border-purple-500/30',
          textColor: 'text-purple-400'
        };
      default:
        return {
          icon: '📖',
          title: 'Content',
          description: '',
          color: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-400'
        };
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Level Badge with Info */}
      <motion.div
        className={`bg-gradient-to-r ${levelInfo.color} rounded-2xl p-4 border ${levelInfo.borderColor}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">{levelInfo.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <Brain className={`w-5 h-5 ${levelInfo.textColor}`} />
              <span className={`font-bold ${levelInfo.textColor}`}>{levelInfo.title}</span>
            </div>
            <p className="text-gray-300 text-sm mt-1">{levelInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      {content && (
        <motion.div
          className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-dark-border shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-200 leading-relaxed text-base md:text-lg">
              {content.split('\n').map((line, idx) => {
                const trimmed = line.trim();
                
                if (trimmed === '') return <br key={idx} />;
                
                if (trimmed.startsWith('⭐')) {
                  return (
                    <h2 key={idx} className="text-2xl md:text-3xl font-bold text-neon-red mb-6 mt-8 first:mt-0 flex items-center gap-2">
                      <span>{trimmed}</span>
                    </h2>
                  );
                }
                
                if (trimmed.match(/^[1-3]️⃣/)) {
                  const levelMatch = trimmed.match(/(Beginner|Intermediate|Expert)/i);
                  const levelColor = levelMatch?.[0]?.toLowerCase() === 'beginner' ? 'text-green-400' :
                                   levelMatch?.[0]?.toLowerCase() === 'intermediate' ? 'text-blue-400' :
                                   'text-purple-400';
                  return (
                    <h3 key={idx} className={`text-xl md:text-2xl font-bold ${levelColor} mb-4 mt-6 flex items-center gap-2`}>
                      <span>{trimmed}</span>
                    </h3>
                  );
                }
                
                if (trimmed.startsWith('•')) {
                  return (
                    <div key={idx} className="ml-6 mb-3 flex items-start gap-3">
                      <span className="text-neon-red font-bold mt-1 flex-shrink-0">•</span>
                      <span className="flex-1">{trimmed.replace(/^•\s*/, '')}</span>
                    </div>
                  );
                }
                
                if (trimmed.startsWith('<?') || trimmed.startsWith('```')) {
                  return (
                    <pre key={idx} className="bg-dark-bg rounded-lg p-4 my-4 overflow-x-auto border border-dark-border">
                      <code className="text-green-400 text-sm">{trimmed}</code>
                    </pre>
                  );
                }
                
                return (
                  <p key={idx} className="mb-4 text-gray-200 leading-8">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Examples */}
      {examples?.length > 0 && (
        <motion.div
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 md:p-8 border border-blue-500/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            Practical Examples
          </h3>
          <div className="space-y-4">
            {examples.map((example, idx) => (
              <motion.div
                key={idx}
                className="bg-dark-bg/50 rounded-xl p-5 border border-blue-500/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-gray-200 leading-relaxed flex-1">{example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analogies */}
      {analogies?.length > 0 && (
        <motion.div
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 md:p-8 border border-purple-500/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-purple-400">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            Helpful Analogies
          </h3>
          <div className="space-y-4">
            {analogies.map((analogy, idx) => (
              <motion.div
                key={idx}
                className="bg-dark-bg/50 rounded-xl p-5 border border-purple-500/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-2xl">💡</div>
                  <p className="text-gray-200 leading-relaxed flex-1 italic">{analogy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {summary && (
        <motion.div
          className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 md:p-8 border border-green-500/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-green-400">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            Key Takeaways
          </h3>
          <div className="bg-dark-bg/50 rounded-xl p-5 border border-green-500/20">
            <p className="text-gray-200 leading-relaxed text-lg">{summary}</p>
          </div>
        </motion.div>
      )}

      {!content && !examples?.length && !analogies?.length && !summary && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select a topic to view content</p>
        </div>
      )}
    </motion.div>
  );
}

// Quiz Section Component
function QuizSection({ questions, difficulty, setDifficulty, onAddMore }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      const qId = q._id || q.id || questions.indexOf(q);
      if (selectedAnswers[qId] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = showResults ? calculateScore() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Quiz Header */}
      <div className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-6 border border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-neon-red" />
            Quiz Questions
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-2 rounded-lg bg-dark-border text-white border border-dark-border"
            >
              <option value="all">All Levels</option>
              <option value="easy">Beginner/Easy</option>
              <option value="medium">Intermediate/Medium</option>
              <option value="hard">Expert/Hard</option>
            </select>
            <button
              onClick={onAddMore}
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-white font-semibold"
            >
              + More Questions
            </button>
          </div>
        </div>
        <p className="text-gray-400">
          {questions.length} questions available • Select difficulty level to filter
        </p>
      </div>

      {/* Score Display */}
      {showResults && score && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Quiz Results</h3>
            <div className="text-5xl font-bold text-green-400 mb-2">{score.percentage}%</div>
            <p className="text-gray-300">
              You got {score.correct} out of {score.total} questions correct
            </p>
          </div>
        </motion.div>
      )}

      {/* Questions */}
      {questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const questionId = q._id || q.id || idx;
            const selectedAnswer = selectedAnswers[questionId];
            const isCorrect = selectedAnswer === q.correctAnswer;
            const showAnswer = showResults;

            return (
              <motion.div
                key={questionId}
                className="bg-dark-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dark-border hover:border-neon-red/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-neon-red to-pink-500 flex items-center justify-center font-bold text-white">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{q.questionText || q.question}</h3>
                      {q.type && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          q.type === 'mcq' ? 'bg-blue-500/20 text-blue-400' :
                          q.type === 'true_false' ? 'bg-purple-500/20 text-purple-400' :
                          q.type === 'code' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {q.type === 'mcq' ? 'MCQ' : q.type === 'true_false' ? 'T/F' : 'CODE'}
                        </span>
                      )}
                      {q.difficulty && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          q.difficulty?.toLowerCase() === 'beginner' || q.difficulty?.toLowerCase() === 'easy' ? 'bg-green-500/20 text-green-400' :
                          q.difficulty?.toLowerCase() === 'intermediate' || q.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {q.difficulty.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3 ml-14">
                  {q.options?.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrectOption = optIdx === q.correctAnswer;
                    const showCorrect = showAnswer && isCorrectOption;
                    const showIncorrect = showAnswer && isSelected && !isCorrectOption;

                    return (
                      <motion.button
                        key={optIdx}
                        onClick={() => !showResults && handleAnswerSelect(questionId, optIdx)}
                        disabled={showResults}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          showCorrect
                            ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500'
                            : showIncorrect
                            ? 'bg-gradient-to-r from-red-900/40 to-pink-900/40 border-2 border-red-500'
                            : isSelected
                            ? 'bg-neon-red/20 border-2 border-neon-red'
                            : 'bg-dark-border hover:bg-gray-700 border-2 border-transparent'
                        }`}
                        whileHover={!showResults ? { x: 5 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            showCorrect
                              ? 'bg-green-500 text-white'
                              : showIncorrect
                              ? 'bg-red-500 text-white'
                              : isSelected
                              ? 'bg-neon-red text-white'
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-gray-200 flex-1">{option}</span>
                          {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                          {showIncorrect && <X className="w-5 h-5 text-red-400" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {showAnswer && q.explanation && (
                  <motion.div
                    className="mt-4 ml-14 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm text-blue-300">
                      <strong className="text-blue-400">💡 Explanation:</strong> {q.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No questions available for this difficulty level</p>
          <button
            onClick={onAddMore}
            className="mt-4 px-6 py-2 rounded-lg bg-neon-red hover:bg-red-600 transition-colors text-white font-semibold"
          >
            Generate Questions
          </button>
        </div>
      )}

      {/* Submit Button */}
      {!showResults && questions.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-red to-pink-500 text-white font-bold text-lg hover:shadow-neon-lg transition-all"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default CoursePage;
