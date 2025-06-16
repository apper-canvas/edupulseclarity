import userProgressData from '@/services/mockData/userProgress.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserProgressService {
  constructor() {
    this.data = { ...userProgressData }
  }

  async getProgress() {
    await delay(200)
    return { ...this.data }
  }

  async updateProgress(updates) {
    await delay(250)
    this.data = { ...this.data, ...updates }
    return { ...this.data }
  }

  async addPoints(points) {
    await delay(200)
    this.data.totalPoints += points
    return { ...this.data }
  }

  async incrementCompleted() {
    await delay(150)
    this.data.completedToday += 1
    
    // Check if daily goal is reached
    if (this.data.completedToday >= this.data.dailyGoal) {
      this.data.streak += 1
    }
    
    return { ...this.data }
  }

  async updateTopics(topics) {
    await delay(200)
    this.data.topics = [...topics]
    return { ...this.data }
  }

  async resetDaily() {
    await delay(100)
    this.data.completedToday = 0
    return { ...this.data }
  }

  async setDailyGoal(goal) {
    await delay(150)
    this.data.dailyGoal = goal
    return { ...this.data }
  }
}

export default new UserProgressService()