/**
 * API client for CourseForge backend
 */
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Course {
  id: number
  title: string
  description?: string
  source_type?: string
  created_at?: string
  module_count?: number
}

export interface Lesson {
  id: number
  title: string
  order: number
  beginner_content?: string
  intermediate_content?: string
  expert_content?: string
  examples?: string[]
  analogies?: string[]
  diagrams?: any[]
  summary?: string
  coding_tasks?: string[]
  quizzes?: Quiz[]
}

export interface Module {
  id: number
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export interface Quiz {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export interface Flashcard {
  id: number
  front: string
  back: string
}

export interface FullCourse {
  id: number
  title: string
  description?: string
  source_type?: string
  table_of_contents?: any[]
  modules: Module[]
  flashcards: Flashcard[]
  created_at?: string
}

// Upload API
export const uploadFile = async (file: File): Promise<{ course_id: number; title: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const uploadText = async (text: string): Promise<{ course_id: number; title: string }> => {
  const formData = new FormData()
  formData.append('text', text)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const uploadLink = async (url: string): Promise<{ course_id: number; title: string }> => {
  const formData = new FormData()
  formData.append('link', url)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// Courses API
export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get('/courses')
  return response.data.courses
}

export const getCourse = async (courseId: number): Promise<FullCourse> => {
  const response = await api.get(`/courses/${courseId}`)
  return response.data
}

export const getFlashcards = async (courseId: number): Promise<Flashcard[]> => {
  const response = await api.get(`/courses/${courseId}/flashcards`)
  return response.data.flashcards
}

// Tutor API
export const chatWithTutor = async (
  courseId: number,
  message: string,
  userId: string = 'default'
): Promise<{ response: string; conversation_id: number }> => {
  const response = await api.post(`/tutor/${courseId}/chat`, {
    message,
    user_id: userId,
  })
  return response.data
}

export const getConversation = async (
  courseId: number,
  userId: string = 'default'
): Promise<{ messages: any[] }> => {
  const response = await api.get(`/tutor/${courseId}/conversation`, {
    params: { user_id: userId },
  })
  return response.data
}

// Progress API
export const getProgress = async (
  courseId: number,
  userId: string = 'default'
): Promise<any> => {
  const response = await api.get(`/progress/${courseId}`, {
    params: { user_id: userId },
  })
  return response.data
}

export const updateLessonProgress = async (
  courseId: number,
  lessonId: number,
  completed: boolean,
  userId: string = 'default'
): Promise<any> => {
  const response = await api.post(`/progress/${courseId}/lesson`, {
    lesson_id: lessonId,
    completed,
    user_id: userId,
  })
  return response.data
}

export const updateQuizScore = async (
  courseId: number,
  quizId: number,
  score: number,
  userId: string = 'default'
): Promise<any> => {
  const response = await api.post(`/progress/${courseId}/quiz`, {
    quiz_id: quizId,
    score,
    user_id: userId,
  })
  return response.data
}






