import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import QuizCard from '@/components/molecules/QuizCard'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { fetchQuizzes, setSelectedCategory, setSelectedDifficulty } from '@/store/slices/quizSlice'

const QuizzesPage = () => {
  const dispatch = useDispatch()
  const { 
    quizzes, 
    selectedCategory, 
    selectedDifficulty, 
    loading, 
    error 
  } = useSelector(state => state.quiz)

  const { categories } = useSelector(state => state.feed)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  useEffect(() => {
    const filters = {}
    if (selectedCategory !== 'all') filters.category = selectedCategory
    if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty
    
    dispatch(fetchQuizzes(filters))
  }, [selectedCategory, selectedDifficulty, dispatch])

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category))
  }

  const handleDifficultyChange = (difficulty) => {
    dispatch(setSelectedDifficulty(difficulty))
  }

  if (loading && quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-surface-600">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load quizzes</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchQuizzes())}>
            <ApperIcon name="RefreshCw" size={16} />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-secondary-100 rounded-lg">
            <ApperIcon name="Brain" size={24} className="text-secondary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">
              Knowledge Quizzes
            </h1>
            <p className="text-surface-600">
              Test your understanding and earn points
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <Badge variant="info" className="flex items-center gap-1">
            <ApperIcon name="Target" size={14} />
            {quizzes.length} Available
          </Badge>
          <Badge variant="success" className="flex items-center gap-1">
            <ApperIcon name="Award" size={14} />
            70% to Pass
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-surface-700 mb-3">Filter by Topic</h3>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-surface-700 mb-3">Difficulty Level</h3>
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleDifficultyChange(difficulty)}
              >
                <ApperIcon 
                  name={
                    difficulty === 'beginner' ? 'Star' : 
                    difficulty === 'intermediate' ? 'Stars' : 
                    difficulty === 'advanced' ? 'Zap' : 'Grid3x3'
                  } 
                  size={16} 
                />
                {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <QuizCard quiz={quiz} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="Brain" size={48} className="text-surface-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-surface-600 mb-4">
            Try adjusting your filters to find quizzes that match your interests.
          </p>
          <Button 
            variant="secondary" 
            onClick={() => {
              dispatch(setSelectedCategory('all'))
              dispatch(setSelectedDifficulty('all'))
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {loading && quizzes.length > 0 && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default QuizzesPage