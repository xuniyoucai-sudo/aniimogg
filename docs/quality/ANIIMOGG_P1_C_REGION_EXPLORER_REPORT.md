# ANIIMOGG P1-C Region Explorer 实施与发布报告

核验日期：2026-11-12（Asia/Shanghai）。最终状态：**DEPLOYED_WITH_WARNINGS**。

## 发布结果

- 正式页面：[EN](https://aniimogg.com/map/) · [简中](https://aniimogg.com/zh-cn/map/) · [繁中](https://aniimogg.com/zh-tw/map/) · [日本語](https://aniimogg.com/ja/map/)。保留原 URL 和 noindex,follow 策略。
- 合并前 main：`05a93baec8171ef82a87e42e01bd01a11fdebafc`；正常 fast-forward 后功能提交：`3538b3f2dc14bc472a0bc1a5996719e27c2a97a4`。
- 独立分支：`codex/aniimogg-p1-c-region-explorer`，保留远程分支。功能提交链：`61f01a2` → 官方任务补充 `82a12a1` → 初始化门禁修复 `3538b3f`；无 force push、rebase 或历史改写。
- Preview：https://ef7e0638.aniimogg.pages.dev；部署 ID：`ef7e0638-f58e-4fb5-b9a7-fff38389fac0`。Cloudflare 控制台明确显示 Preview、独立分支、完整来源 SHA 和 success；GitHub Actions 43144120799 成功。
- Production：https://a223016b.aniimogg.pages.dev；部署 ID：`a223016b-cc93-4666-8302-c49a63ad6830`。Cloudflare 控制台明确显示 Production、main、功能提交 SHA 和 success；正式域名仍为 aniimogg.com / www.aniimogg.com。生产 GitHub Actions 见 `production/github-actions.json`。
- 回滚基线：`515cbf42-67cc-4443-8ddc-d1ad4c3b4729` / 提交 `05a93ba`。本次未发生回滚。
- 本报告绑定上述功能部署。后续仅报告归档提交不改变应用产物；最终 main HEAD、归档部署及正式域名报告字节校验保存在 `final-document-deployment.json`，避免报告自身引用提交 SHA 的循环。

## 官方来源与可追溯核验

1. [官方 Wiki](https://wiki.aniimo.com/) 的 countryNames 地区筛选，以及 130 个可见形态各自的官方详情页。英文字段与地区标签均从实际 SSR JSON 解码，不从站内 indexGroupId 推断。
2. [2026-10-27 官方更新公告](https://www.aniimo.com/newslist/detail/100244)：Whisperwake Isles 四个地图区域、生态与代表家族、Mirrorsea Village、相关故事和限定 Prismana 地点。
3. [2026-11-09 官方公告](https://www.aniimo.com/newslist/detail/100298)：11 月 12 日更新预告中的 Crescent Bay 故事；公告日期、计划更新日期和核验日期分别保存，不据此声称维护完成或任务已在所有服务器开放。
4. 简中 https://wiki.yimo.com/ 、繁中 https://wiki.aniimo.com/tw 、日文 https://wiki.aniimo.com/ja 的官方 countryNames 标签，按同一官方 tagKey 对齐名称。

`scripts/verify-region-sources.mjs` 实际访问 130 个详情页，最多 3 并发。逐条对齐 entityId、sourceRecordId、详情 URL、详情自身记录 ID、名称/形态；检查官方列表 searchKey.countryId = 详情 searchKey.countryId = aniimoInfo.formData.countryId，再通过官方地区筛选标签解析含义。编号不是主键，本地 indexGroupId 也不是地区映射依据。

原始核验材料存于 `src/fixtures/regions/`，完整 SHA-256 和匹配方法存于 `src/data/aniimo-regions.json` 的 associations / sourceEvidence；`scripts/check-regions.mjs` 自动重读来源 fixture 并校验全部 130 条身份、地区字段、来源字节、分类和层级。公开 Wiki 未给出已核实游戏版本的记录保留 gameVersion=UNKNOWN。

## 地区层级与数据边界

- World：Idyll。
- Major Region：Breezy Plains、Whisperwake Isles。Breezy Plains 未补造任何下级地图区域。
- Whisperwake Isles 的 Map Region 只有 Crescent Bay、Rosy Mirelands、Wildwater Gorge、Cloudreach Falls 四个。
- Sub-location：Mirrorsea Village，公告提供 Crescent Bay 关联。
- Story location：Skytear Rift，parentRegionId=null，地理层级 UNKNOWN；不是第五个地图区域。
- Collection category：Season 1 Keepsakes，独立于地理树。
- Event location：Tideblossom Coast、Sea of Flowers、Russet Highlands、Echoback Landing，parentRegionId=null；只保存公告语境、Prismana 提及、当地服务器活动期间及 Europe UTC+0 / Americas UTC−4 / APAC UTC+8。不把斜线并列地点解释为已确认的父子地理关系，也不开发活动中心或推断当前活动状态。

公告代表家族分别是 Bubbeep、Sugarfish、Saws/Prawnch、Jeglid。它们只在“代表家族”栏出现，不自动转成具体形态归属、完整分布或独占栖息地。Rosy Mirelands 的 Tale of Salabask Forest 根据公告明确关联；未确认的故事字段保持空，未创建空攻略页面。

|130 条形态核验结果|数量|口径|
|---|---:|---|
|Breezy Plains|82|Wiki 明确的大区域关联|
|Whisperwake Isles|29|Wiki 明确的大区域关联|
|Season 1 Keepsakes|17|收藏分类，地理归属 UNKNOWN|
|官方地区字段未匹配到筛选标签|2|地理归属 UNKNOWN|
|已确认具体 Map Region 的形态|0|不把家族公告当逐形态证据|

全部 130 条均完成来源身份核对；其中 111 条有已确认的大区域关联，19 条地理 UNKNOWN。不能将此写成“130 条地理分布已确认”。

### UNKNOWN 记录

|entityId|sourceRecordId|官方名称|官方字段标签|
|---|---|---|---|
|ag-0afba9734d9e50f6|10008966|Jaguaraun|Season 1 Keepsakes|
|ag-0d6946da460c8a4d|10008857|Fulmintis|Season 1 Keepsakes|
|ag-1c799e6799252ce6|10008912|Inferlupa|Season 1 Keepsakes|
|ag-21b6b3c01ba6c263|10008891|Hoptail|Season 1 Keepsakes|
|ag-2e2dd7c6975a0285|10008887|Lunara|UNKNOWN|
|ag-358fccfedc40790f|10008801|Helion|UNKNOWN|
|ag-5dc70a2de26032b4|10008867|Pouchwisp|Season 1 Keepsakes|
|ag-640a178404817a8b|10008830|Ekrim|Season 1 Keepsakes|
|ag-659f03cf54aa8301|10008809|Irisalis|Season 1 Keepsakes|
|ag-6a07ad8e2830f593|10008936|Royalby|Season 1 Keepsakes|
|ag-6f86b4dd7fe65bbc|10008927|Sparkelf|Season 1 Keepsakes|
|ag-715000c132310b33|10008897|Jeburst|Season 1 Keepsakes|
|ag-7bd36740dae0a9f5|10008855|Infergon|Season 1 Keepsakes|
|ag-ad19bf83f75db68e|10009049|Hypnyto|Season 1 Keepsakes|
|ag-ba1ab01327d9cc7a|10008920|Glynsera|Season 1 Keepsakes|
|ag-bbf2e91b026072e8|10008831|Glameep|Season 1 Keepsakes|
|ag-bff87023a182590b|10008800|Melloblum|Season 1 Keepsakes|
|ag-f3308c6d64f9f007|10009036|Waleetle|Season 1 Keepsakes|
|ag-fc3d8d8fc6b4d509|10008895|Dazmand|Season 1 Keepsakes|

### 官方名称覆盖

|地区|EN|简中|繁中|日本語|
|---|---|---|---|---|
|Breezy Plains|Breezy Plains|风吻平原|風吻平原|ソヨカゼ 平原|
|Whisperwake Isles|Whisperwake Isles|潮音群岛|潮音群島|シオサイ群島|
|Crescent Bay|Crescent Bay|English fallback|English fallback|English fallback|
|Rosy Mirelands|Rosy Mirelands|English fallback|English fallback|English fallback|
|Wildwater Gorge|Wildwater Gorge|English fallback|English fallback|English fallback|
|Cloudreach Falls|Cloudreach Falls|English fallback|English fallback|English fallback|

两个大区域共 8/8 个语言名称有官方标签证据。四个地图区域的英文名称 4/4 有公告证据；其他语言未核实官方名称，各自使用 4/4 英文回退，不将本站翻译当成官方名称。日文官方标签中的换行仅在显示时规范为空格，来源原值保留。新描述与 UI 四语言分别编写，明确标注本站编辑摘要，没有用机械简繁转换生成新功能文案。

## 页面实现与整合

- 地区卡片分层导航、地区名称搜索、元素/定位多选 OR，地区与其他维度 AND；Basic/Prismana、已确认/UNKNOWN 完整性筛选、清除、结果数及零结果状态。
- 原 Map 静态页面上升级，无额外地区索引 URL；HTML 不内嵌 130 张角色卡片。地区 JSON 与既有 Team 数据投影仅在地区页按需请求，首屏渲染 20 张，继续加载每次 20 张。
- 复用 `aniimo-model.js` 的筛选与名称规则和现有规范化角色投影。角色属性不在地区文件另建维护副本；地区文件只存关联及其证据、官方图片引用。卡片展示现有角色名称、编号、元素、定位、形态、图片；图片失败有占位。
- Compendium：`#entity=稳定ID` 直接打开原详情，仍使用同一收藏与比较模块。
- Team Builder：公开形态 ID 通过既有版本化片段协议进入导入预览；不提前写入。可明确选择新增清单或追加到当前清单。追加去重，保留原成员/未知 ID/名称/清单 ID/其他清单；不读取或改动收藏。保留现有原子存储、备份与冲突机制。
- Preview 暴露的旧 Team 初始化时序问题已修复：初始操作按钮禁用，真实数据与本地状态完成后启用；事件门禁阻止提前访问 undefined state，初始化前的 storage 事件不会调用未建立的存储对象。慢 JSON 实际服务器测试验证，不通过禁用缓存绕过。
- 地区来源、故事公告日期、更新日期、限定地点时间窗与核验日期分别显示。已有 Homeland/RV 指南含历史地名，相关链接明确提示地区层级以本页新核验结果为准；没有伪造专属指南。
- 没有可靠地图素材时使用明确占位和结构化导航，不绘制假地图、坐标、捕捉点、资源点、宝箱或传送点。

## 验证结果

|检查|结果与证据|
|---|---|
|官方当前角色索引|130 可见形态，无差异；`official-index.log`|
|本地 audit:local / diff|通过；`final-prepreview-audit.log`、`main-prepush-audit.log`；320 HTML 资源引用/SHA/MIME/幂等、原性能预算、130 条官方来源自动核对|
|原图鉴完整本地回归|100 原交互、52 实际页面加载、312 页 DOM/SEO、8 损坏存储、旧/新缓存 fixture、84 Compendium、48 本地化/移动端场景通过；`regression.log`|
|Team 最终回归|8 双引擎四语言交互、56 存储/导入、240 CPU4x 采样及隐私检查通过；`team-startup-regression.log`|
|真实慢 JSON 启动|8 双引擎四语言场景通过；`local-startup-regression/startup-browser.json`；普通缓存头、真实服务器延迟，非浏览器拦截|
|本地（完整控制器矩阵）|24 地区场景 + 8 清单保留场景；站内错误 0，已归因第三方告警 0，实际资源哈希/MIME 264 次；`local-accepted/regions-browser.json`|
|最终 Cloudflare Preview|24 地区场景 + 8 清单保留场景；站内错误 0，已归因第三方告警 2，实际资源哈希/MIME 264 次；`preview-accepted/regions-browser.json`|
|正式生产|24 地区场景 + 8 清单保留场景；站内错误 0，已归因第三方告警 11，实际资源哈希/MIME 264 次；`production/regions-browser.json`|
|Preview/生产资源全站关键页|各 16 页（四语言首页/图鉴/队伍/地区），manifest 与浏览器实际 SHA-256/MIME 一致；`preview-accepted-assets/asset-network.json`、`production-assets/asset-network.json`|
|正式 URL 集合|原 Sitemap 168 条集合完全相同；另检查四语言 Map 和 Team 共 8 页，总 176 页，HTTP/最终 URL/canonical/hreflang/元信息/JSON-LD/实际正文与提交一致；`production/http-results.json`|
|线上基础与重定向|4 RSS、robots、ads、sitemap、真实 404、19 旧路径重定向通过；同上|
|响应式|两引擎、四语言、390×844 / 768×1024 / 1265×712；无页面级横向溢出；详情跳转、真实按钮点击、列表分页、图片占位和清单追加正常|
|SEO|canonical 为正式域名，hreflang 四语言+x-default，JSON-LD 可解析，保留 noindex；不把筛选参数或片段新增进 Sitemap|

本地完整地区矩阵最初针对 61f01a2；82a12a1 唯一数据变化为已核实 Rosy 故事，四语言本地浏览器补测通过（`story-only-delta.json`、`local-story-check.json`）。3538b3f 的启动门禁按上述完整 Team 回归重测；最终 Preview 与正式环境完整矩阵均针对 3538b3f 的真实资源。

初期测试失败记录完整保留：片段内跳转没有触发重载的测试路径问题、离开尚未完成加载的中转页导致 WebKit 取消请求，以及真实 Team 未就绪操作问题。前两项通过等待真实页面就绪修正测试流程；第三项修复产品代码。前两次 Preview 的 CI/部署成功未被写成浏览器验收成功。最终验收不使用 force click、关闭缓存或清理 CDN 缓存。

真实手机、原生 iOS/Android 键盘与设备 Core Web Vitals 未测，不声称通过；本次为真实 Chromium/WebKit 的触屏/视口模拟及实验室 CPU 限速。

## 性能和内容哈希

|预算|实际字节|上限字节|
|---|---:|---:|
|地区全部 JS（含共享依赖）|16654|20000|
|地区全部 CSS|40433|50000|
|地区 JSON（含 130 条来源证据）|160470|200000|
|既有 Team 全部 JS|19339|20000|
|既有 Compendium 全部 JS|18068|20000|

没有放宽既有共享 CSS/JS、四语言图鉴 250000 字节、首页和长文章 75000 字节预算。Team CPU4x 的 4 语言共 240 次交互采样通过原 p95≤100ms / max≤250ms / twoFrames≤500ms 门禁，原始采样见 `team-startup-regression/performance.json`，不等同真实设备 CWV。

SHA-256 全长记录于 manifest，URL 取前 16 个十六进制字符。模块依赖先替换为各自哈希 URL，再计算消费者最终字节；重复构建 URL 稳定，JS/CSS 内容变化和依赖传播自动测试。旧哈希文件与固定路径兼容资源均保留。

|资源|真实 URL|字节|完整 SHA-256|
|---|---|---:|---|
|app|`/assets/app.b96363d22f96b1cc.js`|4698|`b96363d22f96b1cc1405a85288fec893833185fd6d5c40f36933b59dd1491b42`|
|styles|`/assets/styles.288009fffafd2cd8.css`|12558|`288009fffafd2cd8f9b555ddeb1ee8c60d68316dadb03305c6931aeb87e2a85c`|
|siteContent|`/assets/site-content.158791c3936aab15.css`|22612|`158791c3936aab15194941f6542d0a3a4205bf7d502e3bac6cd25bb15fda9ca7`|
|accessibility|`/assets/accessibility.a871e57e6a0e32fd.css`|2384|`a871e57e6a0e32fdf0dcd90e1c860e1176323e3c384c5dbe4c32f50054533370`|
|aniimoModel|`/assets/aniimo-model.f4a49d2696e16024.js`|791|`f4a49d2696e1602484fc8e80c3f33cabff041c444edc09c499449bb96e7e4374`|
|teamModel|`/assets/team-model.236e085dbfd8cffc.js`|4807|`236e085dbfd8cffcd46fc27b7a6ad1a648829399ac331ab8ed7f9e4ce913f4a3`|
|team|`/assets/team-builder.323df4217f9925a4.js`|13741|`323df4217f9925a40534d9e3fe81f06d51773f87d215cb225a8b53cf9a9e6a6b`|
|teamStyle|`/assets/team-builder.a311168c4168b525.css`|2541|`a311168c4168b525893653804de53ffb63857eb71878790d9bb057841700e29a`|
|compendium|`/assets/compendium.f4d9608718db6afc.js`|12579|`f4d9608718db6afc896acc2649a760021e7f4da69fe2e24edc9aa76a92277333`|
|compendiumStyle|`/assets/compendium.2150cc3a6675131a.css`|6232|`2150cc3a6675131a4ac765825537275d29b8c133f321612f80f327d03af504a8`|
|regionModel|`/assets/region-model.2d29e99c941f51c2.js`|578|`2d29e99c941f51c2dfdb778aabc1645a174696d8845c3c832f2cb5e96e96576a`|
|region|`/assets/region-explorer.2856619cc786440e.js`|5780|`2856619cc786440e7d8d7870be8813b2347f8cb1dc8b03a2019bbbd88c151c7c`|
|regionStyle|`/assets/region-explorer.701117ae199d7c66.css`|2879|`701117ae199d7c664857f18ef342150baf887638e5ec0b9bee393bf0075b9441`|
|teamData|`/assets/team-data.9e4a44a29af74a00.json`|51619|`9e4a44a29af74a008f7b3b22e25565fa441e114e507156aca6510de6e171f8d4`|
|regionData|`/assets/region-data.28416010e702fc06.json`|160470|`28416010e702fc06ac3bf26c5ee33c0419dc8c8f23cc2be532a4a3ff621f2e5d`|

## 生产保护与证据限制

- `_headers`、ads.txt、robots.txt、sitemap.xml、原始 aniimo-index.json 字节与发布前一致；AdSense publisher ID、广告脚本策略不变，无依赖/锁文件变更。
- 正式域名前后安全响应头只读对比一致；CSP 若实际缺席则按“前后均缺席”记录，不虚构已配置 CSP。详见 `production/protection.json`。
- 未修改 DNS、域名绑定、Pages 设置、Cloudflare Cache/Page/Transform Rules，未清理生产缓存，未关闭浏览器缓存。DNS 查询记录和 Pages 别名只读核对，不冒充全区 DNS 审计。
- 未增加后端、数据库、付费 API、登录或云同步；没有 IndexNow/Search Console/Bing 提交，也不声称已收录。
- 第三方告警逐条保留并归因；未知或本站脚本错误仍阻断。站内错误 0 不等于全浏览器第三方告警为 0。
- 旧测试归档问题：三份遗留脚本原先忽略 TEAM_ARTIFACTS，本轮早期结果写入旧 P1-B/local。storage 结果与旧备份字节完全相同；性能原件已从既有备份恢复。本地 P1-B 最终 privacy capture 被覆盖且无精确备份，当前该文件不得作为 P1-B 发布证据；较早 P1-B 备份、原报告及生产证据未改。已修复三份脚本按任务目录归档；详情见 `artifact-provenance-note.json`，本轮最终结果在 `team-startup-regression/`。

## 未解决信息与最终状态

19 条形态地理 UNKNOWN、4 个子区域尚无逐形态证据、部分地图名称暂无已核实的官方本地化、缺少可靠地图底图，均按事实边界保留。既有指南的历史地名已在链接处提示。第三方运行告警与旧本地隐私证据归档缺口记录如上。没有待修复的本次站内交互或第一方核心资源故障，没有回滚。

**DEPLOYED_WITH_WARNINGS**：已完成开发、本地验证、独立 Preview、正式生产发布与线上验收；警告不被改写为未核实的数据或“全部设备通过”。
