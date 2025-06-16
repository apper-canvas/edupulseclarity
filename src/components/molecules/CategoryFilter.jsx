import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className = '' 
}) => {
  const categoryIcons = {
    'all': 'Grid3x3',
    'Health': 'Heart',
    'Agriculture': 'Sprout',
    'Technology': 'Cpu',
    'Education': 'GraduationCap',
    'Science': 'Microscope',
    'Business': 'Briefcase',
    'Environment': 'Leaf'
  }

  const allCategories = ['all', ...categories]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allCategories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${selectedCategory === category
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-surface-700 border border-surface-200 hover:border-surface-300 hover:bg-surface-50'
            }
          `}
        >
          <ApperIcon 
            name={categoryIcons[category] || 'Tag'} 
            size={16} 
          />
          {category === 'all' ? 'All Topics' : category}
        </motion.button>
      ))}
    </div>
  )
}

export default CategoryFilter