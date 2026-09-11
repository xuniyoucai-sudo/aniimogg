# Aniimo.GG 深度站点策略审计

## 执行摘要

Aniimo.GG 已经具备一个可靠内容站的技术底座：三语言静态页面、规范化 URL、hreflang、自动 Sitemap、独立攻略封面、来源列表、Beta/Official 状态标签、移动端适配和发布后自动验证。当前站点有 129 个生成页面、114 个可索引多语言 URL、23 篇三语攻略、4 篇三语新闻、94 条官方图鉴索引和 69 条 Sitemap 图片记录。核心 CSS 约 27 KB、JavaScript 约 5 KB，静态负载轻，代码库构建与现有自动测试均通过。

下一阶段的主要风险已经不是页面缺失，而是“上线前信息边界、数据模型和发布可靠性”。最高优先级有三项：消除 Article/NewsArticle 重复结构化数据；把只由 PS5 明确的 10:00 UTC+8 倒计时从“PC 与主机统一精确时间”改为更严谨的表达；将每日检查从手动脚本升级为真正的 7:30 定时任务并保留每次报告。随后应围绕上线即时需求建设 Server Status、Codes、Patch Notes 和 Launch Verification 四个持续更新入口。

竞争站点已经大量发布未经正式版验证的 Tier List、团队数据、单体图鉴和“精确”玩法结论。Aniimo.GG 不应跟随这种速度竞争，而应强化“官方来源、核查日期、版本边界、上线后复测”的差异化。官方开发者信明确说明 9 月 16 日为 PC、主机和 Xbox 云游戏上线日期，移动版为 9 月 23 日，并披露了大量正式版改动；但它没有为每个平台分别公布同一个精确解锁小时。[^1]

## 一、现状评估

### 1. 技术健康度

| 项目 | 当前状态 | 判断 |
|---|---:|---|
| 生成 HTML | 129 | 健康 |
| 可索引 Sitemap URL | 114 | 健康 |
| 三语攻略 | 23 × 3 | 已形成基础主题集群 |
| 三语新闻 | 4 × 3 | 数量偏少，尚不足以构成新闻护城河 |
| 官方图鉴索引 | 94 | 与官方可见索引一致 |
| Sitemap 图片 | 69 | 攻略封面覆盖完整 |
| 内部 JS | 约 5 KB | 很轻 |
| 样式总量 | 约 27 KB | 很轻 |
| 默认分享图片 | 约 149 KB | 已优化 |
| 自动化测试 | 130 个正式页面通过 | 良好，但只在本地执行 |

站点对移动端友好，主页和 Launch Center 在 390px 视口没有横向溢出，倒计时与搜索无控制台错误。线上已部署 HSTS、CSP、X-Content-Type-Options、Referrer-Policy、Permissions-Policy 和 X-Frame-Options。

Google 建议页面达到 LCP 2.5 秒以内、INP 200 毫秒以内、CLS 0.1 以下。[^2] 当前静态结构和小体积脚本为此创造了良好条件，但没有 Search Console CrUX 或真实用户监控数据，因此不能把“页面轻”直接等同于已经通过 Core Web Vitals。

### 2. 搜索与信息架构

当前主要主题覆盖完整：上线日期、平台、下载、服务器时间、跨平台、配置、Steam Deck、免费游玩、语言、捕捉、Twine、进化、属性、队伍、地区和新手准备。首页、攻略中心、Launch Center、地图和新闻中心构成清晰的一级入口。

内部链接审计没有发现正式攻略孤岛，但 FAQ 只有一个主要入口，且没有进入顶部导航。旧 `/tools/` 页面仍存在于构建产物中，不过线上通过 301 跳转到 `/launch/`，且没有进入 Sitemap；这在搜索层面是可接受的兼容策略。Google建议 Sitemap 只包含希望出现在搜索结果中的规范 URL，当前做法符合这一原则。[^3]

### 3. 内容可信度

内容最大的优势是证据边界清楚。攻略普遍拥有 2–7 个官方来源，较新的系统型文章约 800–1,200 个英文词。站点避免把封测数值直接写成正式版结论，这一点明显优于部分竞争页面。

