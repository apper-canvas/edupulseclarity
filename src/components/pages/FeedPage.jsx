import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ContentCard from '@/components/molecules/ContentCard'
import DailyGoalCard from '@/components/molecules/DailyGoalCard'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import { fetchContent, fetchCategories, setSelectedCategory, setSelectedType } from '@/store/slices/feedSlice'

const FeedPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasCompletedOnboarding } = useSelector(state => state.user)
  const { 
    content, 
    categories, 
    selectedCategory, 
    selectedType, 
    loading, 
    error 
  } = useSelector(state => state.feed)

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      navigate('/onboarding')
      return
    }
    
    dispatch(fetchCategories())
    dispatch(fetchContent())
  }, [dispatch, hasCompletedOnboarding, navigate])

  useEffect(() => {
    const filters = {}
    if (selectedCategory !== 'all') filters.category = selectedCategory
    if (selectedType !== 'all') filters.type = selectedType
    
    dispatch(fetchContent(filters))
  }, [selectedCategory, selectedType, dispatch])

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category))
  }

  const handleTypeChange = (type) => {
    dispatch(setSelectedType(type))
  }

  if (!hasCompletedOnboarding) {
    return null
  }

  if (loading && content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-surface-600">Loading your personalized feed...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load content</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchContent())}>
            <ApperIcon name="RefreshCw" size={16} />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              Your Learning Feed
            </h1>
            <p className="text-surface-600">
              Discover new content tailored to your interests
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-surface-700 mb-3">Filter by Topic</h3>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-surface-700 mb-3">Content Type</h3>
              <div className="flex gap-2">
                {['all', 'article', 'video'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleTypeChange(type)}
                  >
                    <ApperIcon 
                      name={type === 'video' ? 'Video' : type === 'article' ? 'FileText' : 'Grid3x3'} 
                      size={16} 
                    />
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          {content.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content.map((item, index) => (
                <motion.div
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ContentCard content={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="Search" size={48} className="text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                No content found
              </h3>
              <p className="text-surface-600 mb-4">
                Try adjusting your filters or check back later for new content.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => {
                  dispatch(setSelectedCategory('all'))
                  dispatch(setSelectedType('all'))
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {loading && content.length > 0 && (
            <div className="flex justify-center mt-6">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-6">
            <DailyGoalCard />
            
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/quizzes')}
                >
                  <ApperIcon name="Brain" size={16} />
                  Take a Quiz
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/discussions')}
                >
                  <ApperIcon name="MessageCircle" size={16} />
                  Join Discussion
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/submit')}
                >
                  <ApperIcon name="Plus" size={16} />
                  Submit Content
                </Button>
              </div>
            </div>

            {/* Did You Know? */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-500">
              <h3 className="font-display font-semibold text-lg text-surface-900 mb-2">
                💡 Did You Know?
              </h3>
              <p className="text-surface-700">
                Regular learning for just 15 minutes a day can improve memory retention by up to 40%!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedPage