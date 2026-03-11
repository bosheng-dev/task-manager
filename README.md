# Task Manager

A simple task management CLI application for learning software development best practices.

## Features

- ✅ Add, list, complete, and delete tasks
- 📁 Persistent storage (JSON file)
- 🏷️ Task categories and priorities
- 📊 Task statistics and reporting

## Installation

```bash
npm install
npm start
```

## Usage

```bash
# Add a task
node cli.js add "Learn GitHub Actions" --priority high

# List all tasks
node cli.js list

# Complete a task
node cli.js complete 1

# Delete a task
node cli.js delete 1
```

## Development

```bash
npm test        # Run tests
npm run lint    # Run linter
```

## License

MIT
