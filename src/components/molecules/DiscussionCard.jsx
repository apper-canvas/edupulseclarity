import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const DiscussionCard = ({ discussion, className = '' }) => {
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

  const handleClick = () => {
    navigate(`/discussion/${discussion.Id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className={`card p-6 cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-100 rounded-lg">
            <ApperIcon 
              name={categoryIcons[discussion.category] || 'MessageCircle'} 
              size={20} 
              className="text-accent-600"
            />
          </div>
          <Badge variant="default">
            {discussion.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-surface-500">
          <ApperIcon name="MessageCircle" size={16} />
          <span className="text-sm">{discussion.replies.length}</span>
        </div>
      </div>

      <h3 className="font-display font-semibold text-lg text-surface-900 mb-2 line-clamp-2">
        {discussion.title}
      </h3>
      
      <p className="text-surface-600 mb-4 line-clamp-3">
        {discussion.content}
      </p>

      <div className="flex items-center justify-between text-sm text-surface-500">
        <div className="flex items-center gap-2">
          <ApperIcon name="User" size={16} />
          <span>{discussion.author}</span>
        </div>
        <span>{format(new Date(discussion.createdAt), 'MMM d, yyyy')}</span>
      </div>
    </motion.div>
  )
}

export default DiscussionCard