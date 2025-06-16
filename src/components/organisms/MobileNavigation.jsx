import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const MobileNavigation = () => {
  const navigation = [
    { name: 'Feed', path: '/', icon: 'Home' },
    { name: 'Quizzes', path: '/quizzes', icon: 'Brain' },
    { name: 'Discussions', path: '/discussions', icon: 'MessageCircle' },
    { name: 'Submit', path: '/submit', icon: 'Plus' },
    { name: 'Profile', path: '/profile', icon: 'User' },
  ]

  return (
    <div className="bg-white border-t border-surface-200 px-2 py-2 safe-area-pb">
      <nav className="flex justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-surface-500 hover:text-surface-700'
              }`
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default MobileNavigation