# ANIIMOGG P1-D — Events & Rewards Center

最终状态：**DEPLOYED_WITH_WARNINGS**。验收日期：2026-11-12。五模块已正式上线，未发生回滚。

功能验收提交：`e99654e7caf59f00c64d5c9d2ef9dd37ab115766`。Production：`7a1f41f1-f463-4efd-a5d6-9057edbddfcd`，https://7a1f41f1.aniimogg.pages.dev。正式入口：https://aniimogg.com/events/ 。四语言均已完成真实浏览器验收。

## 1. 交付模块与路由

|模块|交付|
|---|---|
|Events Calendar|16条活动／玩法记录；三服日程、状态、搜索、筛选、零结果、详情、阶段任务和历史分批展示|
|Rewards Center|27条有来源的奖励记录；类型、活动、服务器、状态、明确领取截止时间筛选及用户领取记录|
|Redemption Codes|原12条逐条复查；官方／第三方分组、日期分离、7天复核规则、原大小写复制及失败提示|
|Updates & Patch Notes|更新预告、计划维护、历史记录及旧公告归档；不把预告当作发布完成|
|My Checklist|任务新增、勾选／取消、刷新恢复、事件／日期／完成状态筛选、单项移除、JSON导出和异常保护|

新增 `/events/`、`/zh-cn/events/`、`/zh-tw/events/`、`/ja/events/`，四语言导航同步。原Codes、Patch Notes URL保留；活动详情采用面板，不新增重复活动详情索引页。

## 2. 官方来源与当前确认边界

