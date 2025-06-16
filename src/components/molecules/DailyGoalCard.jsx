import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'
import Badge from '@/components/atoms/Badge'

const DailyGoalCard = ({ className = '' }) => {
  const { dailyGoal, completedToday, streak, totalPoints } = useSelector(state => state.user)

  const progressPercentage = (completedToday / dailyGoal) * 100

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-surface-900">
          Daily Progress
        </h3>
        <Badge variant="accent" className="flex items-center gap-1">
          <ApperIcon name="Zap" size={14} />
          {totalPoints} pts
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <ProgressRing 
              value={completedToday} 
              max={dailyGoal} 
              size={80}
              color="primary"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-surface-600">
              <ApperIcon name="Target" size={16} />
              <span>Goal: {dailyGoal} items/day</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-600">
              <ApperIcon name="Flame" size={16} />
              <span>{streak} day streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-surface-200">
        <p className="text-sm text-surface-600 text-center">
          {completedToday >= dailyGoal 
            ? "🎉 Daily goal completed!" 
            : `${dailyGoal - completedToday} more to reach your goal`
          }
        </p>
      </div>
    </div>
  )
}

export default DailyGoalCard