'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Quiz, updateQuizScore } from '@/lib/api'

interface QuizComponentProps {
  quiz: Quiz
  courseId: number
}

export default function QuizComponent({ quiz, courseId }: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === quiz.correct_answer
    const calculatedScore = isCorrect ? 1.0 : 0.0
    setScore(calculatedScore)
    setShowResult(true)

    // Update score in backend
    try {
      await updateQuizScore(courseId, quiz.id, calculatedScore)
    } catch (error) {
      console.error('Failed to update quiz score:', error)
    }
  }

  const handleReset = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(null)
  }

  return (
    <div className="mb-6 p-6 border border-gray-200 rounded-lg">
      <h4 className="text-lg font-semibold mb-4">{quiz.question}</h4>
      <div className="space-y-2 mb-4">
        {quiz.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx
          const isCorrect = idx === quiz.correct_answer
          const showCorrect = showResult && isCorrect
          const showIncorrect = showResult && isSelected && !isCorrect

          return (
            <button
              key={idx}
              onClick={() => !showResult && setSelectedAnswer(idx)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                showCorrect
                  ? 'border-green-500 bg-green-50'
                  : showIncorrect
                  ? 'border-red-500 bg-red-50'
                  : isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2">
                {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                <span>{option}</span>
              </div>
            </button>
          )
        })}
      </div>

      {showResult && quiz.explanation && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Explanation:</strong> {quiz.explanation}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}