当前竞争结果中已经出现：

- 94 只 Aniimo 全量 Tier List；
- 单体图鉴、技能、形态和栖息地页面；
- Codes、Server Status、Patch Notes；
- 互动地图、队伍实验室、成就、物品和蛋数据库；
- 用封测数据写成的精确 PvE/PvP 排名。[^4][^5][^6]

这些页面说明搜索需求方向，但不能直接证明其内容准确。一些竞争结果同时出现“9 月 15 日全球上线”“gacha 已确认”“全平台统一 10:00”等相互矛盾或证据不足的描述。Aniimo.GG 的机会是成为纠错型、版本透明型站点，而不是复制数量。

## 二、关键问题

### P0-1：攻略和新闻存在重复同类型结构化数据

生成器在攻略页先通过通用文档函数输出一份 `Article`，随后又通过 `schemaExtra` 输出包含日期、作者、图片和 mainEntityOfPage 的第二份 `Article`。新闻页同样会输出两份 `NewsArticle`。本地英语页面统计中出现 46 个 Article，而英语攻略只有 23 篇；NewsArticle 为 8 个，而新闻只有 4 篇。

这不是语法错误，因此现有 JSON 解析测试不会发现。但两个未通过 `@id` 关联的同类型实体可能让搜索引擎无法确定哪个才是主实体。Google要求结构化数据必须代表页面主要内容，并建议使用 JSON-LD，但正确性和一致性仍是获得富媒体结果资格的基础。[^7]

建议：通用文档 schema 保持 `WebPage`，攻略只输出一份完整 `Article`，新闻只输出一份完整 `NewsArticle`；或者构建一个带 `@graph` 和稳定 `@id` 的统一对象。新增测试：每个攻略恰好一个顶层 Article，每条新闻恰好一个顶层 NewsArticle。

### P0-2：倒计时精度表达超过官方证据

Launch Center 的目标时间固定为 `2026-09-16T02:00:00Z`，相当于 9 月 16 日 10:00 UTC+8。页面正文已经说明该具体时刻来自 PS5，而其他平台具体小时未确认；但组件标题仍是“PC 与主机版上线倒计时”，首页也把该倒计时视觉上用于全部 PC、主机和 Xbox 云游戏。

官方公告确认日期，但没有在同一证据中为 Steam、Epic、Xbox 和云游戏分别确认同一解锁小时。[^1][^8] 因此页面需要避免让视觉组件覆盖文字免责声明。

建议：倒计时标题改成“已确认的 PS5 上线时刻”；PC/Xbox/Epic 只显示“9 月 16 日，具体时刻待确认”。如果正式公告随后确认同步开放，再统一倒计时。

### P0-3：每日报告并未形成自动闭环

仓库已经有 `npm run report:daily`，但没有 `.github/workflows`、系统任务配置或其他可审计的调度定义。因此它目前是“可手动运行的报告生成器”，不是“每天 7:30 一定执行并通知”的任务。

建议建立一个明确的调度源，并做到：

1. 每天 07:30 Asia/Shanghai 运行官方图鉴差异、构建、站内链接、线上关键 URL、安全头和 Sitemap 检查；
2. 每次生成带时间戳报告；
3. 成功也要输出摘要，失败要列出失败步骤和退出码；
4. 报告提交到仓库或保存在可追溯的任务历史中；
5. 连续失败时通知，而不是静默跳过。

### P0-4：上线当天缺少高频状态入口

上线前五天，用户需求会从“什么时候上线”迅速转向“能不能下载、服务器开没开、为什么进不去、有没有兑换码、版本更新了什么”。当前内容可回答日期与配置，但没有以下稳定 URL：

- `/server-status/`
- `/codes/`
- `/patch-notes/`
- `/launch-check/` 或 Launch Verification 页面

这些页面现在就可以建立，即使答案是“未开放”“没有已确认兑换码”“暂无公开补丁”。透明的空状态比上线后临时建 URL 更利于提前发现和内部链接。竞争站点已经明确布局这些主题。[^5]

## 三、内容增长机会

### 1. 第一阶段：上线意图页

