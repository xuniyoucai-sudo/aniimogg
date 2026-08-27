# Aniimo GG

《伊莫》繁体中文非官方玩家攻略站。当前为上市前内容基础版，游戏资料以官方公开信息为准；正式上线后按版本补充实测攻略。

## 本機預覽

```bash
python3 -m http.server 4173
```

然後開啟 `http://localhost:4173`。

## 当前页面

- 首页、攻略索引、世界地区、FAQ
- 上市准备、核心玩法、资料政策
- 关于、隐私政策、404
- robots、sitemap、llms 与 Cloudflare Pages 安全响应头

## 发布提醒

静态站点，无构建步骤，Cloudflare Pages 输出目录为 `/`。推送 `main` 会触发线上部署，因此 DNS 准备完成前请勿推送。
