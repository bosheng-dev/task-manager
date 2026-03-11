#!/usr/bin/env node

const TaskManager = require('./src/taskManager');
const { printHelp, printTasks, printStats } = require('./src/ui');

const taskManager = new TaskManager();

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  switch (command) {
    case 'add':
    case 'a':
      handleAdd(args.slice(1));
      break;
    case 'list':
    case 'ls':
    case 'l':
      handleList(args.slice(1));
      break;
    case 'complete':
    case 'done':
    case 'c':
      handleComplete(args.slice(1));
      break;
    case 'delete':
    case 'del':
    case 'd':
      handleDelete(args.slice(1));
      break;
    case 'stats':
    case 's':
      handleStats();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      printHelp();
  }
}

function handleAdd(args) {
  if (args.length === 0) {
    console.log('Error: Task description required');
    console.log('Usage: task add "description" [--priority high|medium|low] [--category name]');
    return;
  }

  const description = args[0];
  const priority = extractFlag(args, '--priority') || 'medium';
  const category = extractFlag(args, '--category') || 'general';

  const task = taskManager.addTask(description, { priority, category });
  console.log(`✅ Task added: #${task.id} ${task.description}`);
}

function handleList(args) {
  const filter = args.includes('--all') ? 'all' : 'active';
  const tasks = taskManager.listTasks(filter);
  printTasks(tasks);
}

function handleComplete(args) {
  if (args.length === 0) {
    console.log('Error: Task ID required');
    console.log('Usage: task complete <id>');
    return;
  }

  const id = parseInt(args[0]);
  const task = taskManager.completeTask(id);
  if (task) {
    console.log(`✅ Task completed: #${task.id} ${task.description}`);
  } else {
    console.log(`❌ Task #${id} not found`);
  }
}

function handleDelete(args) {
  if (args.length === 0) {
    console.log('Error: Task ID required');
    console.log('Usage: task delete <id>');
    return;
  }

  const id = parseInt(args[0]);
  const success = taskManager.deleteTask(id);
  if (success) {
    console.log(`🗑️  Task #${id} deleted`);
  } else {
    console.log(`❌ Task #${id} not found`);
  }
}

function handleStats() {
  const stats = taskManager.getStats();
  printStats(stats);
}

function extractFlag(args, flag) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return null;
}

main();