| 页面 | 现在能否发布 | 首版应包含 | 更新频率 |
|---|---|---|---|
| Server Status | 可以 | 官方状态入口、最后检查时间、平台、已知故障、排障边界 | 上线期高频 |
| Codes | 可以 | 当前已确认代码数量、官方来源、兑换入口待确认、诈骗提醒 | 每日/公告触发 |
| Patch Notes | 可以 | 官方公告时间线、版本号、变更分类、来源 | 每次更新 |
| Launch Verification | 可以 | 下载、登录、服务器、跨平台、控制器、无障碍、性能实测清单 | 上线日持续 |
| Platform Stores | 可以 | Steam、Epic、Xbox、PS5、iOS、Android 独立状态 | 每次商店变化 |

其中 Codes 页面必须避免为了抢词而编造代码。可采用“截至日期：官方未发布可验证兑换码”的格式，并只在官方渠道出现后更新。

### 2. 第二阶段：术语和决策支持

社区讨论已经直接提出对“属性、缩写、Aniimo 信息界面和战斗语言”的新手解释需求。[^9] 建议建设三语 Glossary，覆盖 Aniipod、Twine、Potential、Perfect Potential、Prismana、Umbral、Break、Regen、DPS、Egg Heist、Homeland、RV、Wild Surge 等术语。

术语表比继续写泛化长文更有价值：它可为现有 23 篇攻略提供稳定内部锚点，也能在正式版术语变化时集中纠正。

### 3. 第三阶段：图鉴扩展，但不要立即生成 94 个薄页面

当前本地索引只有编号、名称、阶段、定位、属性和官方 Wiki ID。仅用这些字段生成 94 × 3 个页面会产生大量信息重复的薄页面。竞争站点虽然已经批量生成单体页面，但数量不等于搜索质量。

更稳妥的路径：

1. 先发布 9 个属性聚合页与 5 个定位聚合页；
2. 每页包含筛选、定义、官方数量、相关 Aniimo 和玩法边界；
3. 正式版获取技能、基础数值、形态、栖息地和来源后，再生成单体页；
4. 单体页必须拥有独立可回答的问题，而不是只重复表格字段。

### 4. 新闻策略

目前只有 4 篇新闻，且最近一篇为 9 月 3 日。与其把所有攻略复核都包装成新闻，建议只为官方公告、版本更新、服务器维护和平台上线变化发布新闻。

如果正式采用新闻发布节奏，可增加独立 News Sitemap。Google要求 News Sitemap 只保留最近两天创建的文章，并指出独立 Sitemap 更便于在 Search Console 中追踪。[^10] 在没有稳定新闻频率之前，不必为了形式提前添加空 News Sitemap。

## 四、SEO 与搜索展示

### 1. 标题与描述

当前主要标题已经唯一；`launch/index.html` 与构建产物 `tools/index.html` 标题重复，但后者线上 301 且不在 Sitemap，所以不是实际索引冲突。三个过长英文标题已经缩短。

下一步应增加自动测试：

- 可索引页面 title 不重复；
- 英文标题建议不超过约 60–65 个字符，但不要硬性截断中日文；
- description 必须唯一且具体；
- title、H1、og:title 语义一致；
- 页面年份或版本发生变化时能够被检测。

Google明确建议 title 简洁、描述性强、避免重复模板和过长文本，并会综合 title、H1、og:title 与站内外锚文本生成搜索标题。[^11] Meta description 也应按页面独立编写，而不是只靠固定模板。[^12]

### 2. FAQ 结构化数据

站点英语页面拥有 18 份 FAQPage 数据。标记与可见 FAQ 内容一致，因此没有明显违规；但对普通游戏攻略站，它几乎不会产生 FAQ 富媒体展示。Google已将 FAQ 富媒体结果常规展示限制在权威政府与健康网站。[^13]

建议保留可见 FAQ 内容，但降低维护 JSON-LD 的优先级。不要把“新增 FAQ schema”继续当作增长项目，也不要把 FAQ 数量作为 SEO 成果指标。

### 3. 图片策略

