# 欢迎使用笔记博客

这是一个轻量级的Markdown笔记博客系统，专为GitHub Pages设计。

## 特性

- 📝 **纯静态** - 无需服务器，直接部署到GitHub Pages
- 🎨 **简洁美观** - 清爽的阅读体验
- 🚀 **零构建** - 无需npm、webpack等构建工具
- 📱 **响应式** - 支持移动端访问
- 🌈 **代码高亮** - 内置highlight.js支持

## 快速开始

### 1. 添加新文章

在 `posts/` 目录下创建新的 `.md` 文件：

```markdown
# 我的新文章

这是文章内容...
```

### 2. 更新配置

编辑 `js/config.js`，在 `posts` 数组中添加新文章：

```javascript
posts: [
    {
        title: '我的新文章',
        file: 'my-new-post.md',
        date: '2024-01-03'
    }
]
```

### 3. 部署到GitHub Pages

1. 将代码推送到GitHub仓库
2. 进入仓库设置 → Pages
3. 选择分支（通常是 `main`）并保存
4. 等待几分钟后访问 `https://你的用户名.github.io/仓库名/`

## 目录结构

```
note-md/
├── index.html      # 主页面
├── css/
│   └── style.css   # 样式文件
├── js/
│   ├── app.js      # 主应用逻辑
│   └── config.js   # 文章配置
├── posts/          # Markdown文章目录
│   └── *.md
└── README.md       # 项目说明
```

## 开始写作吧！

现在你可以开始创建自己的笔记了。祝写作愉快！ 🎉
