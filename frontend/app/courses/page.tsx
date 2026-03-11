'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import CourseList from '@/components/CourseList'

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Courses</h1>
        <CourseList />
      </div>
    </main>
  )
}






