function printHelp() {
  console.log(`
📋 Task Manager - CLI Usage

Commands:
  add, a <description>     Add a new task
    Options:
      --priority high|medium|low   Set priority (default: medium)
      --category <name>            Set category (default: general)
  
  list, ls, l [--all]      List tasks (default: active only)
  
  complete, done, c <id>   Mark task as completed
  
  delete, del, d <id>      Delete a task
  
  stats, s                 Show task statistics
  
  help                     Show this help message

Examples:
  task add "Learn GitHub Actions" --priority high
  task add "Review code" --category work --priority medium
  task list
  task complete 1
  task delete 2
  task stats
`);
}

function printTasks(tasks) {
  if (tasks.length === 0) {
    console.log('📭 No tasks found');
    return;
  }

  console.log('\n📋 Tasks:');
  console.log('-'.repeat(60));
  
  tasks.forEach(task => {
    const status = task.completed ? '✅' : '⬜';
    const priority = getPriorityEmoji(task.priority);
    const id = task.id.toString().padStart(3, ' ');
    console.log(`${status} ${id} ${priority} [${task.category}] ${task.description}`);
  });
  
  console.log('-'.repeat(60));
  console.log(`Total: ${tasks.length} tasks\n`);
}

function getPriorityEmoji(priority) {
  switch (priority) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

function printStats(stats) {
  console.log('\n📊 Task Statistics');
  console.log('='.repeat(30));
  console.log(`Total tasks:    ${stats.total}`);
  console.log(`Active:         ${stats.active}`);
  console.log(`Completed:      ${stats.completed}`);
  console.log('');
  console.log('By Priority (active):');
  console.log(`  🔴 High:   ${stats.byPriority.high}`);
  console.log(`  🟡 Medium: ${stats.byPriority.medium}`);
  console.log(`  🟢 Low:    ${stats.byPriority.low}`);
  console.log('');
  
  if (stats.total > 0) {
    const completionRate = ((stats.completed / stats.total) * 100).toFixed(1);
    console.log(`Completion rate: ${completionRate}%`);
  }
  console.log('');
}

module.exports = { printHelp, printTasks, printStats };
