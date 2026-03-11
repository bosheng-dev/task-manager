const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        this.tasks = data.tasks || [];
        this.nextId = data.nextId || 1;
      }
    } catch (error) {
      console.error('Error loading tasks:', error.message);
      this.tasks = [];
      this.nextId = 1;
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify({
        tasks: this.tasks,
        nextId: this.nextId
      }, null, 2));
    } catch (error) {
      console.error('Error saving tasks:', error.message);
    }
  }

  addTask(description, options = {}) {
    const task = {
      id: this.nextId++,
      description,
      priority: options.priority || 'medium',
      category: options.category || 'general',
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.push(task);
    this.save();
    return task;
  }

  listTasks(filter = 'active') {
    if (filter === 'all') {
      return this.tasks;
    }
    return this.tasks.filter(t => !t.completed);
  }

  completeTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
      this.save();
      return task;
    }
    return null;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    const byPriority = {
      high: this.tasks.filter(t => t.priority === 'high' && !t.completed).length,
      medium: this.tasks.filter(t => t.priority === 'medium' && !t.completed).length,
      low: this.tasks.filter(t => t.priority === 'low' && !t.completed).length
    };

    return { total, completed, active, byPriority };
  }
}

module.exports = TaskManager;
