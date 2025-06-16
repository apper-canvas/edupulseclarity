import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md disabled:bg-primary-300',
    secondary: 'border border-surface-300 hover:border-surface-400 bg-white hover:bg-surface-50 text-surface-700 disabled:bg-surface-100 disabled:text-surface-400',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md disabled:bg-accent-300',
    ghost: 'hover:bg-surface-100 text-surface-600 hover:text-surface-900 disabled:text-surface-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md disabled:bg-red-300'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const handleClick = (e) => {
    if (disabled || loading) return
    onClick?.(e)
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  )
}

export default Button