import discussionData from '@/services/mockData/discussion.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DiscussionService {
  constructor() {
    this.data = [...discussionData]
  }

  async getAll(filters = {}) {
    await delay(250)
    let filteredData = [...this.data]
    
    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item => item.category === filters.category)
    }
    
    return filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error('Discussion not found')
    }
    return { ...item }
  }

  async create(item) {
    await delay(400)
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id)) + 1,
      replies: [],
      createdAt: new Date().toISOString()
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, data) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Discussion not found')
    }
    this.data[index] = { ...this.data[index], ...data }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Discussion not found')
    }
    this.data.splice(index, 1)
    return true
  }

  async addReply(discussionId, reply) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === parseInt(discussionId))
    if (index === -1) {
      throw new Error('Discussion not found')
    }

    const newReply = {
      id: Date.now().toString(),
      content: reply.content,
      author: reply.author,
      createdAt: new Date().toISOString()
    }

    this.data[index].replies.push(newReply)
    return { ...this.data[index] }
  }
}

export default new DiscussionService()