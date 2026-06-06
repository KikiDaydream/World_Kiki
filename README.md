# 博客系统技术文档

## 项目概览

基于 **Vue 3 + Vite** 构建的现代化博客系统，采用前后端分离架构，支持文章管理、分类筛选、Markdown 编辑、JWT 登录认证等核心功能。

| 项目 | 说明 |
|------|------|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite 5 |
| 状态管理 | Pinia |
| 路由方案 | Vue Router 4（动态路由） |
| HTTP 请求 | Axios（请求/响应拦截器） |
| UI 方案 | 响应式设计，PC + 移动端适配 |
| 编辑器 | md-editor-v3 |
| 工具库 | VueUse |
| 单元测试 | Vitest |
| 后端 | Node.js + Express + JWT |

---

## 目录结构

```
blog-system/
├── public/                    # 静态资源
│   └── favicon.ico
├── src/
│   ├── api/                   # API 请求模块
│   │   ├── request.ts         # Axios 封装 + 拦截器
│   │   ├── article.ts         # 文章相关 API
│   │   ├── category.ts        # 分类相关 API
│   │   └── auth.ts            # 认证相关 API
│   ├── assets/                # 样式与静态资源
│   │   ├── styles/
│   │   │   ├── reset.css      # 全局样式重置
│   │   │   ├── variables.css  # CSS 变量（主题色/间距/断点）
│   │   │   └── markdown.css   # Markdown 渲染样式
│   │   └── images/
│   ├── components/            # 通用组件
│   │   ├── AppHeader.vue      # 顶部导航栏
│   │   ├── AppFooter.vue      # 页脚
│   │   ├── ArticleCard.vue    # 文章卡片（列表项）
│   │   ├── CategoryTag.vue    # 分类标签
│   │   ├── SearchBar.vue      # 搜索输入框
│   │   ├── Loading.vue        # 加载状态
│   │   ├── Empty.vue          # 空状态
│   │   └── Pagination.vue     # 分页组件
│   ├── composables/           # 组合式函数
│   │   ├── useAuth.ts         # 登录/登出/令牌管理
│   │   ├── useArticleList.ts  # 文章列表逻辑
│   │   └── useResponsive.ts   # 响应式断点判断
│   ├── layouts/               # 布局组件
│   │   ├── DefaultLayout.vue  # 前台布局
│   │   └── AdminLayout.vue    # 后台布局
│   ├── router/                # 路由配置
│   │   ├── index.ts           # 路由实例 + 动态路由注册
│   │   ├── routes.ts          # 静态路由声明
│   │   └── guard.ts           # 路由守卫（鉴权）
│   ├── stores/                # Pinia 状态仓库
│   │   ├── auth.ts            # 认证状态
│   │   ├── article.ts         # 文章列表/详情状态
│   │   └── category.ts        # 分类状态
│   ├── types/                 # TypeScript 类型定义
│   │   ├── article.ts
│   │   ├── category.ts
│   │   └── user.ts
│   ├── utils/                 # 工具函数
│   │   ├── format.ts          # 日期/文本格式化
│   │   └── constant.ts        # 常量定义
│   ├── views/                 # 页面视图（按模块懒加载）
│   │   ├── front/             # 前台页面
│   │   │   ├── Home.vue       # 首页 -> 文章列表
│   │   │   ├── ArticleDetail.vue  # 文章详情
│   │   │   └── Search.vue     # 搜索结果
│   │   └── admin/             # 后台页面
│   │       ├── Dashboard.vue      # 后台首页
│   │       ├── ArticleList.vue    # 文章管理列表
│   │       ├── ArticleEditor.vue  # 文章发布/编辑（MD编辑器）
│   │       └── CategoryManage.vue # 分类管理
│   ├── App.vue                # 根组件
│   └── main.ts                # 入口文件
├── server/                    # 后端（Express）
│   ├── config/
│   │   └── db.js              # 数据库配置
│   ├── middleware/
│   │   ├── auth.js            # JWT 鉴权中间件
│   │   └── errorHandler.js    # 统一错误处理
│   ├── models/
│   │   ├── User.js            # 用户模型
│   │   ├── Article.js         # 文章模型
│   │   └── Category.js        # 分类模型
│   ├── routes/
│   │   ├── auth.js            # 登录/注册路由
│   │   ├── articles.js        # 文章 CRUD 路由
│   │   └── categories.js      # 分类 CRUD 路由
│   ├── app.js                 # Express 入口
│   └── package.json
├── .env                       # 环境变量
├── .env.production            # 生产环境变量
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
└── vercel.json / netlify.toml # 部署配置
```

---

## 功能模块详解

### 前台系统

#### 文章列表

- 分页加载，每页 10 篇
- 文章卡片展示：标题、摘要、封面图、发布日期、分类标签、阅读量
- 支持按分类筛选（`?category=slug`）
- 支持搜索关键词（`?keyword=xxx`）
- 空状态与加载骨架屏


#### 文章详情

- 渲染 Markdown 内容（使用 md-editor-v3 的预览模式）
- 展示文章元信息：作者、发布时间、分类、阅读量
- 上下篇文章导航
- 响应式排版（移动端字体/间距适配）

####分类筛选

- 侧边栏/顶部展示全部分类列表
- 点击分类切换，URL 参数更新，触发重新请求
- 当前高亮分类标识

#### 搜索

- 防抖搜索输入（`useDebounce` from VueUse）
- 搜索结果独立页面，支持分页
- 无结果展示空状态提示

###  后台系统

#### 文章管理

| 功能 | 说明 |
|------|------|
| 文章列表 | 表格展示，支持按状态/分类筛选 |
| 发布文章 | 使用 md-editor-v3 编辑器，支持实时预览 |
| 编辑文章 | 加载已有内容到编辑器 |
| 删除文章 | 二次确认后删除 |
| 草稿保存 | 支持存为草稿/直接发布 |
---

## 加分项实现

### VueUse 工具函数使用

| 工具函数 | 使用场景 |
|----------|----------|
| `useStorage` | 持久化 token 到 localStorage |
| `useDebounce` | 搜索输入防抖 |
| `useTitle` | 动态设置页面标题 |
| `useMediaQuery` | 响应式断点判断 |
| `useDateFormat` | 日期格式化显示 |
| `useClipboard` | 复制文章链接 |
| `useEventListener` | 监听键盘快捷键（Ctrl+S 保存） |


## 性能优化

| 措施 | 实现方式 |
|------|----------|
| 路由懒加载 | `() => import()` 动态导入 |
| 组件懒加载 | `defineAsyncComponent` |
| Vite 分包 | `rollupOptions.output.manualChunks` |
| 图片懒加载 | `v-lazy` 指令或 IntersectionObserver |
| 请求缓存 | 文章列表缓存 + 条件请求（If-Modified-Since） |
| 防抖搜索 | `useDebounce` 500ms |
| 虚拟列表 | 文章列表过长时使用 `vue-virtual-scroller` |

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动后端
cd server && npm install && npm run dev

# 运行测试
npm run test

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 项目依赖

```json
{
  "dependencies": {
    "vue": "^3.4",
    "vue-router": "^4.3",
    "pinia": "^2.1",
    "axios": "^1.7",
    "md-editor-v3": "^4.0",
    "element-plus": "^2.7",
    "@vueuse/core": "^10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0",
    "vite": "^5.4",
    "typescript": "^5.4",
    "vitest": "^1.6",
    "unplugin-auto-import": "^0.17",
    "unplugin-vue-components": "^0.26",
    "sass": "^1.77"
  }
}
```

---

