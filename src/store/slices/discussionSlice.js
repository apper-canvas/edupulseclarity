import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { discussionService } from '@/services'

export const fetchDiscussions = createAsyncThunk(
  'discussion/fetchDiscussions',
  async (filters = {}) => {
    return await discussionService.getAll(filters)
  }
)

export const fetchDiscussionById = createAsyncThunk(
  'discussion/fetchDiscussionById',
  async (id) => {
    return await discussionService.getById(id)
  }
)

export const createDiscussion = createAsyncThunk(
  'discussion/create',
  async (discussionData) => {
    return await discussionService.create(discussionData)
  }
)

export const addReply = createAsyncThunk(
  'discussion/addReply',
  async ({ discussionId, reply }) => {
    return await discussionService.addReply(discussionId, reply)
  }
)

const discussionSlice = createSlice({
  name: 'discussion',
  initialState: {
    discussions: [],
    currentDiscussion: null,
    selectedCategory: 'all',
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    clearCurrentDiscussion: (state) => {
      state.currentDiscussion = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscussions.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDiscussions.fulfilled, (state, action) => {
        state.loading = false
        state.discussions = action.payload
      })
      .addCase(fetchDiscussions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchDiscussionById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDiscussionById.fulfilled, (state, action) => {
        state.loading = false
        state.currentDiscussion = action.payload
      })
      .addCase(fetchDiscussionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createDiscussion.fulfilled, (state, action) => {
        state.discussions.unshift(action.payload)
      })
      .addCase(addReply.fulfilled, (state, action) => {
        if (state.currentDiscussion && state.currentDiscussion.Id === action.payload.Id) {
          state.currentDiscussion = action.payload
        }
        // Update the discussion in the list as well
        const index = state.discussions.findIndex(d => d.Id === action.payload.Id)
        if (index !== -1) {
          state.discussions[index] = action.payload
        }
      })
  },
})

export const { setSelectedCategory, clearCurrentDiscussion, clearError } = discussionSlice.actions
export default discussionSlice.reducer