本轮读取并保存：[官网](https://www.aniimo.com/main)、[News Center](https://www.aniimo.com/newslist)、[100298](https://www.aniimo.com/newslist/detail/100298)、[100244](https://www.aniimo.com/newslist/detail/100244)、[100275](https://www.aniimo.com/newslist/detail/100275)、[官方Steam公告](https://steamcommunity.com/app/4126040/announcements/)及四语言官方Wiki。来源响应、原始字节SHA-256和时间在 `artifacts/aniimogg-p1-d/sources/`。

发布前再次检查时间：`2026-11-12T04:52:15.744Z`，未发现新公告或跟踪正文变化。该次结果保存在 `monitor-release-final/`；实际来源核查时间写入数据，人工核验与编辑时间独立保存，构建过程不生成“官方核验日期”。

100298发表于11月9日，仍是11月12日更新预告。未找到维护完成或各活动正式开放的独立官方证明。相关记录保持等待更新确认；计划窗口经过仅显示 `MAINTENANCE_WINDOW_ELAPSED_NEEDS_CONFIRMATION`，不据此宣称游戏已更新或补偿可领取。100244发表于10月27日，旧预告也没有因日历经过而自动升级成正式发布证明。

## 3. 时间、状态与首批活动

|服务器|11月12日计划维护|固定UTC偏移|
|---|---|---|
|Europe|06:00–11:00|UTC+0|
|Americas|02:00–07:00|UTC-4|
|APAC|14:00–19:00|UTC+8|

默认显示三服，用户手动选择并本地保存；不依据语言、地理位置或夏令时推断。保留原始“After the version update”和activationGate，实际开始时间未知时为null。24:00按次日00:00计算，界面保留24:00。03:59等截止分钟与04:00瞬时截止分别处理。

- Prismana Snapshots三阶段和Student II资格；相机、普通5种与额外奖励、Dazzling／Shadow特殊类型、每阶段特殊加奖一次及重复不计进度。各阶段目标Aniimo仍UNKNOWN。
- Aniimo Dash三赛道、Level40、Full Throttle全天／Speed Showdown每日18:00–24:00、最多8名Pathfinders；不写成角色编队上限。Redrock多人特殊赛道事件不可用。结束分别为Europe12月9日23:59、Americas12月9日19:59、APAC12月10日07:59。
- Whirlbite重置只针对调整前取得的Basic／Prismana；EXP道具与对应经验、升星／觉醒材料和Capafruit效果分别说明。资格须在游戏内核实，不当作签到奖励。
- S1 Part2、Aniimo Go!、Night Parade、Fantasy Resonance、Egg Heist、Holo Sim／Interlink、Homeland及其调整均保留对应官方来源和参与条件。Aniimo Go!仍按各服本地11月12日10:00至12月10日07:59展示；不擅自合并成同一全球时刻。
- Affinity作为常驻版本功能；Crescent Bay两项故事链接既有Region Explorer。服装明确Shop → Recommended购买、分批日期未知。未增加未经证实的坐标、任务奖励或数值上限。

状态模型覆盖公告、即将开始、官方确认开放、即将结束、按日程结束、延期、取消、等待确认、待复核和未知。ACTIVE_CONFIRMED要求官方开放证据；ENDED_BY_SCHEDULE只是公告时间经过。

## 4. 奖励完整性与领取记录

明确数量只有维护补偿Glimmer×500及100244中获胜队伍每位成员Giga-Egg×1；其他未公布数量不显示数字。500资格保留原文“Season 2更新前已注册”，不假定所有访问者符合条件。

奖励覆盖拍照、竞速称号／Profile／头像框／培养资源、Aniimo Go!、Night Parade、配方、Giga-Egg／激活宝箱及Holo首通／每周／星级奖励。家具套装收集奖励不代表奖品本身是家具，奖品类型保持other／未知；只介绍的赛季家具不冒充免费可领取奖励。

领取开始、领取截止及领取开放证据缺失时保持未知。活动结束时间不能替代奖励领取截止时间：未知claimEndAt不产生EXPIRED_BY_SCHEDULE，也不进入“即将到期奖励”。对应边界已加入单元门禁。

CLAIMED_BY_USER仅由用户自行勾选；不读取游戏账号或验证实际领取。已测试奖励状态随勾选、刷新恢复同步，任务显示具体奖励名。不存在于新目录的旧reward ID仍保留并显示未知ID。

## 5. 兑换码复核

沿用 `src/data/gift-codes.json`，没有导入第三方15码并一律宣布有效。12条原记录历史上11条报告有效、1条报告过期；现在均为NEEDS_RECHECK，无本站实兑验证，无官方确认代码。官方区明确显示“No officially confirmed redemption codes currently listed.”，第三方报告单独展示。

[PC Gamer](https://www.pcgamer.com/games/rpg/aniimo-codes/)与原社区线索已逐条比对，证据在 `code-rechecks.json`。文章JSON-LD首次发布9月16日、更新9月24日；原字段把更新日期混作首次发布，已订正。代码本身发布日期、服务器范围和真实到期时间未知，未从文章日期推断。

保留9月28日的历史来源核验信息，另记11月12日实际复查尝试；打开未更新的旧文章不等于重新确认代码当前有效。7天只是编辑复核期限，不是游戏有效期，不自动升级为EXPIRED_CONFIRMED。测试小写、大写、混合大小写复制以及剪贴板权限拒绝；只复制代码，不表示兑换。

## 6. Checklist、存储和隐私

唯一应用存储键：`aniimogg-event-checklist-v1`。仅server和records；每项仅eventId、taskId、checked、checkedAt。不读取／写入收藏v1／v2、Team清单及备份或其他用户数据，不增加账号、密码、角色所有权、后台或云同步。

严格校验、读前原始字节比较和storage事件检测保护损坏JSON、非数组、禁用、额度及多标签页冲突。失败后保留旧原文、提示会话模式、允许导出，不显示保存成功。不用空集合覆盖旧数据。未知／退役ID可继续保存和导出，140字符未知奖励ID在390px窄屏无横向溢出。

测试使用独立浏览器上下文和模拟保护值，没有修改真实用户收藏或游戏账号。导出只包含本工具字段，用户状态不进入metadata、JSON-LD、URL或服务器请求。

## 7. 四语言、SEO与性能

新模块的EN／简中／繁中／日文为独立文案；保留经核验的英文专名，并注明译文为编辑整理，不机械简繁转换或冒充官方译名。无合法图片时使用明确标注的占位。

Events四语言暂为noindex,follow：开放与领取信息仍有关键未知，主要数据按需加载，不申报成独立索引文章。canonical、hreflang、x-default、title／description／OG与JSON-LD正确。原168个Sitemap URL集合与XML字节不变；新增4页单独验收、未进Sitemap；既有noindex／robots政策不变。

未压缩专用JS（模型＋控制器）16837B／20,000B；全页CSS 41073B／50,000B；按需JSON 37577B。公共、首页、长文、图鉴、Team、Region预算均通过，未提高上限、增加依赖或修改锁文件。不把实验室或视口模拟称为真实设备／Core Web Vitals通过。

## 8. 资源版本机制

使用原SHA-256 manifest、前16位文件名及完整SHA-256。所有生成页面按manifest引用；静态模块依赖也参与指纹。重复构建幂等，JS／CSS变更隔离，保留旧固定路径与已发布哈希供旧HTML兼容。没有清Cloudflare缓存、改缓存规则、加宽泛短TTL／no-store或禁用浏览器缓存。

|资源|URL|SHA-256|字节|
|---|---|---|---|
|eventModel|`/assets/event-model.27d6394853d0fbbc.js`|`27d6394853d0fbbcabd40db0c190c0656c970f3c2542a2423cee6736e490ea34`|3836|
|events|`/assets/events-center.015865f68ef45dfa.js`|`015865f68ef45dfae15ed8754fc714e64a249eab654e0a80b903fe6c1bc7faba`|13001|
|eventStyle|`/assets/events-center.7e354ec36e96fd37.css`|`7e354ec36e96fd3792064d593da2605947a7a6d9e80b08253a6ef71131907cb4`|3519|
|eventData|`/assets/event-data.a24f562f8f7ae08f.json`|`a24f562f8f7ae08f1552b3957ebd10afaca71657ce33502af8ca5e9ea11fd852`|37577|


manifest：`assets/asset-manifest.json`。规范源文件在 `src/assets/event-model.js`、`events-center.js`、`events-center.css`，事实数据在 `src/data/aniimo-events.json`、`aniimo-rewards.json`、`aniimo-update-history.json`及原gift-codes.json；新四语言文案在 `src/locales/events.json`。27条奖励均有可回溯官方来源及独立发布时间、实际核查／核验和编辑时间。

## 9. 官方公告自动检查

`check-official-events.mjs`读取官网、News Center、官方Steam及跟踪公告，输出标题、日期、URL、归一化正文SHA-256、新增链接、变更和过期复核。最多3并发、每请求20秒超时、发现队列上限20；job上限5分钟。跳过已在截止后人工核验的旧日程，避免已处理历史记录每天重复重开；这不代表确认游戏内关闭。

工作流每日UTC `0 2 * * *`（北京时间10点），只读生产事实，不提交、push或部署。Summary与Artifact保留结果；Issues已启用，使用内置GITHUB_TOKEN维护一条编辑复核事项。实跑run `43152068229`成功，本轮无新内容，未人为制造测试Issue；已配置的Issue写入分支没有因无变化而执行。

仓库实际为PUBLIC，使用标准ubuntu-latest runner；[GitHub文档](https://docs.github.com/en/billing/concepts/product-billing/github-actions)确认公开仓库标准runner计算免费。Artifact沿用现有配额，不开启付费runner、套餐、预算或新增长期密钥。最终监控补充的实跑与归档部署证明见 `final-archive-deployment.json`。

## 10. 实际验证结果

|门禁|结果|
|---|---|
|check:aniimo-index|官方130与本地130无差异|
|audit:local、diff --check|通过；324个HTML指纹／依赖／幂等／保留兼容检查通过，性能预算全通过|
|P1-D本地|40组五模块＋40组四语言存储异常＋8组退役ID窄屏保护通过|
|P1-D Preview|同样88组通过；28页、全部19个manifest资源实际字节／MIME通过|
|P1-D Production|同样88组通过；第一方／未知运行时错误0，应用资源失败0|
|原图鉴／SEO|100项交互、52页加载、84项Compendium2.0、旧资源兼容／收藏异常及48组本地化移动复测通过|
|Team|8组交互／128资源响应、8组启动、56存储导入、CPU4×四语言240样本及隐私检查通过|
|Region|24组交互＋8组收藏／Team保护通过|
|线上URL|原168＋4 Events＋4 Team＋4 Map=180页逐一200；最终URL、正文、canonical、hreflang、metadata、JSON-LD、manifest正确|
|其他线上|19条旧路径重定向、真实404、robots、ads及四语言RSS正常|

浏览器：Chromium156.0.8078.4、WebKit26.5；360×800、390×844、430×932、768×1024、1265×712。24组移动功能组合实际使用tap，桌面含键盘操作。复制、拒绝权限、用户领取、刷新、导出、筛选零结果、未知期限和长ID均有实际断言。旧图鉴另包含844×390。

最终Production有17条来源可归因的Cloudflare RUM／广告提供商告警，另行保存完整堆栈。包括同源 `/cdn-cgi/rum` 的提供商请求问题，不能将所有同源网络宣称为零错误。第一方应用与未知来源仍阻断；没有preventDefault、吞Promise拒绝或隐藏未知异常。

原始首轮Production门禁的13条RUM异常和2条RUM请求失败日志保留。首次原图鉴移动组合出现一次触控被详情弹窗拦截；未改图鉴源码，独立完整48组复测通过。偶发现象根因未确认，作为警告保留，不声称缺陷凭复测消失。

## 11. Git、部署与保护

|项目|实际记录|
|---|---|
|开始main／回滚基线|ca0219cf6cc0dc91f5d9cb9587430d780485b615；a5fd7c80-4e58-4c02-add5-4ac625a03a0a|
|独立分支|codex/aniimogg-p1-d-events-rewards；保留，正常push|
|最终功能提交|e99654e7caf59f00c64d5c9d2ef9dd37ab115766|
|最终Preview|931352bd-4532-4cdb-b757-1d1bed38f923；https://931352bd.aniimogg.pages.dev|
|Preview CI|43158440626成功；控制台明确Preview／独立分支／同一完整SHA／success|
|Production|7a1f41f1-f463-4efd-a5d6-9057edbddfcd；https://7a1f41f1.aniimogg.pages.dev|
|Production CI|43160066103成功；控制台明确Production／main／同一完整SHA／success|

main经正常fast-forward合入已验收分支后push，未强推、改写历史或混入历史文件。仅后续报告与监控复核单元补充归档，不再改变应用HTML、manifest、JS／CSS／JSON；归档提交和当前最终部署ID另保存在 `artifacts/aniimogg-p1-d/final-archive-deployment.json`，避免报告引用自身提交形成循环。

_headers、ads、robots、Sitemap、19重定向、原130条数据、Region数据、Team模型及图鉴源码与本轮基线散列一致。CSP等安全响应头与保留的生产HTTP证据一致，publisher ID与广告脚本未变。仅只读检查Pages和绑定；未执行DNS、域名、Pages、缓存或广告设置写操作。未提交IndexNow／Search Console／Bing。

本轮前置HTTP快照的Python默认User-Agent曾遭403，未伪称获取成功；线上保护对照保留的P1-C生产HTTP证据、本轮发布前文件散列及正常浏览器／Mozilla UA实测。没有绕过浏览器挑战。用户原有未跟踪日报、历史报告、artifacts及试验哈希资源均保留；不混入提交。

## 12. 未解决与不作通过的事实

- 未独立确认11月12日维护完成、活动实际开放、补偿真实可领取和用户资格。
- 三阶段目标Aniimo、未公布奖励数量／具体奖品、Homeland准确调整时间、服装上架日期、Affinity数值上限仍未知。
- 12个第三方代码当前有效性、真实过期时间和服务器范围未知，未做游戏内兑换。
- RUM／广告提供商告警、一次旧图鉴触控偶发现象保留警告；没有真实手机、原生软键盘或真实CWV证据。

这些不是“已确认事实PASS”。最终状态保持 **DEPLOYED_WITH_WARNINGS**，核心功能和部署验收通过，未发生回滚。

## 13. 证据位置

本轮统一目录：`artifacts/aniimogg-p1-d/`。最终以 `local-final-88/`、`preview-final-88/`、`production-final-88/`、`preview-final-assets/`、`production-final-assets/`和`final-archive-deployment.json`为准。HTTP结果在 `production-final-88/http-results.json`；来源核验、源日期订正、保护散列、原失败和后续诊断日志分开保留。
