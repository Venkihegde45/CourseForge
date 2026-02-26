'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, BookOpen, Brain, Zap } from 'lucide-react'
import UploadInterface from '@/components/UploadInterface'
import CourseList from '@/components/CourseList'

export default function Home() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            CourseForge
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Upload anything → Automatically convert it into a complete interactive learning course using AI
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Create New Course
            </button>
            <Link
              href="/courses"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-primary-600 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Link>
          </div>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Upload className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiple Input Formats</h3>
            <p className="text-gray-600">
              Upload text, PDFs, images, audio, video, links, or scanned documents
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Brain className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Automatically creates structured courses with lessons, quizzes, and flashcards
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Zap className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Multi-level explanations, practice quizzes, and a personal AI tutor
            </p>
          </div>
        </section>

        {/* Upload Interface */}
        {showUpload && (
          <div className="mb-8">
            <UploadInterface onClose={() => setShowUpload(false)} />
          </div>
        )}

        {/* Recent Courses */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Courses</h2>
          <CourseList />
        </section>
      </div>
    </main>
  )
}






