const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clean up test data
function cleanup() {
  if (fs.existsSync(DATA_FILE)) {
    fs.unlinkSync(DATA_FILE);
  }
}

// Test helper
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('🧪 运行测试...\n');

// Clean start
cleanup();

// Test 1: Add task
console.log('测试1: 添加任务');
try {
  execSync('node index.js add "测试任务1"', { stdio: 'pipe' });
  const tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert(tasks.length === 1, '应该有一个任务');
  assert(tasks[0].description === '测试任务1', '任务描述正确');
  assert(tasks[0].status === 'todo', '任务状态为待办');
} catch (e) {
  console.error('❌ 测试1失败:', e.message);
  process.exit(1);
}

// Test 2: Complete task
console.log('\n测试2: 完成任务');
try {
  execSync('node index.js complete 1', { stdio: 'pipe' });
  const tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert(tasks[0].status === 'done', '任务状态变为已完成');
  assert(tasks[0].completedAt !== null, '有完成时间戳');
} catch (e) {
  console.error('❌ 测试2失败:', e.message);
  process.exit(1);
}

// Test 3: Delete task
console.log('\n测试3: 删除任务');
try {
  execSync('node index.js delete 1', { stdio: 'pipe' });
  const tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert(tasks.length === 0, '任务被删除');
} catch (e) {
  console.error('❌ 测试3失败:', e.message);
  process.exit(1);
}

// Cleanup
cleanup();

console.log('\n🎉 所有测试通过！');
