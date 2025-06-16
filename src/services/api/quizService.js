import quizData from '@/services/mockData/quiz.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class QuizService {
  constructor() {
    this.data = [...quizData]
  }

  async getAll(filters = {}) {
    await delay(250)
    let filteredData = [...this.data]
    
    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item => item.category === filters.category)
    }
    
    if (filters.difficulty) {
      filteredData = filteredData.filter(item => item.difficulty === filters.difficulty)
    }
    
    return filteredData.sort((a, b) => a.title.localeCompare(b.title))
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error('Quiz not found')
    }
    return { ...item }
  }

  async create(item) {
    await delay(400)
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id)) + 1,
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, data) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    this.data[index] = { ...this.data[index], ...data }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    this.data.splice(index, 1)
    return true
  }

  async submitQuiz(quizId, answers) {
    await delay(500)
    const quiz = this.data.find(q => q.Id === parseInt(quizId))
    if (!quiz) {
      throw new Error('Quiz not found')
    }

    let score = 0
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) score++
      
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      }
    })

    const percentage = Math.round((score / quiz.questions.length) * 100)
    
    return {
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      results,
      passed: percentage >= 70
    }
  }
}

export default new QuizService()