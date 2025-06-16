import { motion } from 'framer-motion'

const ProgressRing = ({ 
  value, 
  max = 100, 
  size = 80, 
  strokeWidth = 8,
  className = '',
  color = 'primary',
  showLabel = true
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const colors = {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="progress-ring transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-surface-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          stroke={colors[color]}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-surface-900">
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-surface-500">
              {value}/{max}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressRing