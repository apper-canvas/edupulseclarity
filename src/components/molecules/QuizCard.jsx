import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const QuizCard = ({ quiz, className = '' }) => {
  const navigate = useNavigate()

  const categoryIcons = {
    'Health': 'Heart',
    'Agriculture': 'Sprout',
    'Technology': 'Cpu',
    'Education': 'GraduationCap',
    'Science': 'Microscope',
    'Business': 'Briefcase',
    'Environment': 'Leaf'
  }

  const difficultyColors = {
    'beginner': 'success',
    'intermediate': 'warning',
    'advanced': 'error'
  }

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.Id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <ApperIcon 
              name={categoryIcons[quiz.category] || 'Brain'} 
              size={20} 
              className="text-secondary-600"
            />
          </div>
          <div>
            <Badge variant="default" className="mb-1">
              {quiz.category}
            </Badge>
            <Badge 
              variant={difficultyColors[quiz.difficulty]} 
              size="xs"
            >
              {quiz.difficulty}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-surface-400">
          <ApperIcon name="Clock" size={16} />
          <span className="text-xs">{quiz.timeLimit / 60}m</span>
        </div>
      </div>

      <h3 className="font-display font-semibold text-lg text-surface-900 mb-2">
        {quiz.title}
      </h3>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-surface-600">
        <div className="flex items-center gap-1">
          <ApperIcon name="HelpCircle" size={16} />
          <span>{quiz.questions.length} questions</span>
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="Target" size={16} />
          <span>70% to pass</span>
        </div>
      </div>

      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleStartQuiz}
        className="w-full"
      >
        <ApperIcon name="Play" size={16} />
        Start Quiz
      </Button>
    </motion.div>
  )
}

export default QuizCard