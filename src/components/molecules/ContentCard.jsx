import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { incrementCompleted, addPoints } from '@/store/slices/userSlice'
import { toast } from 'react-toastify'

const ContentCard = ({ content, className = '' }) => {
  const dispatch = useDispatch()

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

  const handleEngagement = async () => {
    try {
      await dispatch(incrementCompleted()).unwrap()
      await dispatch(addPoints(10)).unwrap()
      toast.success('Great job! +10 points earned')
    } catch (error) {
      toast.error('Failed to update progress')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <ApperIcon 
              name={categoryIcons[content.category] || 'FileText'} 
              size={20} 
              className="text-primary-600"
            />
          </div>
          <div>
            <Badge variant="default" className="mb-1">
              {content.category}
            </Badge>
            <div className="flex items-center gap-2">
              <Badge 
                variant={difficultyColors[content.difficulty]} 
                size="xs"
              >
                {content.difficulty}
              </Badge>
              <span className="text-xs text-surface-500">
                {content.readTime} min read
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-surface-400">
          <ApperIcon name={content.type === 'video' ? 'Video' : 'FileText'} size={16} />
        </div>
      </div>

      <h3 className="font-display font-semibold text-lg text-surface-900 mb-2 line-clamp-2">
        {content.title}
      </h3>
      
      <p className="text-surface-600 mb-4 line-clamp-3">
        {content.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-surface-500">
          {format(new Date(content.createdAt), 'MMM d, yyyy')}
        </span>
        
        <div className="flex items-center gap-2">
          {content.type === 'video' && (
            <Button variant="ghost" size="sm">
              <ApperIcon name="Play" size={16} />
              Watch
            </Button>
          )}
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleEngagement}
          >
            <ApperIcon name="BookOpen" size={16} />
            {content.type === 'video' ? 'Watch' : 'Read'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ContentCard