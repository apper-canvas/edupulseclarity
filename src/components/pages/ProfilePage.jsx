import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ProgressRing from '@/components/atoms/ProgressRing'
import ProgressBar from '@/components/atoms/ProgressBar'
import { updateDailyGoal, updateUserTopics } from '@/store/slices/userSlice'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { 
    dailyGoal, 
    completedToday, 
    streak, 
    totalPoints, 
    topics: userTopics 
  } = useSelector(state => state.user)

  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState(dailyGoal)
  const [isEditingTopics, setIsEditingTopics] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState(userTopics)

  const allTopics = [
    { name: 'Health', icon: 'Heart', description: 'Wellness, nutrition, and medical insights' },
    { name: 'Agriculture', icon: 'Sprout', description: 'Farming, sustainability, and food production' },
    { name: 'Technology', icon: 'Cpu', description: 'AI, programming, and digital innovation' },
    { name: 'Education', icon: 'GraduationCap', description: 'Learning techniques and academic skills' },
    { name: 'Science', icon: 'Microscope', description: 'Research, discoveries, and scientific methods' },
    { name: 'Business', icon: 'Briefcase', description: 'Entrepreneurship, finance, and management' },
    { name: 'Environment', icon: 'Leaf', description: 'Climate, conservation, and sustainability' },
  ]

  const handleUpdateGoal = async () => {
    try {
      await dispatch(updateDailyGoal(newGoal)).unwrap()
      setIsEditingGoal(false)
      toast.success('Daily goal updated successfully!')
    } catch (error) {
      toast.error('Failed to update daily goal')
    }
  }

  const handleUpdateTopics = async () => {
    if (selectedTopics.length < 2) {
      toast.error('Please select at least 2 topics')
      return
    }

    try {
      await dispatch(updateUserTopics(selectedTopics)).unwrap()
      setIsEditingTopics(false)
      toast.success('Topics updated successfully!')
    } catch (error) {
      toast.error('Failed to update topics')
    }
  }

  const toggleTopic = (topicName) => {
    setSelectedTopics(prev => 
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    )
  }

  const progressPercentage = (completedToday / dailyGoal) * 100

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">
              Your Profile
            </h1>
            <p className="text-surface-600">
              Track your progress and customize your learning experience
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          {/* Daily Progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-surface-900">
                Today's Progress
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingGoal(!isEditingGoal)}
              >
                <ApperIcon name="Settings" size={16} />
              </Button>
            </div>

            <div className="flex items-center justify-center mb-4">
              <ProgressRing 
                value={completedToday} 
                max={dailyGoal} 
                size={120}
                color="primary"
              />
            </div>

            {isEditingGoal ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Daily Goal
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newGoal}
                      onChange={(e) => setNewGoal(parseInt(e.target.value))}
                      className="flex-1 p-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="flex items-center text-sm text-surface-600">items/day</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpdateGoal}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditingGoal(false)
                      setNewGoal(dailyGoal)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-surface-600">
                <p className="mb-2">
                  {completedToday >= dailyGoal 
                    ? "🎉 Daily goal completed!" 
                    : `${dailyGoal - completedToday} more to reach your goal`
                  }
                </p>
                <p>Goal: {dailyGoal} items per day</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Flame" size={24} className="text-accent-600" />
              </div>
              <div className="text-xl font-bold text-surface-900">{streak}</div>
              <div className="text-sm text-surface-600">Day Streak</div>
            </div>
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Zap" size={24} className="text-secondary-600" />
              </div>
              <div className="text-xl font-bold text-surface-900">{totalPoints}</div>
              <div className="text-sm text-surface-600">Total Points</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
              Achievements
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                streak >= 7 ? 'bg-success text-white' : 'bg-surface-100 text-surface-500'
              }`}>
                <ApperIcon name="Award" size={20} />
                <div>
                  <div className="font-medium">Week Warrior</div>
                  <div className="text-xs opacity-75">7 day learning streak</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                totalPoints >= 100 ? 'bg-success text-white' : 'bg-surface-100 text-surface-500'
              }`}>
                <ApperIcon name="Trophy" size={20} />
                <div>
                  <div className="font-medium">Point Master</div>
                  <div className="text-xs opacity-75">Earn 100+ points</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                userTopics.length >= 5 ? 'bg-success text-white' : 'bg-surface-100 text-surface-500'
              }`}>
                <ApperIcon name="BookOpen" size={20} />
                <div>
                  <div className="font-medium">Topic Explorer</div>
                  <div className="text-xs opacity-75">Follow 5+ topics</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Topics */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-surface-900">
                Learning Topics
              </h2>
              <Button
                variant={isEditingTopics ? "primary" : "secondary"}
                size="sm"
                onClick={() => {
                  if (isEditingTopics) {
                    handleUpdateTopics()
                  } else {
                    setIsEditingTopics(true)
                  }
                }}
              >
                <ApperIcon name={isEditingTopics ? "Check" : "Edit"} size={16} />
                {isEditingTopics ? "Save Changes" : "Edit Topics"}
              </Button>
            </div>

            {isEditingTopics ? (
              <div>
                <p className="text-surface-600 mb-4">
                  Select the topics you're interested in learning about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTopics.map((topic) => (
                    <motion.button
                      key={topic.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleTopic(topic.name)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        selectedTopics.includes(topic.name)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-surface-200 bg-white hover:border-surface-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${
                          selectedTopics.includes(topic.name) ? 'bg-primary-600' : 'bg-surface-100'
                        }`}>
                          <ApperIcon 
                            name={topic.icon} 
                            size={20} 
                            className={selectedTopics.includes(topic.name) ? 'text-white' : 'text-surface-600'}
                          />
                        </div>
                        {selectedTopics.includes(topic.name) && (
                          <ApperIcon name="Check" size={16} className="text-primary-600" />
                        )}
                      </div>
                      <h3 className="font-semibold text-surface-900 mb-1">{topic.name}</h3>
                      <p className="text-sm text-surface-600">{topic.description}</p>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-surface-600">
                    {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
                    {selectedTopics.length < 2 && (
                      <span className="text-error ml-1">(Select at least 2)</span>
                    )}
                  </p>
                  {isEditingTopics && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingTopics(false)
                        setSelectedTopics(userTopics)
                      }}
                      className="mt-2"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userTopics.map((topicName) => {
                  const topic = allTopics.find(t => t.name === topicName)
                  return (
                    <div key={topicName} className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <ApperIcon 
                          name={topic?.icon || 'Tag'} 
                          size={16} 
                          className="text-primary-600"
                        />
                      </div>
                      <span className="font-medium text-surface-900">{topicName}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Learning History */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-surface-900 mb-4">
              Learning Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success rounded-lg">
                    <ApperIcon name="CheckCircle" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-surface-900">Content Completed</div>
                    <div className="text-sm text-surface-600">Today</div>
                  </div>
                </div>
                <Badge variant="success">{completedToday}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info rounded-lg">
                    <ApperIcon name="Brain" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-surface-900">Quizzes Taken</div>
                    <div className="text-sm text-surface-600">This week</div>
                  </div>
                </div>
                <Badge variant="info">3</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-600 rounded-lg">
                    <ApperIcon name="MessageCircle" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-surface-900">Discussions Joined</div>
                    <div className="text-sm text-surface-600">This week</div>
                  </div>
                </div>
                <Badge variant="warning">2</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage