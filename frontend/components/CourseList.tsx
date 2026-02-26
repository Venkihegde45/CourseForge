'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Calendar } from 'lucide-react'
import { getCourses, Course } from '@/lib/api'

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No courses yet. Create your first course!
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/courses/${course.id}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {course.created_at
                    ? new Date(course.created_at).toLocaleDateString()
                    : 'Recently'}
                </span>
                {course.module_count !== undefined && (
                  <span>{course.module_count} modules</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}






