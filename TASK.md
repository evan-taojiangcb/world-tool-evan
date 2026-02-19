# 浏览器单词高亮插件开发任务

## 项目概述
开发一款 Chrome 浏览器插件（Manifest V3），用于在浏览英文网页时对单词和短语进行高亮标记、收藏、查询。

## 工作目录
/Volumes/HS-SSD-1TB/works/word-tool-evan

## Git 仓库
https://github.com/evan-taojiangcb/world-tool-evan.git

## 技术栈
- React 18 + TypeScript
- Vite + @crxjs/vite-plugin
- Ant Design + Tailwind CSS
- Jotai 状态管理
- IndexedDB (via localForage)
- 后端：Next.js API Routes + Serverless Framework + AWS DynamoDB

## 核心功能（P0 优先级）

### 1. 首次启动
- 安装后首次打开插件弹窗，提示输入用户名
- 存储到 chrome.storage.local

### 2. 文本选择触发
- 鼠标划选文本后，在选区附近出现悬浮按钮
- 双击单词后，在该单词附近出现悬浮按钮
- 忽略输入框、文本域内的选择

### 3. 悬浮按钮
- 圆形图标按钮，点击后打开单词详情弹窗
- 点击按钮、点击页面其他区域、滚动页面时消失

### 4. 单词详情弹窗
- 顶部：单词文本 + 收藏星形按钮（实心/空心）
- 中部：英式音标和美式音标，配有发音按钮
- 下部：释义（按词性分组）+ 例句
- 弹窗可拖动

### 5. 收藏与高亮
- 点击星形收藏/取消收藏
- 收藏后页面中所有该单词实例被高亮（浅黄色背景）
- 使用 `<mark>` 标签包裹
- MutationObserver 监听 DOM 变化

### 6. 点击高亮单词
- 点击高亮单词后，再次弹出详情弹窗

## P1 优先级功能
- 收藏列表管理页面（删除、导出 CSV/JSON）
- 跨设备同步（用户名作为标识）
- 离线缓存

## 数据结构
```json
{
  "word": "example",
  "phonetic": {
    "uk": "ɪɡˈzɑːmpəl",
    "us": "ɪɡˈzæmpəl"
  },
  "audio": {
    "uk": "https://...",
    "us": "https://..."
  },
  "definitions": [
    {
      "partOfSpeech": "noun",
      "definition": "a thing characteristic of its kind",
      "example": "This is a good example.",
      "translation": "这是一个好例子。"
    }
  ],
  "collectedAt": 1645564800000
}
```

## API 端点
- GET /api/word?word=xxx - 查询单词
- GET /api/collections - 获取收藏列表
- POST /api/collections - 批量同步收藏
- DELETE /api/collections/[word] - 删除收藏

## 测试要求
- 使用 Playwright 进行 E2E 测试
- Jest + React Testing Library 进行单元测试
- 测试不通过不能休息，要保证质量

## 设计稿
使用 Stitch MCP 获取设计稿：
- Project Title: Extension Toolbar Popup Menu
- Screen 1: In-Page Word Definition Popover

请开始开发，首先创建项目结构，然后实现核心功能。