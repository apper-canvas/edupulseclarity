import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const navigation = [
    { name: 'Feed', path: '/', icon: 'Home' },
    { name: 'Quizzes', path: '/quizzes', icon: 'Brain' },
    { name: 'Discussions', path: '/discussions', icon: 'MessageCircle' },
    { name: 'Submit', path: '/submit', icon: 'Plus' },
    { name: 'Profile', path: '/profile', icon: 'User' },
  ]

  return (
    <div className="w-64 bg-white border-r border-surface-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-surface-900">EduPulse</h1>
            <p className="text-xs text-surface-500">Continuous Learning</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={20} />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar