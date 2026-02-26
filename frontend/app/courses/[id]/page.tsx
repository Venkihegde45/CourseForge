'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Circle, MessageSquare, Download } from 'lucide-react'
import { getCourse, FullCourse, updateLessonProgress } from '@/lib/api'
import TutorChat from '@/components/TutorChat'
import QuizComponent from '@/components/QuizComponent'
import ExportMenu from '@/components/ExportMenu'

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  const [course, setCourse] = useState<FullCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner')
  const [showTutor, setShowTutor] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      const data = await getCourse(courseId)
      setCourse(data)
      if (data.modules.length > 0) {
        setSelectedModule(data.modules[0].id)
        if (data.modules[0].lessons.length > 0) {
          setSelectedLesson(data.modules[0].lessons[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = async (lessonId: number) => {
    try {
      await updateLessonProgress(courseId, lessonId, true)
      setCompletedLessons(new Set([...completedLessons, lessonId]))
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const currentModule = course.modules.find(m => m.id === selectedModule)
  const currentLesson = currentModule?.lessons.find(l => l.id === selectedLesson)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600">{course.description}</p>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Modules & Lessons */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.modules.map((module) => (
                  <div key={module.id} className="mb-4">
                    <button
                      onClick={() => {
                        setSelectedModule(module.id)
                        if (module.lessons.length > 0) {
                          setSelectedLesson(module.lessons[0].id)
                        }
                      }}
                      className={`w-full text-left p-2 rounded ${
                        selectedModule === module.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{module.title}</div>
                      {module.description && (
                        <div className="text-sm text-gray-600">{module.description}</div>
                      )}
                    </button>
                    {selectedModule === module.id && (
                      <div className="ml-4 mt-2 space-y-1">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className={`w-full text-left p-2 rounded flex items-center gap-2 ${
                              selectedLesson === lesson.id
                                ? 'bg-primary-100 text-primary-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {completedLessons.has(lesson.id) ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm">{lesson.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {currentLesson ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* Lesson Header */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentLesson.title}
                  </h2>
                  
                  {/* Explanation Level Selector */}
                  <div className="flex gap-2 mb-4">
                    {['beginner', 'intermediate', 'expert'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setExplanationLevel(level as any)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize ${
                          explanationLevel === level
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="prose max-w-none mb-8">
                  {explanationLevel === 'beginner' && currentLesson.beginner_content && (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {currentLesson.beginner_content}
                    </div>
                  )}
                  {explanationLevel === 'intermediate' && currentLesson.intermediate_content && (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {currentLesson.intermediate_content}
                    </div>
                  )}
                  {explanationLevel === 'expert' && currentLesson.expert_content && (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {currentLesson.expert_content}
                    </div>
                  )}
                </div>

                {/* Examples */}
                {currentLesson.examples && currentLesson.examples.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Examples</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {currentLesson.examples.map((example, idx) => (
                        <li key={idx} className="text-gray-700">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                {currentLesson.summary && (
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Summary</h3>
                    <p className="text-gray-700">{currentLesson.summary}</p>
                  </div>
                )}

                {/* Quizzes */}
                {currentLesson.quizzes && currentLesson.quizzes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Practice Questions</h3>
                    {currentLesson.quizzes.map((quiz) => (
                      <QuizComponent
                        key={quiz.id}
                        quiz={quiz}
                        courseId={courseId}
                      />
                    ))}
                  </div>
                )}

                {/* Complete Button */}
                <button
                  onClick={() => handleLessonComplete(currentLesson.id)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Mark as Complete
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                Select a lesson to begin
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-6 h-6" />
            </button>
            {showExport && (
              <div className="absolute bottom-full right-0 mb-2">
                <ExportMenu courseId={courseId} />
              </div>
            )}
          </div>
          <button
            onClick={() => setShowTutor(!showTutor)}
            className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>

        {/* Tutor Chat Panel */}
        {showTutor && (
          <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
            <TutorChat courseId={courseId} onClose={() => setShowTutor(false)} />
          </div>
        )}
      </div>
    </main>
  )
}

