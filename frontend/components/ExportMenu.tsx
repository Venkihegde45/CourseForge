'use client'

import { useState } from 'react'
import { Download, FileText, BookOpen, FileJson } from 'lucide-react'

interface ExportMenuProps {
  courseId: number
}

export default function ExportMenu({ courseId }: ExportMenuProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleExport = async (type: string, format?: string) => {
    setLoading(type)
    try {
      const url = format
        ? `/api/v1/courses/${courseId}/export/${type}?format=${format}`
        : `/api/v1/courses/${courseId}/export/${type}`
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`
      )
      
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `course_${courseId}_${type}`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) filename = filenameMatch[1]
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
      <h3 className="font-semibold mb-4 text-gray-900">Export Course</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleExport('summary')}
          disabled={loading !== null}
          className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-lg disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>Summary (TXT)</span>
        </button>
        <button
          onClick={() => handleExport('notes')}
          disabled={loading !== null}
          className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-lg disabled:opacity-50"
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes (Markdown)</span>
        </button>
        <button
          onClick={() => handleExport('flashcards', 'json')}
          disabled={loading !== null}
          className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-lg disabled:opacity-50"
        >
          <FileJson className="w-4 h-4" />
          <span>Flashcards (JSON)</span>
        </button>
        <button
          onClick={() => handleExport('flashcards', 'csv')}
          disabled={loading !== null}
          className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-lg disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Flashcards (CSV)</span>
        </button>
      </div>
      {loading && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Exporting {loading}...
        </div>
      )}
    </div>
  )
}