攻略页使用独立封面作为 Article image 和 og:image，这是正确方向。Google建议使用与页面相关、具有代表性且高分辨率的图片，避免通用 Logo 或大量文字图片。[^14]

下一步可为新闻页增加独立配图，而不是继续使用全站默认分享图；同时在图片 Sitemap 增加标题或说明不是必要条件，优先保证图片确实与正文对应。

### 4. IndexNow 与 Google 收录预期

IndexNow 提交成功不代表 Google 已收录。Google说明 Sitemap 是发现提示，不保证索引或排名；多数普通站点处理更新可能需要三天或更久。[^15] 因此发布报告应把“IndexNow HTTP 200”“Google 已抓取”“Google 已索引”拆成三个不同状态。

## 五、工程与可靠性

### 1. 增加持续集成

目前测试充分但没有仓库内 CI 定义。建议每次推送和 Pull Request 自动执行：

- JSON 解析；
- `npm run build`；
- `npm test`；
- 生成文件是否与源数据一致；
- title/schema/Sitemap 检查；
- 构建后工作区是否产生未提交差异。

这会避免“本地忘记构建后直接发布”以及生成页面和源数据不一致。

### 2. 报告脚本的失败语义

当前报告脚本检查首页是否存在、Sitemap 数量和数据日期，但没有调用构建测试，也不会因为线上非 200 或数量异常而以非零状态退出。它更像摘要生成器，而不是监控器。

建议拆分：

- `audit:local`：失败即非零退出；
- `audit:live`：检查状态码、canonical、安全头、资源版本和重定向；
- `report:daily`：汇总前两者结果，即使失败也产出报告；
- 报告包含 commit SHA、部署版本、开始/结束时间、耗时、错误和 IndexNow 状态。

### 3. CSP 进一步收紧

当前 CSP 中 `script-src` 包含 `'unsafe-inline'`，主要是为了页面内 JSON-LD。下一步可考虑使用稳定 hash、nonce 或确认非执行型 JSON-LD 在目标浏览器与托管环境下的策略行为后移除 `unsafe-inline`。这属于安全加固，不应在上线冲刺期未经兼容测试直接修改。

### 4. 发布回滚与健康检查

建议每次发布保留：

- 上一个成功 commit；
- 关键页面 smoke test；
- `/`, `/launch/`, `/guides/`, `/sitemap.xml`, `/robots.txt`, `/app.js` 检查；
- 线上 CSP/HSTS 验证；
- 旧 URL 301 验证；
- 一条明确的回滚命令或托管平台回滚步骤。

## 六、30 天执行路线图

### 未来 24 小时

1. 修复 Article/NewsArticle 重复实体。
2. 修正倒计时为 PS5 精确时刻，其他平台保持日期级状态。
3. 将日报脚本变成严格审计并接入 07:30 调度。
4. 增加 CI 构建与测试。
5. 发布 Codes、Server Status、Patch Notes 三个可信空状态页。

### 上线前 2–4 天

1. 发布 Launch Verification 页面。
2. 建立六个平台商店状态矩阵。
3. 发布三语术语表。
4. 对下载、服务器、跨平台与系统要求页每天复核一次，但只有正文实质变化时更新 Sitemap lastmod。Google建议 lastmod 反映主要正文、结构化数据或链接的实际变化，而不是无变化的机械刷新。[^16]

### 9 月 16 日上线日

1. 验证实际下载入口、文件大小、版本号和服务器状态。
2. 记录 Steam、Epic、Xbox、PS5 的实际解锁时间，不倒推为此前已确认事实。
3. 检查账号、角色、跨平台、控制器、字幕、无障碍和性能。
4. 将 Beta 标记逐项升级为 release-tested，禁止批量改标签。
5. 发布第一份正式版变更报告和服务器状态记录。

### 上线后 1–2 周

1. 建属性与定位聚合页。
2. 收集足够字段后再生成单体 Aniimo 页面。
3. 根据真实版本建立队伍、捕捉率、进化与路线数据。
4. 接入 Search Console 与 Cloudflare Analytics，按查询、页面、地区、设备和语言评估内容，而不是用页面数量判断增长。

## 七、优先级评分

