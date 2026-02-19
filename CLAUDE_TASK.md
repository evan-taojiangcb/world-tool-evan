# Chrome 单词高亮插件开发任务

## 项目位置
/Volumes/HS-SSD-1TB/works/word-tool-evan

## 现状
项目已初始化，基础代码已完成，构建和测试都通过了。

## 需要完善
1. 添加 Playwright E2E 测试（在 tests/e2e 目录）
2. 完善代码（如需要）
3. 运行 npm run build 确认构建通过
4. 运行 npm test 确认测试通过

## 技术栈
- React 18 + TypeScript
- Vite + @crxjs/vite-plugin
- Jest + Playwright

## 测试要求
- 使用 Playwright 进行 E2E 测试
- 测试场景：首次启动、双击查询、划选查询、收藏操作、点击高亮单词

请开始添加 Playwright E2E 测试。