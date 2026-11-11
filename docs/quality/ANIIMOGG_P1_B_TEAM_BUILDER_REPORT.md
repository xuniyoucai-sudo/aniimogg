# ANIIMOGG P1-B — Team Builder 实施与生产发布报告

日期：2026-11-11。最终状态：**DEPLOYED_WITH_WARNINGS**。功能已正式上线；没有发生回滚。

## 发布版本与地址

- 四语言工具：[/team-builder/](https://aniimogg.com/team-builder/)、[简中](https://aniimogg.com/zh-cn/team-builder/)、[繁中](https://aniimogg.com/zh-tw/team-builder/)、[日文](https://aniimogg.com/ja/team-builder/)。
- 生产基线：main `25c565b73378f25a61c995af70c8f3e8138ea86e`。这是用户记录的 ea2f279 的文档/测试后继，原 P1-A.1 应用资源一致。
- 实现提交：`4997c17b666c2cb59a1ca07fedd319061288e11e`；导入标签复核提交及最终功能发布 HEAD：`b430134d40b07c018bfc628d41e7548940cb035d`。
- 独立分支：`codex/aniimogg-p1-b-team-builder`，已正常 push，保留未删除。main 从 25c565b 正常 fast-forward 至 b430134 并 push；没有 force push、改写历史或创建/合并 PR。
- Preview：**Preview / success**，ID `06838687-0d30-4190-93c6-79913482f472`，[部署地址](https://06838687.aniimogg.pages.dev/)，来源分支与提交均经控制台核对。
- Production：**Production / success**，ID `442ba1f1-1f8b-4cf1-88fe-9377b55cf9ff`，[部署地址](https://442ba1f1.aniimogg.pages.dev/)，来源 **main / b430134d40b07c018bfc628d41e7548940cb035d**。正式别名仍为 aniimogg.com、www.aniimogg.com。
- 发布前回滚目标保留为 `244800ce-1986-4199-ad39-adf86ebf1f8d`（main 25c565b），本轮未调用 rollback。

本报告记载功能发布提交；后续归档提交仅更新本报告，不改变应用字节。归档后的 Git/Cloudflare 当前提交核对保存在本机 `artifacts/aniimogg-p1-b/final-document-deployment.json`。

## 实际功能与数据边界

已实现新建、Unicode 重命名、删除确认/撤销、切换、自动保存与刷新恢复，最多 20 份清单。每份最多 130 个唯一 entityId；相同编号或同名不同形态不会合并。支持键盘和触屏上移/下移、移除及撤销。

角色选择复用同一 normalizeSnapshot 的 130 条记录（118 Basic + 12 Prismana）、稳定 sourceRecordId/entryKey/entityId、四语言官方名称与原别名。索引事实日期仍为 2026-11-06，名称证据日期仍为 2026-11-11；完整证据保留在既有源文件。按需 JSON 是自动构建投影，不是第二套维护数据库。英文回退与未知实体占位不猜测替代。

游戏实际编队人数上限仍为 **UNKNOWN**。20/130 是本站工具限额，不是游戏规则。分析仅统计公开元素/定位：单成员标签去重、已知并集、未覆盖和重复数量；空字段、新标签及未知成员单列。比较最多 3 份清单，显示成员差异、覆盖与资料完整度，不提供最强阵容、最佳比例、战斗力或胜率。

独立存储使用 `aniimogg-team-plans-v1`、备份 `aniimogg-team-plans-backup-v1`。schema 为 version/dataRevision/teams/activeTeamId，团队只存 id/name/memberIds/createdAt/updatedAt。Team 页面产品代码不读写收藏 v1/v2 键，原 Compendium 收藏功能保留。损坏或不可写存储保留原值、提供会话编辑及导出；写入成功才报告保存。storage 事件和写入前原文比较发现跨标签冲突，要求载入外部文档或导出当前内存。

JSON 支持单份/全部导出、严格预览、重名与 UUID 碰撞、未知成员数量、工具限额和追加结果反馈。默认追加并生成新 UUID；整批校验，非法项或持久化失败不部分写入。限制 200,000 UTF-8 字节、深度 8、20 份、每份 130 成员、名称 1–80 Unicode 字符、成员 ID 最长 32 字符；不接受额外 stats/资源 URL/危险对象属性。用户字符串经安全文本/转义输出，无 eval。

分享格式为 `#team=v1.<base64url>`，最大 12,000 字符。默认只含当前清单成员与版本，附名须主动选择。切换清单、修改内容或取消附名会清除陈旧链接；生成链接移除 query。打开先预览，明确点击才保存，语言切换保留已验证片段。**Fragment 不是加密，页面现有 AdSense/Cloudflare 等脚本可以读取它，不能保证完全私密。** 没有新增后端、上传/分享 API、账号或云同步。

## 架构、缓存与预算

纯查询/名称函数抽取到 `aniimo-model.js`；清单、存储、导入及片段模型合并为可独立测试的 `team-model.js`；页面控制器为 `team-builder.js`。Team 页不启动整个 Compendium 控制器，也不加载其 130 张卡片；选角首批 20 条、增量显示、根节点事件委托一次。专用 CSS 处理 44px 控件、移动单列、弹层滚动/安全区、焦点循环/恢复与比较区内部横滚。

所有新 JS/CSS/JSON 走 SHA-256 内容指纹，文件名前 16 位、manifest 记录完整 64 位。先哈希依赖，再替换明确的相对模块 import 并哈希消费者；测试共享模型变化传播、重复构建稳定、独立 CSS/JS 变化和实际字节。保留旧固定路径与已发布哈希；320 个 HTML 资源引用检查通过，没有新页面引用固定 query 旧版本、重复加载或机器路径。未修改依赖或锁文件。

| 预算 | 实测未压缩字节 | 上限 |
|---|---:|---:|
| 公共 JS | 4698 | 20000 |
| 公共 CSS | 37554 | 50000 |
| 图鉴全部首方 JS | 17944 | 20000 |
| 图鉴全部 CSS | 43786 | 50000 |
| 图鉴四语言最大 HTML | 249318 | 250000 |
| Team 全部首方 JS | 18899 | 20000 |
| Team 全部 CSS | 40095 | 50000 |
| Team 专用 CSS | 2541 | 10000 |
| Team 四语言最大 HTML | 13135 | 250000 |
| 按需 JSON | 51619 | 100000 |

首页/长文章原 75,000 B 门禁同样通过，没有提高任何阈值。Team 不加载与本页无关的公共指南/launch 控制器；导航由专用控制器提供，原广告脚本加载保持。

### 当前 manifest 与实际资源

Preview/Production 各 12 个四语言页面实际浏览器响应及 Team 矩阵响应均核对 SHA/MIME；JSON 和静态 import 依赖也存在且匹配。

| 资源 | URL | 字节 | SHA-256 |
|---|---|---:|---|
| app | `/assets/app.b96363d22f96b1cc.js` | 4698 | `b96363d22f96b1cc1405a85288fec893833185fd6d5c40f36933b59dd1491b42` |
| styles | `/assets/styles.288009fffafd2cd8.css` | 12558 | `288009fffafd2cd8f9b555ddeb1ee8c60d68316dadb03305c6931aeb87e2a85c` |
| siteContent | `/assets/site-content.158791c3936aab15.css` | 22612 | `158791c3936aab15194941f6542d0a3a4205bf7d502e3bac6cd25bb15fda9ca7` |
| accessibility | `/assets/accessibility.a871e57e6a0e32fd.css` | 2384 | `a871e57e6a0e32fdf0dcd90e1c860e1176323e3c384c5dbe4c32f50054533370` |
| aniimoModel | `/assets/aniimo-model.f4a49d2696e16024.js` | 791 | `f4a49d2696e1602484fc8e80c3f33cabff041c444edc09c499449bb96e7e4374` |
| teamModel | `/assets/team-model.236e085dbfd8cffc.js` | 4807 | `236e085dbfd8cffcd46fc27b7a6ad1a648829399ac331ab8ed7f9e4ce913f4a3` |
| team | `/assets/team-builder.552bf75c0849d472.js` | 13301 | `552bf75c0849d472c31683c8e0cf94cc4d486b7ca9a3f85df0d5a671e3b66ab6` |
| teamStyle | `/assets/team-builder.a311168c4168b525.css` | 2541 | `a311168c4168b525893653804de53ffb63857eb71878790d9bb057841700e29a` |
| compendium | `/assets/compendium.68687fe77ce25e68.js` | 12455 | `68687fe77ce25e686a965828d585cd6d0a85e997feef363fc408e8a9cfc68576` |
| compendiumStyle | `/assets/compendium.2150cc3a6675131a.css` | 6232 | `2150cc3a6675131a4ac765825537275d29b8c133f321612f80f327d03af504a8` |
| teamData | `/assets/team-data.9e4a44a29af74a00.json` | 51619 | `9e4a44a29af74a008f7b3b22e25565fa441e114e507156aca6510de6e171f8d4` |

## 自动化结果与证据

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| npm run check:aniimo-index | exit 0，官方 130 条无差异 | local/official-index.log |
| npm run audit:local | exit 0；最终 main push 前再次通过 | production/prepush-audit.log |
| npm run test:browser | exit 0；原 100 + 84、52 页加载、312 页 DOM SEO、8 存储异常、历史缓存及 48 移动场景 | local/regression-final.log、regression-final/ |
| npm run test:team | exit 0；31 模型用例、48 场景、56 存储/导入场景、240 性能样本、隐私检查 | local/acceptance.log、local/*.json |
| git diff --check | exit 0 | 提交及 push 前均执行 |
| 最终导入标签与横滚补测 | 四语言 × 两引擎 8 场景通过 | import-label-check/、local-supplement/ |
| 最新 Preview 全流程 | 48/48，应用错误 0 | preview/team-browser.json |
| 正式全流程 | 48/48，应用错误 0，768 个响应哈希匹配 | production/team-browser.json |
| 正式原图鉴 | 84/84 | production/compendium.log、compendium2-browser.json |
| 正式 HTTP/SEO | 168 原 URL + 4 Team 页 = 172 页全部通过 | production/http-results.json |

真实浏览器命令通过 PLAYWRIGHT_MODULE 与浏览器可执行路径指向现有运行时，项目没有新增浏览器依赖或锁文件。

完整本地矩阵在 4997c17 功能实现上完成；b430134 只拆分导入预览文案键并增加碰撞断言，随后本地 audit 和四语言双引擎定向复验通过。最终 b430134 又完成完整 Preview 与 Production 48 场景，生产最终版本还重新测量了性能。

### 38 个验收编号

模型/数据：`scripts/check-team-model.mjs`；真实流程：`scripts/check-team-browser.mjs`；存储故障：`scripts/check-team-storage-browser.mjs`；网络隐私：`scripts/check-team-privacy.mjs`。执行编号与入口保存在 `local/acceptance-ids.json`，不是仅靠 grep。测试副本没有写回源数据。

| ID | 结果 | 实际覆盖 |
|---|---|---|
| D01 | PASS | 130=118 Basic+12 Prismana；稳定且唯一的 entityId 与原始映射 |
| D02 | PASS | 复用 P1-A.1 四语言官方名称和证据，未复制维护另一角色库 |
| D03 | PASS | 同编号不同实体可并存，同一实体不能重复 |
| D04 | PASS | 真实 Inferlupa 多形态按实体分别加入 |
| D05 | PASS | 游戏人数上限 UNKNOWN；20/130 明确为工具保护限额 |
| D06 | PASS | 英文回退、空字段、新标签与未知 ID fixture |
| D07 | PASS | 旧资料版本保留用户名称、身份与成员顺序 |
| E01 | PASS | 空白/81 字符拒绝；80 个 Unicode 字符及 emoji 有效 |
| E02 | PASS | 重复添加无重复成员或重复点击事件；收藏不变 |
| E03 | PASS | 四语言名、英文、别名 Witchin、sourceRecordId、entryKey |
| E04 | PASS | 元素/定位维度内 OR、维度间 AND、形态与清除 |
| E05 | PASS | 首/中/末键盘与触屏重排、禁用边界、刷新顺序 |
| E06 | PASS | 成员移除/撤销、指定清单确认删除与撤销 |
| E07 | PASS | 20 个清单保留；第 21 个拒绝且旧原文不变 |
| E08 | PASS | 真实双标签页 storage 冲突、显式载入，不静默覆盖 |
| E09 | PASS | 收藏 v1/v2 与未知收藏 ID 全流程原样保留 |
| A01 | PASS | 真实 Emberpup+Flameruff：Fire=2、DPS=2，元素并集=1 |
| A02 | PASS | 真实多元素记录与同成员重复标签去重 |
| A03 | PASS | 空清单 0，无 NaN 或除零 |
| A04 | PASS | 已知+未知成员总数保留；已知资料中未覆盖 |
| A05 | PASS | 缺少元素/定位与未映射新标签单列 |
| A06 | PASS | 1/2/3 清单比较；第 4 个拒绝，不编辑原文档 |
| A07 | PASS | 相同覆盖、不同成员的差异；没有胜负或战斗分数 |
| S01 | PASS | 读写禁用/QuotaExceeded：会话编辑、导出、旧值保留 |
| S02 | PASS | 损坏 JSON/非对象/未知版本/非法成员类型不覆盖 |
| S03 | PASS | 导出再导入等价成员与顺序，默认追加 |
| S04 | PASS | 重名和 UUID 碰撞预览明确；新 UUID；重复成员拒绝 |
| S05 | PASS | 200,000 B/20 清单/130 成员/深度 8/ID 长度限制 |
| S06 | PASS | 非 schema、URL/stats/__proto__ 拒绝；HTML 名称安全文本显示 |
| S07 | PASS | 格式有效的未知 entityId 原样保存、显示和导出 |
| S08 | PASS | 非法批次或写入失败不产生部分导入 |
| U01 | PASS | 默认片段只有版本、资料版本和当前成员，无自定义名或收藏 |
| U02 | PASS | 显式附带中日文/emoji 名称，UTF-8 往返；取消后清除旧链接 |
| U03 | PASS | 过长/坏 base64url/非法 UTF-8/未知版本拒绝且不写入 |
| U04 | PASS | 先预览、关闭后切换语言保留片段、显式追加保存 |
| U05 | PASS | canonical/hreflang/x-default 与 metadata/JSON-LD 不含用户配置 |
| U06 | PASS | 四语言 noindex,follow；原 168 URL 集合及旧策略保留 |
| U07 | PASS | 无新增上传/分享 API；记录现有第三方脚本可读 fragment 的边界 |

## 浏览器、移动端与性能

EN/简中/繁中/日文 × 360×800、390×844、430×932、768×1024、1265×712、844×390 × Chromium 156.0.8078.4 / 匹配版 WebKit 26.5。Playwright 1.62.1，WebKit 使用匹配的 2336，而非旧 2359。矩阵执行完整创建、搜索/筛选、详情、添加、重排、撤销、刷新、比较、导入/导出和跨语言分享；检查真实按钮中心命中、44px 主操作、焦点循环/Escape/恢复、内部横滚和无页面横溢。

主机为 Apple M2 / 8 GiB、macOS（Darwin 25.6.0）arm64。CPU 四倍减速、每语言每操作 12 样本，共 240 样本；使用 3 份各 130 成员的真实数据清单，记录处理器及两帧观察值。最终生产页测量最差 p95 **29.9ms**、最差处理器 **29.9ms**、两帧最大 **71.7ms**，分别满足 100/250/500ms。20 次清单切换后 DOM 成员仍为 130、选角不超过 20；堆内存与原始样本保留在 production/performance.json。这是合成实验室处理器测量，**不是实机 Core Web Vitals**。

实机/系统软键盘：**NOT AVAILABLE**。simctl、adb 不可用，USB 清单未发现可访问手机；只做 WebKit/Chromium 触屏和缩小视口模拟，不称为 iPhone/Safari/Android 实机通过。

## 正式线上与保护项

172 页均 HTTP 200、最终 URL 正确、H1 正常，canonical/hreflang/OG 与当前提交一致，JSON-LD 可解析，HTML 经明确的 Cloudflare 注入规范化后与提交一致。原 Sitemap 集合仍为 168，四个 Team 页为 noindex,follow、不加入 Sitemap；原 noindex/robots 策略不变。四语言 RSS、robots.txt、ads.txt、sitemap.xml 均 200，随机路径真实 404；19 条旧路径首跳及最终目标均正常。

`_headers`、ads.txt、robots.txt、sitemap.xml、src/data/aniimo-index.json 与 src/data/aniimo-index-manifest.json 的源码 SHA 与基线一致。正式 ads.txt/robots/sitemap 字节不变，publisher ID 仍为 ca-pub-8711357634093602，广告 script 标签与基线完全一致。安全响应头逐项前后相同；CSP 与 CSP-Report-Only 响应头在本次前后均未下发，未更改其既有配置。DNS 只读结果与正式别名记录保存在 production/protection.json；没有修改 DNS、域名绑定、Pages 设置、缓存规则、RUM、广告或安全边界，没有清缓存或禁用浏览器缓存，没有提交搜索引擎通知。

## 告警、失败留证与未解决项

正式验证先出现一次 Chromium `ERR_TUNNEL_CONNECTION_FAILED` 导航传输失败，尚未进入应用；原始失败保存在 production/transport-attempt-1/。没有修改代理/缓存/CSP 或回滚来制造通过，改为按引擎顺序重新执行，两个引擎各 24 场景实际 exit 0，合并形成当前 48 场景证据。

本次正式矩阵保留 **96 条**已归因的外部广告/统计诊断（包括既有 Cloudflare RUM 及 Google 广告帧报告）；应用异常、未知来源异常、意外首方资源失败均为 0。通过仅在测试上下文追踪 Promise 创建栈，抓到 `show_ads_impl_fy2021.js` 来源；Google frame 的 report-only 提示也保留原文。没有 preventDefault 或添加 catch 隐藏拒绝；Promise 诊断代理只存在于隔离测试上下文，没有写入生产应用资源，也没有放宽安全配置。对应用栈、未知栈与伪造域的分类负例仍阻断。

历史 P1-A.1 未保存创建栈的个别 undefined 记录不能据此全部追溯归因；原始日志继续保留。本轮捕获的每条例外有当前来源证据。外部提供方告警仍存在，未擅自改广告/RUM/CSP；真实设备与系统键盘验收仍缺失。没有未解决的 P1-B 核心功能失败。

本地临时服务和测试上下文均关闭；历史用户未跟踪报告、artifacts 及未发布试验指纹文件保留，没有混入功能提交或删除。GitHub Actions 与 Cloudflare 均按当前功能提交成功，报告归档后再核对同应用字节。
