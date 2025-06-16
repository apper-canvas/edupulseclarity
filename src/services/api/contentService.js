import contentData from '@/services/mockData/content.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ContentService {
  constructor() {
    this.data = [...contentData]
  }

  async getAll(filters = {}) {
    await delay(300)
    let filteredData = [...this.data]
    
    if (filters.category && filters.category !== 'all') {
      filteredData = filteredData.filter(item => item.category === filters.category)
    }
    
    if (filters.type) {
      filteredData = filteredData.filter(item => item.type === filters.type)
    }
    
    if (filters.difficulty) {
      filteredData = filteredData.filter(item => item.difficulty === filters.difficulty)
    }
    
    return filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getById(id) {
    await delay(200)
    const item = this.data.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error('Content not found')
    }
    return { ...item }
  }

  async create(item) {
    await delay(400)
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, data) {
    await delay(300)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Content not found')
    }
    this.data[index] = { ...this.data[index], ...data }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Content not found')
    }
    this.data.splice(index, 1)
    return true
  }

  async getCategories() {
    await delay(100)
    const categories = [...new Set(this.data.map(item => item.category))]
    return categories.sort()
  }
}

export default new ContentService()