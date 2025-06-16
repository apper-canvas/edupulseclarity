import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { contentService } from '@/services'
import { toast } from 'react-toastify'

const SubmitPage = () => {
  const [contentForm, setContentForm] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'Health',
    type: 'article',
    difficulty: 'beginner'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { categories } = useSelector(state => state.feed)

  const handleInputChange = (field, value) => {
    setContentForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contentForm.title.trim() || !contentForm.excerpt.trim() || !contentForm.body.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      await contentService.create({
        ...contentForm,
        readTime: Math.ceil(contentForm.body.split(' ').length / 200) // Estimate reading time
      })
      
      toast.success('Content submitted successfully! It will be reviewed before publishing.')
      setContentForm({
        title: '',
        excerpt: '',
        body: '',
        category: 'Health',
        type: 'article',
        difficulty: 'beginner'
      })
    } catch (error) {
      toast.error('Failed to submit content. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const wordCount = contentForm.body.split(' ').filter(word => word.length > 0).length
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <ApperIcon name="Plus" size={24} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">
              Submit Content
            </h1>
            <p className="text-surface-600">
              Share your knowledge with the community
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
          <h2 className="font-display font-semibold text-lg text-surface-900 mb-3">
            Content Guidelines
          </h2>
          <ul className="space-y-2 text-surface-700">
            <li className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              Provide accurate, well-researched information
            </li>
            <li className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              Write in a clear, educational tone
            </li>
            <li className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              Include practical examples or applications
            </li>
            <li className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              Cite sources when appropriate
            </li>
          </ul>
        </div>
      </div>

      {/* Submission Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Category *
              </label>
              <select
                value={contentForm.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Content Type *
              </label>
              <select
                value={contentForm.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Difficulty Level *
            </label>
            <div className="flex gap-3">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleInputChange('difficulty', level)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    contentForm.difficulty === level
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={contentForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter a compelling title for your content..."
              className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Excerpt *
            </label>
            <textarea
              value={contentForm.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Write a brief summary that captures the main points..."
              rows={3}
              className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="text-xs text-surface-500 mt-1">
              This will appear in the content feed as a preview
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Content Body *
            </label>
            <textarea
              value={contentForm.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              placeholder="Write your detailed content here. Be comprehensive and educational..."
              rows={12}
              className="w-full p-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <div className="flex justify-between items-center mt-2 text-xs text-surface-500">
              <span>{wordCount} words</span>
              <span>Est. reading time: {estimatedReadTime} min</span>
            </div>
          </div>

          {/* Preview */}
          {contentForm.title && contentForm.excerpt && (
            <div className="border-t border-surface-200 pt-6">
              <h3 className="text-lg font-display font-semibold text-surface-900 mb-4">
                Preview
              </h3>
              <div className="card p-6 bg-surface-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                    {contentForm.category}
                  </span>
                  <span className="px-2 py-1 bg-surface-200 text-surface-700 text-xs font-medium rounded-full">
                    {contentForm.difficulty}
                  </span>
                  <span className="text-xs text-surface-500">
                    {estimatedReadTime} min read
                  </span>
                </div>
                <h4 className="font-display font-semibold text-lg text-surface-900 mb-2">
                  {contentForm.title}
                </h4>
                <p className="text-surface-600">
                  {contentForm.excerpt}
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t border-surface-200">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setContentForm({
                title: '',
                excerpt: '',
                body: '',
                category: 'Health',
                type: 'article',
                difficulty: 'beginner'
              })}
            >
              Clear All
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={isSubmitting}
              disabled={!contentForm.title.trim() || !contentForm.excerpt.trim() || !contentForm.body.trim()}
            >
              <ApperIcon name="Send" size={16} />
              Submit for Review
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SubmitPage