import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { contentService } from '@/services'

export const fetchContent = createAsyncThunk(
  'feed/fetchContent',
  async (filters = {}) => {
    return await contentService.getAll(filters)
  }
)

export const fetchCategories = createAsyncThunk(
  'feed/fetchCategories',
  async () => {
    return await contentService.getCategories()
  }
)

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    content: [],
    categories: [],
    selectedCategory: 'all',
    selectedType: 'all',
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false
        state.content = action.payload
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { setSelectedCategory, setSelectedType, clearError } = feedSlice.actions
export default feedSlice.reducer