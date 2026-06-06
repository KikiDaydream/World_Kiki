const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')

const DB_PATH = path.join(__dirname, '..', 'blog.db')

let db

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initTables()
    seedData()
  }
  return db
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT,
      avatar TEXT,
      title TEXT DEFAULT '博主',
      bio TEXT DEFAULT '',
      location TEXT DEFAULT '',
      website TEXT DEFAULT '',
      github TEXT DEFAULT '',
      twitter TEXT DEFAULT '',
      skills TEXT DEFAULT '[]',
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      summary TEXT,
      cover TEXT,
      categoryId INTEGER,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      viewCount INTEGER DEFAULT 0,
      userId INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `)
}

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (userCount.count === 0) {
    const hashed = bcrypt.hashSync('123456', 10)
    db.prepare(`
      INSERT INTO users (username, password, nickname, title, bio, location, website, github, twitter, skills)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admin', hashed, 'Kiki',
      '全栈开发者 & 设计爱好者',
      '热爱编程、阅读和户外运动。专注于 Web 开发，喜欢用 Vue 和 Node.js 构建美好的产品。这里记录我的学习笔记和生活思考。',
      '中国 · 上海',
      'https://github.com/kiki',
      'kiki-dev',
      'kiki_blog',
      JSON.stringify(['Vue', 'React', 'Node.js', 'TypeScript', 'CSS', 'Python'])
    )
  }

  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get()
  if (catCount.count === 0) {
    const insertCat = db.prepare(
      'INSERT INTO categories (name, slug, description, sortOrder) VALUES (?, ?, ?, ?)'
    )
    insertCat.run('技术', 'tech', '技术相关文章', 1)
    insertCat.run('生活', 'life', '生活随笔', 2)
    insertCat.run('随笔', 'essay', '日常感悟', 3)
    insertCat.run('项目', 'project', '项目经验分享', 4)
  }

  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get()
  if (articleCount.count === 0) {
    const insertArticle = db.prepare(
      `INSERT INTO articles (title, content, summary, categoryId, status, viewCount, userId, createdAt)
       VALUES (?, ?, ?, ?, 'published', ?, 1, ?)`
    )
    insertArticle.run(
      '欢迎使用博客系统',
      '# 欢迎使用博客系统\n\n这是一篇示例文章，展示了 Markdown 编辑器的功能。\n\n## 功能特性\n\n- 支持 Markdown 语法\n- 代码高亮\n- 整洁的界面\n\n```javascript\nconsole.log("Hello, Blog!")\n```\n\n> 享受写作的乐趣！',
      '这是一篇示例文章，展示了博客系统的核心功能。', 1, 128, '2026-05-01 10:00:00'
    )
    insertArticle.run(
      'Vue 3 组合式 API 入门',
      '# Vue 3 组合式 API 入门\n\nVue 3 引入了 Composition API，让我们可以更灵活地组织组件逻辑。\n\n## setup 函数\n\n```vue\n<script setup>\nimport { ref, onMounted } from \'vue\'\n\nconst count = ref(0)\n\nonMounted(() => {\n  console.log(\'组件已挂载\')\n})\n</script>\n```\n\n## 响应式核心\n\n- `ref()`: 用于基本类型和对象\n- `reactive()`: 用于对象\n- `computed()`: 计算属性\n- `watch()`: 监听变化',
      'Vue 3 Composition API 的核心概念和使用方法。', 1, 56, '2026-05-10 14:30:00'
    )
    insertArticle.run(
      '周末徒步记',
      '# 周末徒步记\n\n周末和朋友们一起去爬山，感受大自然的美好。\n\n## 路线\n\n从山脚出发，沿着石阶一路上行，沿途风景优美。\n\n## 感受\n\n- 空气清新\n- 身心放松\n- 朋友相聚的快乐\n\n期待下一次的徒步之旅！',
      '记录周末徒步的自然风光与内心感受。', 2, 32, '2026-05-15 08:00:00'
    )
  }
}

module.exports = { getDb }
