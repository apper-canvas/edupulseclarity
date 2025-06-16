import { configureStore } from '@reduxjs/toolkit'
import userSlice from '@/store/slices/userSlice'
import feedSlice from '@/store/slices/feedSlice'
import quizSlice from '@/store/slices/quizSlice'
import discussionSlice from '@/store/slices/discussionSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    feed: feedSlice,
    quiz: quizSlice,
    discussion: discussionSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch