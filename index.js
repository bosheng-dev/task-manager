#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');

function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addTask(description) {
  const tasks = loadTasks();
  const task = {
    id: generateId(),
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`✅ 任务已添加: ${description}`);
  return task;
}

function listTasks(status = null) {
  let tasks = loadTasks();
  
  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }
  
  if (tasks.length === 0) {
    console.log('📭 没有任务');
    return;
  }
  
  console.log('\n📋 任务列表:\n');
  tasks.forEach((task, index) => {
    const icon = task.status === 'done' ? '✅' : '⏳';
    const statusText = task.status === 'done' ? '已完成' : '待办';
    console.log(`${index + 1}. ${icon} [${statusText}] ${task.description}`);
    console.log(`   ID: ${task.id}`);
    console.log('');
  });
}

function completeTask(idOrIndex) {
  const tasks = loadTasks();
  let task;
  
  // Try to find by index first
  const index = parseInt(idOrIndex) - 1;
  if (!isNaN(index) && index >= 0 && index < tasks.length) {
    task = tasks[index];
  } else {
    // Try to find by ID
    task = tasks.find(t => t.id === idOrIndex);
  }
  
  if (!task) {
    console.log('❌ 任务未找到');
    return;
  }
  
  task.status = 'done';
  task.completedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`✅ 任务已完成: ${task.description}`);
}

function deleteTask(idOrIndex) {
  const tasks = loadTasks();
  let taskIndex;
  
  // Try to find by index first
  const idx = parseInt(idOrIndex) - 1;
  if (!isNaN(idx) && idx >= 0 && idx < tasks.length) {
    taskIndex = idx;
  } else {
    // Try to find by ID
    taskIndex = tasks.findIndex(t => t.id === idOrIndex);
  }
  
  if (taskIndex === -1) {
    console.log('❌ 任务未找到');
    return;
  }
  
  const task = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  console.log(`🗑️  任务已删除: ${task.description}`);
}

function showHelp() {
  console.log(`
🦞 任务管理器 - 龙虾1号版

用法:
  node index.js <命令> [参数]

命令:
  add <描述>      添加新任务
  list            列出所有任务
  todo            列出待办任务
  done            列出已完成任务
  complete <ID>   完成任务（可用序号或ID）
  delete <ID>     删除任务（可用序号或ID）
  help            显示帮助

示例:
  node index.js add "学习Git"
  node index.js list
  node index.js complete 1
  node index.js delete 2
`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'add':
      if (!args[1]) {
        console.log('❌ 请提供任务描述');
        process.exit(1);
      }
      addTask(args.slice(1).join(' '));
      break;
      
    case 'list':
      listTasks();
      break;
      
    case 'todo':
      listTasks('todo');
      break;
      
    case 'done':
      listTasks('done');
      break;
      
    case 'complete':
      if (!args[1]) {
        console.log('❌ 请提供任务ID或序号');
        process.exit(1);
      }
      completeTask(args[1]);
      break;
      
    case 'delete':
      if (!args[1]) {
        console.log('❌ 请提供任务ID或序号');
        process.exit(1);
      }
      deleteTask(args[1]);
      break;
      
    case 'help':
    default:
      showHelp();
  }
}

main();