| 项目 | 用户价值 | SEO价值 | 风险降低 | 实施量 | 优先级 |
|---|---:|---:|---:|---:|---|
| 修复重复 Article/NewsArticle | 2 | 5 | 5 | 1 | P0 |
| 修正倒计时证据边界 | 5 | 3 | 5 | 1 | P0 |
| 真正启用 07:30 日报 | 4 | 3 | 5 | 2 | P0 |
| CI 构建测试 | 2 | 3 | 5 | 2 | P0 |
| Server Status | 5 | 5 | 4 | 2 | P0 |
| Codes 可信空状态页 | 5 | 5 | 4 | 2 | P0 |
| Patch Notes 归档 | 5 | 5 | 4 | 2 | P0 |
| Launch Verification | 5 | 4 | 5 | 3 | P0 |
| 三语术语表 | 4 | 4 | 3 | 3 | P1 |
| 平台独立状态页 | 4 | 4 | 3 | 4 | P1 |
| Search Console/Cloudflare 接入 | 5 | 5 | 4 | 外部权限 | P1 |
| 属性与定位聚合页 | 4 | 4 | 3 | 4 | P1 |
| 94 个单体页面 | 4 | 5 | 2 | 8 | P2，等待正式数据 |
| 互动地图 | 5 | 5 | 2 | 10 | P2，等待坐标数据 |
| News Sitemap | 2 | 3 | 2 | 2 | P2，等待稳定新闻频率 |

## 结论

Aniimo.GG 目前不需要无目标地增加更多长文章。短期胜负点是：在上线期成为“最快说明什么已经确认、什么仍未确认、什么刚刚实测”的站点。技术上先消除重复结构化数据和倒计时事实边界；运营上把报告、CI 和上线状态页做成持续系统；内容上优先抢占 Codes、Server Status、Patch Notes、术语表和正式版验证，而不是用 Beta 推测填满 94 个薄图鉴页。

这条路线既能利用站点现有的轻量静态架构，也能把“证据透明”转化成与竞争站点可辨识的品牌优势。

## Sources

[^1]: Pawprint Studio. [“A Letter from the Aniimo Dev Team.”](https://aniimo.com/newslist/detail/100064) 2026-09-03.
[^2]: Google Search Central. [“Understanding Core Web Vitals and Google search results.”](https://developers.google.com/search/docs/appearance/core-web-vitals)
[^3]: Google Search Central. [“Build and Submit a Sitemap.”](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
[^4]: Aniimo Guide. [“Aniimo Guide | Aniilog Wiki, Tier List, Teams & News.”](https://aniimoguide.com/)
[^5]: Aniimo Wiki. [“Aniimo Wiki — Creature Encyclopedia & Release Info.”](https://aniimo.wiki/)
[^6]: Aniimos Wiki. [“Aniimo Wiki: Twine, Codes & Creature Guides.”](https://aniimos.wiki/)
[^7]: Google Search Central. [“General Structured Data Guidelines.”](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
[^8]: Pawprint Studio. [“Aniimo Global Launch Dates.”](https://aniimo.com/newslist/detail/100051) 2026-08-26.
[^9]: Reddit r/Aniimo. [“Aniimo interactive map with spawn locations, community tier list and collection tracker.”](https://www.reddit.com/r/Aniimo/comments/1wawmb9/aniimo_interactive_map_with_spawn_locations/) 2026-09-08.
[^10]: Google Search Central. [“Create a News Sitemap.”](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap)
[^11]: Google Search Central. [“Influencing Title Links in Google Search.”](https://developers.google.com/search/docs/appearance/title-link)
[^12]: Google Search Central. [“How to Write Meta Descriptions.”](https://developers.google.com/search/docs/appearance/snippet)
[^13]: Google Search Central Blog. [“Changes to HowTo and FAQ rich results.”](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
[^14]: Google Search Central. [“Image SEO Best Practices.”](https://developers.google.com/search/docs/appearance/google-images)
[^15]: Google Search Central. [“Troubleshoot Google Search Crawling Errors.”](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)
[^16]: Google Search Central Blog. [“Sitemaps ping endpoint is going away.”](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)
