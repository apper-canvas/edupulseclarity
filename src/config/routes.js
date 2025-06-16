import FeedPage from '@/components/pages/FeedPage'
import QuizzesPage from '@/components/pages/QuizzesPage'
import DiscussionsPage from '@/components/pages/DiscussionsPage'
import SubmitPage from '@/components/pages/SubmitPage'
import ProfilePage from '@/components/pages/ProfilePage'
import OnboardingPage from '@/components/pages/OnboardingPage'
import QuizDetailPage from '@/components/pages/QuizDetailPage'
import DiscussionDetailPage from '@/components/pages/DiscussionDetailPage'

const routes = [
  {
    path: '/',
    component: FeedPage,
  },
  {
    path: '/onboarding',
    component: OnboardingPage,
  },
  {
    path: '/quizzes',
    component: QuizzesPage,
  },
  {
    path: '/quiz/:id',
    component: QuizDetailPage,
  },
  {
    path: '/discussions',
    component: DiscussionsPage,
  },
  {
    path: '/discussion/:id',
    component: DiscussionDetailPage,
  },
  {
    path: '/submit',
    component: SubmitPage,
  },
  {
    path: '/profile',
    component: ProfilePage,
  },
]

export default routes