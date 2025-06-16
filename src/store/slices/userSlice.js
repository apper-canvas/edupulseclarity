import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userProgressService } from '@/services'

// Async thunks
export const initializeUser = createAsyncThunk(
  'user/initialize',
  async () => {
    try {
      const progress = await userProgressService.getProgress()
      const hasCompletedOnboarding = progress.topics && progress.topics.length > 0
      return { ...progress, hasCompletedOnboarding }
    } catch (error) {
      return {
        userId: 'user1',
        dailyGoal: 3,
        completedToday: 0,
        streak: 0,
        totalPoints: 0,
        topics: [],
        hasCompletedOnboarding: false
      }
    }
  }
)

export const updateUserTopics = createAsyncThunk(
  'user/updateTopics',
  async (topics) => {
    const progress = await userProgressService.updateTopics(topics)
    return { ...progress, hasCompletedOnboarding: true }
  }
)

export const incrementCompleted = createAsyncThunk(
  'user/incrementCompleted',
  async () => {
    return await userProgressService.incrementCompleted()
  }
)

export const updateDailyGoal = createAsyncThunk(
  'user/updateDailyGoal',
  async (goal) => {
    return await userProgressService.setDailyGoal(goal)
  }
)

export const addPoints = createAsyncThunk(
  'user/addPoints',
  async (points) => {
    return await userProgressService.addPoints(points)
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    dailyGoal: 3,
    completedToday: 0,
    streak: 0,
    totalPoints: 0,
    topics: [],
    hasCompletedOnboarding: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUser.pending, (state) => {
        state.loading = true
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        state.loading = false
        Object.assign(state, action.payload)
      })
      .addCase(initializeUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateUserTopics.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
      .addCase(incrementCompleted.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
      .addCase(updateDailyGoal.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
      .addCase(addPoints.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer