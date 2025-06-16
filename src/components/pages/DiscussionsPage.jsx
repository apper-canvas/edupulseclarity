import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import DiscussionCard from '@/components/molecules/DiscussionCard'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { fetchDiscussions, setSelectedCategory, createDiscussion } from '@/store/slices/discussionSlice'

const DiscussionsPage = () => {
  const dispatch = useDispatch()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'Health'
  })

  const { 
    discussions, 
    selectedCategory, 
    loading, 
    error 
  } = useSelector(state => state.discussion)

  const { categories } = useSelector(state => state.feed)

  useEffect(() => {
    dispatch(fetchDiscussions())
  }, [dispatch])

  useEffect(() => {
    const filters = {}
    if (selectedCategory !== 'all') filters.category = selectedCategory
    
    dispatch(fetchDiscussions(filters))
  }, [selectedCategory, dispatch])

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category))
  }

  const handleCreateDiscussion = async (e) => {
    e.preventDefault()
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return

    try {
      await dispatch(createDiscussion({
        ...newDiscussion,
        author: 'You' // In a real app, this would come from auth
      })).unwrap()
      
      setNewDiscussion({ title: '', content: '', category: 'Health' })
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create discussion:', error)
    }
  }

  if (loading && discussions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-surface-600">Loading discussions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load discussions</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchDiscussions())}>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-100 rounded-lg">
              <ApperIcon name="MessageCircle" size={24} className="text-accent-600" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900">
                Community Discussions
              </h1>
              <p className="text-surface-600">
                Share knowledge and learn from others
              </p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateForm(true)}
          >
            <ApperIcon name="Plus" size={16} />
            Start Discussion
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <Badge variant="info" className="flex items-center gap-1">
            <ApperIcon name="MessageCircle" size={14} />
            {discussions.length} Discussions
          </Badge>
          <Badge variant="success" className="flex items-center gap-1">
            <ApperIcon name="Users" size={14} />
            Active Community
          </Badge>
        </div>
      </div>

      {/* Create Discussion Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-surface-900">
              Start a New Discussion
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCreateForm(false)}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Category
              </label>
              <select
                value={newDiscussion.category}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Discussion Title
              </label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What would you like to discuss?"
                className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Description
              </label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Provide more details about your question or topic..."
                rows={4}
                className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <ApperIcon name="Send" size={16} />
                Post Discussion
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-surface-700 mb-3">Filter by Topic</h3>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Discussions List */}
      {discussions.length > 0 ? (
        <div className="space-y-4">
          {discussions.map((discussion, index) => (
            <motion.div
              key={discussion.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <DiscussionCard discussion={discussion} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="MessageCircle" size={48} className="text-surface-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            No discussions found
          </h3>
          <p className="text-surface-600 mb-4">
            {selectedCategory === 'all' 
              ? "Be the first to start a discussion in the community!"
              : "No discussions found for this category. Try a different filter or start a new discussion."
            }
          </p>
          <div className="flex justify-center gap-3">
            {selectedCategory !== 'all' && (
              <Button 
                variant="secondary" 
                onClick={() => dispatch(setSelectedCategory('all'))}
              >
                Show All Discussions
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={() => setShowCreateForm(true)}
            >
              <ApperIcon name="Plus" size={16} />
              Start Discussion
            </Button>
          </div>
        </div>
      )}

      {loading && discussions.length > 0 && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

export default DiscussionsPage