import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { quizService } from '@/services'

export const fetchQuizzes = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (filters = {}) => {
    return await quizService.getAll(filters)
  }
)

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchQuizById',
  async (id) => {
    return await quizService.getById(id)
  }
)

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async ({ quizId, answers }) => {
    return await quizService.submitQuiz(quizId, answers)
  }
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizzes: [],
    currentQuiz: null,
    quizResult: null,
    selectedCategory: 'all',
    selectedDifficulty: 'all',
    currentAnswers: {},
    currentQuestion: 0,
    quizStarted: false,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setSelectedDifficulty: (state, action) => {
      state.selectedDifficulty = action.payload
    },
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload
      state.currentAnswers[questionIndex] = answer
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload
    },
    startQuiz: (state) => {
      state.quizStarted = true
      state.currentAnswers = {}
      state.currentQuestion = 0
      state.quizResult = null
    },
    resetQuiz: (state) => {
      state.currentQuiz = null
      state.quizResult = null
      state.currentAnswers = {}
      state.currentQuestion = 0
      state.quizStarted = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false
        state.quizzes = action.payload
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false
        state.currentQuiz = action.payload
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false
        state.quizResult = action.payload
        state.quizStarted = false
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const {
  setSelectedCategory,
  setSelectedDifficulty,
  setAnswer,
  setCurrentQuestion,
  startQuiz,
  resetQuiz,
  clearError,
} = quizSlice.actions
export default quizSlice.reducer