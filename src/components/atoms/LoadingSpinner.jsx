import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    surface: 'border-surface-600'
  }

  return (
    <motion.div
      className={`
        ${sizes[size]} 
        ${colors[color]} 
        border-2 border-t-transparent 
        rounded-full 
        ${className}
      `}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default LoadingSpinner