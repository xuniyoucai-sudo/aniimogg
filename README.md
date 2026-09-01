# Aniimo GG

Aniimo 英文、简体中文与日文非官方玩家攻略站。当前为上市前内容版，游戏资料以官方公开信息为准；正式上线后按版本补充实测攻略。

## 本機預覽

```bash
python3 -m http.server 4173
```

然後開啟 `http://localhost:4173`。

## 当前页面

- 首页、攻略索引、世界地区、FAQ
- 上线倒计时、当地时间换算、PC 内存与存储检查
- 官方动态摘要与 94 条官方 Wiki 图鉴索引
- PS5 预购礼包对比、独立新闻页面与 RSS 订阅
- PS5 无障碍功能指南，以及英文、简中、日文独立 RSS
- 上市准备、核心玩法、资料政策
- 关于、隐私政策、404
- robots、sitemap、llms 与 Cloudflare Pages 安全响应头

## 多语言架构

- English（默认）：`/`
- 简体中文：`/zh-cn/`
- 日本語：`/ja/`

界面和内容翻译位于 `src/locales/`，语言无关的数据位于 `src/data/site.json`。运行 `npm run build` 生成三种语言的静态页面，运行 `npm test` 检查链接、HTML lang、canonical 与 hreflang。

## 发布提醒

静态站点，提交前先运行 `npm run build` 与 `npm test`，Cloudflare Pages 输出目录为 `/`。推送 `main` 会触发线上部署；部署完成后可运行 `npm run submit:indexnow` 提交 sitemap 中的 URL。
