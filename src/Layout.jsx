import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'
import MobileNavigation from '@/components/organisms/MobileNavigation'
import { motion } from 'framer-motion'

function Layout() {
  const location = useLocation()
  const { hasCompletedOnboarding } = useSelector(state => state.user)
  
  const isOnboarding = location.pathname === '/onboarding'
  const showNavigation = hasCompletedOnboarding && !isOnboarding

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop Sidebar */}
      {showNavigation && (
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        {showNavigation && <Header />}
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile Navigation */}
        {showNavigation && (
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        )}
      </div>
    </div>
  )
}

export default Layout