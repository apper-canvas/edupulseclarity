import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { fetchDiscussionById, addReply } from '@/store/slices/discussionSlice'
import { toast } from 'react-toastify'

const DiscussionDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [newReply, setNewReply] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  const { currentDiscussion, loading, error } = useSelector(state => state.discussion)

  const categoryIcons = {
    'Health': 'Heart',
    'Agriculture': 'Sprout',
    'Technology': 'Cpu',
    'Education': 'GraduationCap',
    'Science': 'Microscope',
    'Business': 'Briefcase',
    'Environment': 'Leaf'
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchDiscussionById(parseInt(id)))
    }
  }, [id, dispatch])

  const handleAddReply = async (e) => {
    e.preventDefault()
    if (!newReply.trim()) return

    setIsReplying(true)
    try {
      await dispatch(addReply({
        discussionId: parseInt(id),
        reply: {
          content: newReply,
          author: 'You' // In a real app, this would come from auth
        }
      })).unwrap()

      setNewReply('')
      toast.success('Reply added successfully!')
    } catch (error) {
      toast.error('Failed to add reply')
    } finally {
      setIsReplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-surface-600">Loading discussion...</p>
        </div>
      </div>
    )
  }

  if (error || !currentDiscussion) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Discussion not found</h3>
          <p className="text-surface-600 mb-4">The discussion you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/discussions')}>
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Discussions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/discussions')}
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back
          </Button>
          <span className="text-surface-400">/</span>
          <span className="text-surface-600">Discussion</span>
        </div>
      </div>

      {/* Main Discussion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-accent-100 rounded-lg">
            <ApperIcon 
              name={categoryIcons[currentDiscussion.category] || 'MessageCircle'} 
              size={24} 
              className="text-accent-600"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="default">{currentDiscussion.category}</Badge>
              <div className="flex items-center gap-2 text-surface-500 text-sm">
                <ApperIcon name="User" size={14} />
                <span>{currentDiscussion.author}</span>
                <span>•</span>
                <span>{format(new Date(currentDiscussion.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-surface-900 mb-4">
              {currentDiscussion.title}
            </h1>
            <div className="prose max-w-none text-surface-700">
              <p>{currentDiscussion.content}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-surface-200">
          <div className="flex items-center gap-2 text-surface-500">
            <ApperIcon name="MessageCircle" size={16} />
            <span>{currentDiscussion.replies.length} replies</span>
          </div>
        </div>
      </motion.div>

      {/* Replies */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-display font-semibold text-surface-900">
          Replies ({currentDiscussion.replies.length})
        </h2>
        
        {currentDiscussion.replies.length > 0 ? (
          currentDiscussion.replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 ml-4 border-l-4 border-accent-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-surface-200 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={14} className="text-surface-600" />
                </div>
                <span className="font-medium text-surface-900">{reply.author}</span>
                <span className="text-surface-400">•</span>
                <span className="text-sm text-surface-500">
                  {format(new Date(reply.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="text-surface-700">
                <p>{reply.content}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 bg-surface-50 rounded-lg">
            <ApperIcon name="MessageCircle" size={32} className="text-surface-400 mx-auto mb-2" />
            <p className="text-surface-600">No replies yet. Be the first to contribute!</p>
          </div>
        )}
      </div>

      {/* Add Reply Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
          Add Your Reply
        </h3>
        
        <form onSubmit={handleAddReply}>
          <div className="mb-4">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Share your thoughts or answer..."
              rows={4}
              className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setNewReply('')}
              disabled={!newReply.trim()}
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={isReplying}
              disabled={!newReply.trim()}
            >
              <ApperIcon name="Send" size={16} />
              Post Reply
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default DiscussionDetailPage