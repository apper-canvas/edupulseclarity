import { useState } from 'react'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'

const Header = () => {
  const [notifications] = useState([])
  const { totalPoints, completedToday, dailyGoal } = useSelector(state => state.user)

  const handleSearch = (query) => {
    // Search functionality would be implemented here
    console.log('Searching for:', query)
  }

  return (
    <header className="bg-white border-b border-surface-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search content, quizzes, discussions..."
          />
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Daily Progress Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-50 rounded-lg">
            <ApperIcon name="Target" size={16} className="text-surface-600" />
            <span className="text-sm text-surface-700">
              {completedToday}/{dailyGoal} today
            </span>
          </div>

          {/* Points */}
          <Badge variant="accent" className="flex items-center gap-1">
            <ApperIcon name="Zap" size={14} />
            {totalPoints} pts
          </Badge>

          {/* Notifications */}
          <button className="relative p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
            <ApperIcon name="Bell" size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header