# ANIIMOGG P1-D — Events & Rewards Center

验收日期：2026-11-12。最终状态：**DEPLOYED_WITH_WARNINGS**。五模块已正式发布，未发生回滚。

## 产品与来源

新增四语言 `/events/`，升级原 Codes、Patch Notes URL，导航加入活动中心。五模块包括活动日历、奖励筛选、来源分级兑换码、更新记录、浏览器本地 Checklist。保留已有公告作为折叠历史资料，不创建重复活动详情 URL。

来源于本轮重新读取的官方 [100298（11月9日）](https://www.aniimo.com/newslist/detail/100298)、[100244（10月27日）](https://www.aniimo.com/newslist/detail/100244)、[官网最新列表](https://www.aniimo.com/main)、[News Center](https://www.aniimo.com/newslist)、[官方 Steam 公告](https://steamcommunity.com/app/4126040/announcements/) 和 [100275已知问题](https://www.aniimo.com/newslist/detail/100275)。四语言官方 Wiki 也已读取。记录时间在 `artifacts/aniimogg-p1-d/sources/index.json`，实际响应与 SHA-256 保存在本轮证据目录。

当前没有找到11月12日维护完成的正式证明。100298仍是更新预告。计划维护：Europe 06:00–11:00 UTC+0、Americas 02:00–07:00 UTC-4、APAC 14:00–19:00 UTC+8。时间经过后仅显示计划窗口已过、完成待确认，不自动改成已发布。

16条活动／玩法记录覆盖 Snapshots三阶段、Dash三赛道、Whirlbite重置、Homeland调整、S1 Part2、Aniimo Go!、Night Parade、Fantasy Resonance、Egg Heist、Holo Sim／Interlink、Homeland Magical Wonder Night。Affinity作为永久版本功能留在更新记录，服装明确有偿购买、上架日期未知。新故事链接现有 Region Explorer，不提供虚构坐标。

## 时间和状态

三服默认全部展示、手动选择并本地保存，不根据语言或位置推测。保留UTC+0／-4／+8，不应用夏令时。Dash结束时间分别为12月9日23:59、12月9日19:59、12月10日07:59。Aniimo Go!仍按100244原文保留各服11月12日10:00至12月10日07:59，不擅自合并为同一瞬间。

`event-model.js` 独立处理公告、未来、官方开放确认、即将结束、按日程结束、延期、取消、待确认、待复核和未知。`activationGate`保留更新后表达式；计划开始、实际开始、公告日期、核验日期分别存储。24:00换算到次日00:00，界面保留原表达。结束边界区分03:59等整分钟和04:00等瞬时窗口。没有官方开放证据的记录不会得到 ACTIVE_CONFIRMED。

## 奖励和兑换码

23条奖励记录，包含维护 Glimmer ×500；资格是Season2更新前已注册，领取开始／截止／实际可领取证据未知。其余数量未公布时不显示数字。支持类型、活动、服务器、状态和即将到期筛选。勾选领取是用户记录，不代表读取游戏账号。没有将付费服装列为免费奖励。

沿用 `src/data/gift-codes.json` 的12条，逐条检查PC Gamer及原社区线索。来源文章仍为9月24日更新，旧列表不能证明11月仍有效。保留原报告及9月28日历史核验日期，新增真实复查尝试时间、逐码是否仍列出、待复核结论；不把打开旧文章当作更新有效性证据。12条当前均为 NEEDS_RECHECK；历史上11条报告有效、1条报告过期仍在原数据中保留。无官方确认公开兑换码、无本站实兑验证、服务器范围及真实有效期未知。7天仅为编辑复核规则，不自动确认为过期。复制仅复制原字符串，保留大小写。

## Checklist 与隐私

唯一读写键：`aniimogg-event-checklist-v1`，格式只含server及records，记录只有eventId/taskId/checked/checkedAt。支持查看、普通、每日、阶段、奖励、代码任务；勾选、取消、刷新、事件／日期／完成状态筛选、单项移除和JSON导出。

严格结构校验与读前比较：损坏、非数组、禁用、额度和多标签页冲突时保留原始字节，切到会话模式并提示导出，不谎称持久保存。不访问收藏v1／v2、队伍及备份键，不新增账号、后端、同步或游戏凭证。测试用独立上下文种入保护值，确认其他工具数据不变。

## 四语言、布局、SEO和性能

新增文案使用独立EN／简中／繁中／日文词条。保留官方英文活动名；说明是本站编辑整理，不冒充官方译名。无合法活动图使用明确标识的插图占位，不抓取第三方图像。

Events四语言暂为 `noindex,follow`：当前使用按需数据、仍有关键开放和奖励信息未确认，暂不申请独立索引。canonical／hreflang／x-default／OG／JSON-LD按现有规范生成；Checklist不进metadata或JSON-LD。原168个Sitemap URL集合不变，新增4个Events单独核查且不进Sitemap，既有noindex策略不变。物理手机、系统软键盘和真实CWV未作通过声明。

专用JS模型＋控制器上限20,000B，页面CSS合计50,000B；不放宽原共享、图鉴、队伍、地区、首页和长文预算。所有新JS／CSS／JSON使用原SHA-256前16位文件名和完整manifest散列；不删除旧哈希，不改缓存规则、不清缓存、不禁用浏览器缓存。历史列表折叠，历史事件每次最多4条。

## 官方公告监控

`scripts/check-official-events.mjs` 同时最多3个请求，每请求20秒超时；读取官网列表、官方Steam及跟踪公告，去脚本／样式后归一化正文计算SHA-256，保存标题、日期、URL、新增链接、内容变化及日程过期复核清单。本轮初次运行未检测到内容变化。每日北京时间10点（UTC `0 2 * * *`）执行；5分钟job限制。只读生产数据，不提交抓取内容、不推送、不部署。GitHub Summary和Artifact保存结果。仓库Issues已启用；发现需复核时用内置token维护一条同名编辑事项，不新增长期密钥或付费API。

## 验证、Git与部署

本地 `check:aniimo-index` 核对官方130条无差异；`audit:local`、`git diff --check`通过。324个HTML资源引用／SHA-256／MIME／重复／幂等／变更隔离／旧哈希兼容检查通过；全部原性能预算通过。专用JS约15.8KiB，页面CSS合计约40.1KiB。

五模块：40组（2引擎×4语言×5视口）通过；10组损坏／非数组／禁用／额度／多标签冲突通过。四语言原图鉴100项、52页实际加载、84项Compendium2.0、旧资源兼容及收藏异常检查通过。原移动端全48组复测通过；初次组合运行出现一次触控比较按钮被已重开的详情弹窗拦截，保留原失败日志，未修改图鉴源码或禁用触控，完整独立复测48组通过。该偶发触控现象的根因未确认，列为警告。

Team：8组交互／128资源响应，56组存储导入，CPU4×四语言240样本及隐私检查通过。Region：24组四语言三视口双引擎及8组收藏／队伍保护测试通过。已有第三方提供商告警按现有诊断规则独立记录，没有屏蔽未知异常。

受保护的CSP配置、ads.txt、robots、Sitemap XML、19条重定向、原始130条数据、Region数据、队伍模型和图鉴源文件与基线SHA-256完全相同。未改DNS、域名、Cloudflare缓存配置或广告加载。

Git功能提交：`cf28e35b3069f37fb32eccbb3d17864170bc760b`。独立Preview分支已正常push，未强推。GitHub验证run `43151464709`成功。Preview：`9aadf3be-38cd-47cf-8850-b091f059dbf8`，https://9aadf3be.aniimogg.pages.dev；控制台明确Preview、独立分支、完整提交与success，资源验收28页／223响应／19个manifest资源通过；双引擎40组交互及10组存储异常全部通过，异常和第一方资源失败均为0。

证据全部位于 `artifacts/aniimogg-p1-d/`，保留历史产物。

生产回滚基线：ca0219cf6cc0dc91f5d9cb9587430d780485b615，Cloudflare a5fd7c80-4e58-4c02-add5-4ac625a03a0a。独立分支：codex/aniimogg-p1-d-events-rewards。本轮只读确认Pages生产main、自动部署开启、所有非生产分支为Preview；查看后Cancel，未改设置。

## 尚未核实

- 11月12日维护实际完成、活动实际开放及500补偿可领取情况。
- Snapshots每阶段目标伊莫、未公布奖励数量、Homeland调整后准确时间、服装准确上架日期、Affinity每日每周上限。
- 12个第三方兑换码的当前游戏内有效性、服务器范围和到期时间。
- 没有真实手机／原生软键盘或真实Core Web Vitals证据。

以上均保留未知／待确认，不计作事实核验PASS。

## 本轮哈希资源

|资源|URL|完整SHA-256|未压缩字节|
|---|---|---|---|
|eventModel|`/assets/event-model.487096e51d1d6f33.js`|`487096e51d1d6f33a46c497afe92ef56dbcfe5b3fc4d8f086f7f6a35f024c8af`|3921|
|events|`/assets/events-center.eb21113a3a5560ef.js`|`eb21113a3a5560ef1310ceed8b043db28b2b8c297adb66605db3af0ffcb525f2`|12257|
|eventStyle|`/assets/events-center.87d77a870f0f340e.css`|`87d77a870f0f340e07e497d64793f33f85606981a4a63ff7c74e16af3bc2f022`|3496|
|eventData|`/assets/event-data.7d43a6e7ef525ba0.json`|`7d43a6e7ef525ba0a9ea69a0a73e191a5aca7e6655225a8bc8cdf685958ebe02`|31859|

测试运行时：Chromium 156.0.8078.4、WebKit 26.5。五个目标视口360×800、390×844、430×932、768×1024、1265×712；旧图鉴额外包含844×390。浏览器缓存保持默认启用。

## Production与监控实跑

经fast-forward将同一已验收提交合入main，重新执行audit:local和diff门禁通过，正常push，无强推或历史改写。Production部署 `0f64b14f-8088-402f-b80d-b2206795e4bb`，部署URL https://0f64b14f.aniimogg.pages.dev，正式入口 https://aniimogg.com/events/。控制台确认Production、main、完整cf28e35提交、success及aniimogg.com／www绑定；不是Preview。main GitHub run `43151986379`成功。

正式域名资源验收28页、所有19个manifest资源已通过。生产交互与全量URL检查结果见最终验收记录。未发生回滚。

每日官方公告工作流已使用workflow_dispatch实跑：run `43152068229`，success，commit为cf28e35。已下载Actions Artifact；正文哈希未变、未发现新公告，无需创建复核Issue。未来发生变化时的Issue创建分支已配置，因本轮无变化未人为创建测试Issue。该工作流没有commit或部署步骤，实跑未产生Production部署。

本轮前置HTTP快照使用Python默认User-Agent遭遇403，未取得完整快照；不伪称成功。本轮线上保护项对照保留的P1-C生产HTTP基线和本轮发布前Git散列，正常Mozilla User-Agent的有限并发线上检查独立记录。没有清缓存、关闭缓存、修改规则或绕过浏览器安全挑战。

## 最终线上验收

- 168个原始Sitemap URL集合保持不变；逐一200、最终URL正确、canonical正确、hreflang与已验收提交一致、metadata一致、JSON-LD可解析、实际正文与已验收产物一致。
- 另查4个Events、4个Team和4个Map，共180页。新增Events四语言保留noindex,follow，不加入Sitemap。19条旧路径重定向正确，随机不存在路径真实404，robots／ads／4个RSS正常。
- 正式域名28页资源专项通过；实际浏览器下载覆盖全部19个manifest资源，与完整SHA-256及合法JS／CSS／JSON MIME一致，无固定query旧版本。生产实际HTTP资源字节散列也一致。
- 生产双引擎最终复测：40组五模块场景＋10组存储异常全部通过。移动的360／390／430视口使用Playwright原生tap（24组触控模拟），桌面使用点击与键盘，导出与大小写复制、勾选／取消／刷新、其他工具数据保护均通过。第一方／未知运行时错误0、第一方应用资源失败0。
- 原始生产首次异常门禁捕获13条WebKit RUM访问控制异常及2条RUM请求失败，保留在production目录，不改写原记录。补齐堆栈后，明确来自 `https://static.cloudflareinsights.com/beacon.min.js/...` 的XMLHttpRequest调用。diagnosed复测12条提供商告警；最终真实tap复测5条提供商告警，均独立保留。没有preventDefault、吞Promise拒绝或放行未知／第一方堆栈，原有诊断单元测试继续阻断伪造来源与应用堆栈。
- CSP等安全响应头与保留的先前生产证据相同；ads.txt和robots内容相同；本轮发布前后的受保护本地文件、130条原始数据及Region数据散列相同；AdSense publisher与脚本引用未改。仅只读核查域名绑定，未执行DNS或Cloudflare设置变更。
- 无生产回滚。无IndexNow／Search Console／Bing提交，无缓存清理、no-store改造或浏览器禁用缓存。

## 归档及限制

功能上线提交和验收部署分别是cf28e35及0f64b14f。最终只补充测试脚本的提供商来源诊断、移动原生tap和本报告；不改变HTML、manifest或任何应用资源。归档提交继续经独立分支Preview、main正常推送、当前提交CI及Production核查；最后的提交与部署证明保存在 `artifacts/aniimogg-p1-d/final-archive-deployment.json`，避免报告嵌入自身提交造成循环。

保留所有用户原有未跟踪日报、历史质量报告、artifacts和试验哈希资源。未把它们混入本轮提交。

最终状态 **DEPLOYED_WITH_WARNINGS**：提供商RUM异常、首次旧图鉴触控偶发现象及未确认的官方开放／奖励／兑换码事实均已明确列出；不把这些写作全部事实PASS。核心功能、资源一致性、存储保护及线上URL验收通过。
