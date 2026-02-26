'use client'

import { useState } from 'react'
import { Upload, X, FileText, Link as LinkIcon, Type } from 'lucide-react'
import { uploadFile, uploadText, uploadLink } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface UploadInterfaceProps {
  onClose: () => void
}

export default function UploadInterface({ onClose }: UploadInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'link'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result
      if (activeTab === 'file' && file) {
        result = await uploadFile(file)
      } else if (activeTab === 'text' && text.trim()) {
        result = await uploadText(text)
      } else if (activeTab === 'link' && link.trim()) {
        result = await uploadLink(link)
      } else {
        setError('Please provide input')
        setLoading(false)
        return
      }

      // Redirect to course page
      router.push(`/courses/${result.course_id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'file'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          File Upload
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'text'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Type className="w-4 h-4 inline mr-2" />
          Text Input
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'link'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-2" />
          URL
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {activeTab === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (PDF, Image, Audio, Video)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.jpg,.jpeg,.png,.mp3,.mp4,.wav"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste or type your content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your content here..."
            />
          </div>
        )}

        {activeTab === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/article"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating Course...' : 'Generate Course'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}






