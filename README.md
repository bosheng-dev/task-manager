# Task Manager 🦞

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个简单的命令行任务管理器，用于学习 JavaScript 和 Node.js。

## 功能

- ✅ 添加任务
- 📋 列出所有任务
- ⏳ 查看待办任务
- ✅ 标记任务完成
- 🗑️ 删除任务

## 安装

```bash
git clone <repository-url>
cd task-manager
npm install
```

## 使用

```bash
# 添加任务
node index.js add "学习Git"

# 列出所有任务
node index.js list

# 查看待办任务
node index.js todo

# 完成任务（用序号或ID）
node index.js complete 1

# 删除任务
node index.js delete 1

# 显示帮助
node index.js help
```

## 技术要点

- 文件系统操作（fs 模块）
- JSON 数据持久化
- 命令行参数解析
- 模块化代码结构

## 许可证

MIT © 2026 龙虾1号
