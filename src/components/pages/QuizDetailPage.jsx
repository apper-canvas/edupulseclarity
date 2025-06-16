import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/atoms/ProgressBar'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { 
  fetchQuizById, 
  startQuiz, 
  setAnswer, 
  setCurrentQuestion, 
  submitQuiz, 
  resetQuiz 
} from '@/store/slices/quizSlice'
import { addPoints } from '@/store/slices/userSlice'
import { toast } from 'react-toastify'

const QuizDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState(null)

  const { 
    currentQuiz, 
    quizResult, 
    currentAnswers, 
    currentQuestion, 
    quizStarted, 
    loading, 
    error 
  } = useSelector(state => state.quiz)

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(parseInt(id)))
    }
    
    return () => {
      dispatch(resetQuiz())
    }
  }, [id, dispatch])

  // Timer effect
  useEffect(() => {
    if (quizStarted && currentQuiz && timeLeft === null) {
      setTimeLeft(currentQuiz.timeLimit)
    }

    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [quizStarted, timeLeft, currentQuiz])

  const handleStartQuiz = () => {
    dispatch(startQuiz())
  }

  const handleAnswerSelect = (answer) => {
    dispatch(setAnswer({ questionIndex: currentQuestion, answer }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      dispatch(setCurrentQuestion(currentQuestion + 1))
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      dispatch(setCurrentQuestion(currentQuestion - 1))
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      const answers = Object.values(currentAnswers)
      const result = await dispatch(submitQuiz({ 
        quizId: currentQuiz.Id, 
        answers 
      })).unwrap()
      
      // Award points based on performance
      const points = result.passed ? result.score * 10 : result.score * 5
      await dispatch(addPoints(points)).unwrap()
      
      toast.success(`Quiz completed! +${points} points earned`)
    } catch (error) {
      toast.error('Failed to submit quiz')
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-surface-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !currentQuiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Quiz not found</h3>
          <p className="text-surface-600 mb-4">The quiz you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/quizzes')}>
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Quizzes
          </Button>
        </div>
      </div>
    )
  }

  // Quiz Results View
  if (quizResult) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            quizResult.passed ? 'bg-success text-white' : 'bg-warning text-white'
          }`}>
            <ApperIcon 
              name={quizResult.passed ? "Trophy" : "Award"} 
              size={48} 
            />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
            {quizResult.passed ? "Congratulations!" : "Good Effort!"}
          </h1>
          <p className="text-surface-600 mb-4">
            You scored {quizResult.score} out of {quizResult.totalQuestions} questions
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge 
              variant={quizResult.passed ? "success" : "warning"}
              className="text-lg px-4 py-2"
            >
              {quizResult.percentage}%
            </Badge>
            <Badge variant="info" className="text-lg px-4 py-2">
              +{quizResult.passed ? quizResult.score * 10 : quizResult.score * 5} points
            </Badge>
          </div>
        </motion.div>

        {/* Detailed Results */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-display font-semibold text-surface-900">
            Review Your Answers
          </h2>
          {quizResult.results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 border-l-4 ${
                result.isCorrect ? 'border-success bg-green-50' : 'border-error bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  result.isCorrect ? 'bg-success text-white' : 'bg-error text-white'
                }`}>
                  <ApperIcon 
                    name={result.isCorrect ? "Check" : "X"} 
                    size={16} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-surface-900 mb-2">
                    Question {index + 1}
                  </h3>
                  <p className="text-surface-700 mb-3">{result.question}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-surface-600">Your answer:</span>
                      <Badge variant={result.isCorrect ? "success" : "error"}>
                        {result.userAnswer}
                      </Badge>
                    </div>
                    {!result.isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-surface-600">Correct answer:</span>
                        <Badge variant="success">
                          {result.correctAnswer}
                        </Badge>
                      </div>
                    )}
                    {result.explanation && (
                      <p className="text-sm text-surface-600 bg-white p-3 rounded-lg">
                        <strong>Explanation:</strong> {result.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/quizzes')}>
            <ApperIcon name="List" size={16} />
            More Quizzes
          </Button>
          <Button variant="primary" onClick={() => dispatch(resetQuiz())}>
            <ApperIcon name="RotateCcw" size={16} />
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  // Quiz Taking View
  if (quizStarted) {
    const currentQ = currentQuiz.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-surface-900">
              {currentQuiz.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-surface-600">
                <ApperIcon name="Clock" size={16} />
                <span className={`font-mono text-lg ${
                  timeLeft < 60 ? 'text-error' : ''
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Badge variant="info">
                {currentQuestion + 1} of {currentQuiz.questions.length}
              </Badge>
            </div>
          </div>
          <ProgressBar value={progress} showLabel />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-6">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    currentAnswers[currentQuestion] === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      currentAnswers[currentQuestion] === option
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-surface-300'
                    }`}>
                      {currentAnswers[currentQuestion] === option && (
                        <ApperIcon name="Check" size={14} className="text-white" />
                      )}
                    </div>
                    <span className="font-medium text-surface-900">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="secondary" 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <ApperIcon name="ChevronLeft" size={16} />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === currentQuiz.questions.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleSubmitQuiz}
                disabled={Object.keys(currentAnswers).length !== currentQuiz.questions.length}
              >
                <ApperIcon name="Check" size={16} />
                Submit Quiz
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleNextQuestion}
                disabled={!currentAnswers[currentQuestion]}
              >
                Next
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Quiz Overview
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-secondary-100 rounded-lg">
              <ApperIcon name="Brain" size={32} className="text-secondary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
                {currentQuiz.title}
              </h1>
              <div className="flex items-center gap-4">
                <Badge variant="default">{currentQuiz.category}</Badge>
                <Badge variant="warning">{currentQuiz.difficulty}</Badge>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/quizzes')}>
            <ApperIcon name="ArrowLeft" size={16} />
            Back
          </Button>
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-surface-50 rounded-lg">
            <ApperIcon name="HelpCircle" size={24} className="text-surface-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-surface-900">
              {currentQuiz.questions.length}
            </div>
            <div className="text-sm text-surface-600">Questions</div>
          </div>
          <div className="text-center p-4 bg-surface-50 rounded-lg">
            <ApperIcon name="Clock" size={24} className="text-surface-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-surface-900">
              {currentQuiz.timeLimit / 60} min
            </div>
            <div className="text-sm text-surface-600">Time Limit</div>
          </div>
          <div className="text-center p-4 bg-surface-50 rounded-lg">
            <ApperIcon name="Target" size={24} className="text-surface-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-surface-900">70%</div>
            <div className="text-sm text-surface-600">Pass Rate</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Instructions</h2>
          <ul className="space-y-2 text-surface-600">
            <li className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              Answer all questions to complete the quiz
            </li>
            <li className="flex items-center gap-2">
              <ApperIcon name="Clock" size={16} className="text-warning" />
              You have {currentQuiz.timeLimit / 60} minutes to complete
            </li>
            <li className="flex items-center gap-2">
              <ApperIcon name="Award" size={16} className="text-info" />
              Score 70% or higher to pass and earn bonus points
            </li>
            <li className="flex items-center gap-2">
              <ApperIcon name="RotateCcw" size={16} className="text-secondary-600" />
              You can retake the quiz if needed
            </li>
          </ul>
        </div>

        {/* Start Quiz */}
        <div className="text-center">
          <Button variant="primary" size="lg" onClick={handleStartQuiz}>
            <ApperIcon name="Play" size={20} />
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizDetailPage