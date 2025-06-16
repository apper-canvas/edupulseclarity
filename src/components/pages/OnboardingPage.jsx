import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { updateUserTopics, updateDailyGoal } from '@/store/slices/userSlice'
import { toast } from 'react-toastify'

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTopics, setSelectedTopics] = useState([])
  const [dailyGoal, setDailyGoalState] = useState(3)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const topics = [
    { name: 'Health', icon: 'Heart', description: 'Wellness, nutrition, and medical insights' },
    { name: 'Agriculture', icon: 'Sprout', description: 'Farming, sustainability, and food production' },
    { name: 'Technology', icon: 'Cpu', description: 'AI, programming, and digital innovation' },
    { name: 'Education', icon: 'GraduationCap', description: 'Learning techniques and academic skills' },
    { name: 'Science', icon: 'Microscope', description: 'Research, discoveries, and scientific methods' },
    { name: 'Business', icon: 'Briefcase', description: 'Entrepreneurship, finance, and management' },
    { name: 'Environment', icon: 'Leaf', description: 'Climate, conservation, and sustainability' },
  ]

  const steps = [
    {
      title: 'Welcome to EduPulse!',
      subtitle: 'Your journey to continuous learning starts here',
      component: WelcomeStep
    },
    {
      title: 'Choose Your Interests',
      subtitle: 'Select topics you want to learn about',
      component: TopicSelectionStep
    },
    {
      title: 'Set Your Daily Goal',
      subtitle: 'How many learning items do you want to complete each day?',
      component: GoalSettingStep
    }
  ]

  function WelcomeStep() {
    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="GraduationCap" size={48} className="text-primary-600" />
        </div>
        <h1 className="text-3xl font-display font-bold text-surface-900 mb-4">
          Welcome to EduPulse
        </h1>
        <p className="text-lg text-surface-600 mb-8 max-w-md mx-auto">
          Discover bite-sized learning content, take quizzes, and engage with a community of learners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          <div className="p-4 bg-surface-50 rounded-lg">
            <ApperIcon name="BookOpen" size={24} className="text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-surface-900 mb-1">Learn Daily</h3>
            <p className="text-sm text-surface-600">Bite-sized content delivered daily</p>
          </div>
          <div className="p-4 bg-surface-50 rounded-lg">
            <ApperIcon name="Brain" size={24} className="text-secondary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-surface-900 mb-1">Test Knowledge</h3>
            <p className="text-sm text-surface-600">Interactive quizzes and challenges</p>
          </div>
          <div className="p-4 bg-surface-50 rounded-lg">
            <ApperIcon name="Users" size={24} className="text-accent-600 mx-auto mb-2" />
            <h3 className="font-semibold text-surface-900 mb-1">Join Community</h3>
            <p className="text-sm text-surface-600">Discuss and share with learners</p>
          </div>
        </div>
      </div>
    )
  }

  function TopicSelectionStep() {
    const toggleTopic = (topicName) => {
      setSelectedTopics(prev => 
        prev.includes(topicName)
          ? prev.filter(t => t !== topicName)
          : [...prev, topicName]
      )
    }

    return (
      <div>
        <p className="text-center text-surface-600 mb-8">
          Select at least 2 topics to get personalized content recommendations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {topics.map((topic) => (
            <motion.button
              key={topic.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleTopic(topic.name)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedTopics.includes(topic.name)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-surface-200 bg-white hover:border-surface-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${
                  selectedTopics.includes(topic.name) ? 'bg-primary-600' : 'bg-surface-100'
                }`}>
                  <ApperIcon 
                    name={topic.icon} 
                    size={24} 
                    className={selectedTopics.includes(topic.name) ? 'text-white' : 'text-surface-600'}
                  />
                </div>
                {selectedTopics.includes(topic.name) && (
                  <ApperIcon name="Check" size={20} className="text-primary-600" />
                )}
              </div>
              <h3 className="font-semibold text-surface-900 mb-1">{topic.name}</h3>
              <p className="text-sm text-surface-600">{topic.description}</p>
            </motion.button>
          ))}
        </div>
        {selectedTopics.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600">
              {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    )
  }

  function GoalSettingStep() {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Target" size={40} className="text-accent-600" />
          </div>
          <p className="text-surface-600">
            Setting a daily goal helps maintain consistency and build learning habits.
          </p>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((goal) => (
            <motion.button
              key={goal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDailyGoalState(goal)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                dailyGoal === goal
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-surface-200 bg-white hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  dailyGoal === goal ? 'border-accent-500 bg-accent-500' : 'border-surface-300'
                }`}>
                  {dailyGoal === goal && (
                    <ApperIcon name="Check" size={14} className="text-white" />
                  )}
                </div>
                <span className="font-medium text-surface-900">
                  {goal} item{goal !== 1 ? 's' : ''} per day
                </span>
              </div>
              <span className="text-sm text-surface-500">
                {goal === 1 ? 'Light' : goal <= 2 ? 'Moderate' : goal <= 3 ? 'Balanced' : 'Intensive'}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-surface-50 rounded-lg">
          <p className="text-sm text-surface-600 text-center">
            Don't worry, you can change this anytime in your profile settings.
          </p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedTopics.length < 2) {
      toast.error('Please select at least 2 topics')
      return
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await dispatch(updateUserTopics(selectedTopics)).unwrap()
      await dispatch(updateDailyGoal(dailyGoal)).unwrap()
      toast.success('Welcome to EduPulse! Let\'s start learning!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to complete setup')
    } finally {
      setLoading(false)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index <= currentStep ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-500'
                }`}>
                  {index < currentStep ? (
                    <ApperIcon name="Check" size={20} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-surface-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-surface-600">
              {steps[currentStep].subtitle}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <CurrentStepComponent />
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ApperIcon name="ChevronLeft" size={16} />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentStep === 1 && selectedTopics.length < 2}
            >
              Next
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleComplete}
              loading={loading}
              disabled={selectedTopics.length < 2}
            >
              Get Started
              <ApperIcon name="Rocket" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage