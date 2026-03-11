// Test suite for Task Manager

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock data file for testing
const TEST_DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

// Clean up test data before running
function cleanup() {
  if (fs.existsSync(TEST_DATA_FILE)) {
    fs.unlinkSync(TEST_DATA_FILE);
  }
}

// Test 1: TaskManager can be instantiated
function testInstantiation() {
  cleanup();
  const TaskManager = require('./src/taskManager');
  const tm = new TaskManager();
  assert(tm instanceof TaskManager, 'Should create TaskManager instance');
  console.log('✓ TaskManager instantiation');
}

// Test 2: Can add tasks
function testAddTask() {
  cleanup();
  const TaskManager = require('./src/taskManager');
  const tm = new TaskManager();
  
  const task = tm.addTask('Test task', { priority: 'high', category: 'test' });
  assert(task.id === 1, 'First task should have id 1');
  assert(task.description === 'Test task', 'Description should match');
  assert(task.priority === 'high', 'Priority should match');
  assert(task.category === 'test', 'Category should match');
  assert(task.completed === false, 'New task should not be completed');
  
  console.log('✓ Add task');
}

// Test 3: Can list tasks
function testListTasks() {
  cleanup();
  const TaskManager = require('./src/taskManager');
  const tm = new TaskManager();
  
  tm.addTask('Task 1');
  tm.addTask('Task 2');
  
  const tasks = tm.listTasks('active');
  assert(tasks.length === 2, 'Should list 2 active tasks');
  
  console.log('✓ List tasks');
}

// Test 4: Can complete tasks
function testCompleteTask() {
  cleanup();
  const TaskManager = require('./src/taskManager');
  const tm = new TaskManager();
  
  tm.addTask('Task to complete');
  const completed = tm.completeTask(1);
  
  assert(completed !== null, 'Should return completed task');
  assert(completed.completed === true, 'Task should be marked completed');
  assert(completed.completedAt !== null, 'Should have completion timestamp');
  
  const activeTasks = tm.listTasks('active');
  assert(activeTasks.length === 0, 'No active tasks after completion');
  
  console.log('✓ Complete task');
}

// Test 5: Can delete tasks
function testDeleteTask() {
  cleanup();
  const TaskManager = require('./src/taskManager');
  const tm = new TaskManager();
  
  tm.addTask('Task to delete');
  const deleted = tm.deleteTask(1);
  
  assert(deleted === true, 'Should return true on successful delete');
  
  const tasks = tm.listTasks('all');
  assert(tasks.length === 0, 'No tasks after deletion');
  
  console.log('✓ Delete task');
}

// Test 6: Statistics
function testStats() {
  cleanup();
  const TaskManager = require('./src/taskManager');
  const tm = new TaskManager();
  
  tm.addTask('High priority', { priority: 'high' });
  tm.addTask('Medium priority', { priority: 'medium' });
  tm.addTask('Low priority', { priority: 'low' });
  tm.completeTask(1);
  
  const stats = tm.getStats();
  assert(stats.total === 3, 'Total should be 3');
  assert(stats.completed === 1, 'Completed should be 1');
  assert(stats.active === 2, 'Active should be 2');
  assert(stats.byPriority.high === 0, 'No active high priority (completed)');
  assert(stats.byPriority.medium === 1, 'One active medium');
  assert(stats.byPriority.low === 1, 'One active low');
  
  console.log('✓ Statistics');
}

// Test 7: CLI help command
function testCLI() {
  const { execSync } = require('child_process');
  
  try {
    const output = execSync('node cli.js help', { encoding: 'utf8', cwd: __dirname });
    assert(output.includes('Task Manager'), 'Help should show app name');
    assert(output.includes('add'), 'Help should mention add command');
    assert(output.includes('list'), 'Help should mention list command');
    console.log('✓ CLI help command');
  } catch (e) {
    console.error('✗ CLI test failed:', e.message);
    throw e;
  }
}

// Run all tests
function runTests() {
  console.log('Running Task Manager tests...\n');
  
  try {
    testInstantiation();
    testAddTask();
    testListTasks();
    testCompleteTask();
    testDeleteTask();
    testStats();
    testCLI();
    
    console.log('\n✅ All tests passed!');
    cleanup();
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    cleanup();
    process.exit(1);
  }
}

runTests();
