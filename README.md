# Aniimo.GG

独立玩家资料站，提供英文、简体中文、繁体中文和日文版本。当前内容以官方公开资料、带日期的社区报告和编辑建议分别标注，不将来源复核描述为本站游戏内实测。

## 本地预览与检查

```sh
python3 -m http.server 4173 --bind 127.0.0.1
npm run audit:local
npm run check:aniimo-index
npm run test:browser
```

`test:browser` 使用已有的 `playwright` 安装，缺少时明确失败，不自动下载浏览器。非项目安装可通过 `PLAYWRIGHT_MODULE` 指定模块入口，通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定已有 Chromium 可执行文件；本地服务器地址可由 `TEST_BASE_URL` 指定。测试仅允许 localhost/127.0.0.1，不操作生产站或真实用户存储。浏览器回归阻止第三方请求以隔离应用行为，不构成广告/CMP验证。

## 数据与四语言

- English：`/`；简中：`/zh-cn/`；繁中：`/zh-tw/`；日文：`/ja/`。
- 当前官方公开索引快照：2026-11-06，130 条形态记录＝118 Basic＋12 Prismana。记录数不是物种、可获取或已拥有数量。
- 原始八列数据保留于 `src/data/aniimo-index.json`；快照说明在 `aniimo-index-manifest.json`；`scripts/aniimo-snapshot.mjs` 提供稳定实体 ID、目录组与未知关系映射。
- `src/locales/` 保留文章译文，`product-quality.json` 包含独立校对的四语言修复文案与交互反馈。繁中基础文章沿用共享简转繁来源，不能因此声称全站已完成专业母语审校。
- `gift-codes.json` 保存旧来源日期、证据状态及可空期限。7天复核阈值是站内维护规则，不是游戏代码有效期。
- 收藏 v2 使用稳定实体 ID；v1原文保留以便恢复，未知旧 ID 保留并提示。收藏不是游戏拥有状态，不支持账号或跨设备同步；未宣称跨标签实时同步。

## 当前功能范围

图鉴搜索与过滤、图库/表格视图、浏览器本地研究清单；攻略卡片搜索；地区参考摘要；角色比较方法（无排名）；手动 RAM/SSD 最低要求核对；历史新闻/RSS与带来源的更新归档。没有交互组队器、坐标地图、资源计算器或实时服务器监控。

`npm run build` 生成四语言静态页面。canonical/hreflang与既有noindex/sitemap URL策略保持一致。构建不会重新核验游戏事实；页面编辑日、来源检查日和历史公告日分别记录。

本轮 P0 仅本地实施，不执行 commit、push、PR、部署、IndexNow 或生产配置修改。未来发布需按当次用户授权与项目约定运行检查；不要默认重复提交全站 URL。
