# ANIIMOGG P1-A.1 官方名称本地化与移动端报告

日期：2026-11-11。最终状态：**DEPLOYED_WITH_WARNINGS**。官方名称及移动端功能已上线；已观察到的统计与偶发WebKit Promise异常如实保留为警告，未宣称线上控制台完全零异常。

## 官方来源与匹配

- en: [https://wiki.aniimo.com/](https://wiki.aniimo.com/)
- zh-CN: [https://wiki.yimo.com/](https://wiki.yimo.com/)
- zh-TW: [https://wiki.aniimo.com/tw](https://wiki.aniimo.com/tw)
- ja: [https://wiki.aniimo.com/ja](https://wiki.aniimo.com/ja)

四个官方索引均实际读取SSR；压缩原始证据见 `src/fixtures/localization/`，原始HTML SHA-256记录在名称层数据。520个官方详情链接均实际HTTP 200、title名称及对应语言sourceRecordId吻合，逐条响应SHA证据：`artifacts/aniimogg-p1-a1/official/detail-results.json`。

| 语言 | 目标 | 匹配 | 未匹配 |
|---|---:|---:|---:|
| en | 130 | 130 | 0 |
| zh-CN | 130 | 130 | 0 |
| zh-TW | 130 | 130 | 0 |
| ja | 130 | 130 | 0 |

NOT_FOUND / AMBIGUOUS / SOURCE_CHANGED / UNKNOWN 当前均为0。差异清单为空，不为达到覆盖率创造名称。各语言官方后台ID不同，例如 Emberpup 对应 EN 10008933 / 简中10008417 / 繁中10008675 / 日文10009449；现有sourceRecordId仍为10008933。不能把这些外语后台ID改写成本站实体ID。

匹配按英文原始sourceRecordId定位现有记录，结合确切官方公开路径（仅移除tw/ja语言前缀）、目录组、形态、sortOrder、阶段、定位、元素和立绘文件名复核；不单独使用显示编号。Emberpup与Reefish即使同为001仍为不同实体。

## 数据结构与展示

- 新名称层：`src/data/aniimo-localizations.json`，按原始sourceRecordId记录四语言localizedNames和逐语言localizationEvidence（sourceUrl/status/verifiedAt/该语言源ID）。
- 规范化模型直接扩展既有localizedNames和localizationEvidence；entityId、entryKey、sourceRecordId、旧收藏映射保持不变。
- 原始130=118 Basic+12 Prismana、2026-11-06原始数据核验日期及历史快照未修改。名称核验日期单独为2026-11-11，详情分别显示两类日期。
- 卡片、详情、表格和比较按当前语言显示官方名称；英文名称保留。搜索同时覆盖四语言名称、原别名和原始ID，结果仍指向同一entityId。
- 结构化数据ItemList保留130条、统一entityId identifier与原始官方实体路径，name使用当前语言。
- 术语证据另存 `src/data/aniimo-localized-terms.json`；九元素、五定位、三个已映射阶段及Basic/Prismana来自各语言真实页面。简中虹光形态、繁中虹彩型態、日文虹色フォーム分别取证，未做简繁机械转换。stage 4继续Unknown。

## 移动端修复与测试方法

主要操作至少44×44 CSS px；详情关闭按钮在弹层滚动时保持可触达；弹层使用dvh、安全区留白与纵向滚动；比较栏在窄屏限制布局和高度，为按钮滚动留出空间，短横屏隐藏冗长的已选项名称行（仍可在比较弹层移除），比较表格内部允许横向滚动，页面不横向溢出。

触屏测试实际发现并修复中文窄屏比较栏遮挡第三张卡片按钮的问题，没有使用force点击绕过。

设备检查：`xcrun simctl list devices available` 无可用simctl，adb命令不存在，USB未发现可访问iPhone/iPad；Android实机连接无法通过adb确认。没有进行真实手机或iOS Simulator/Android Emulator验收。使用已有Chromium与独立WebKit测试运行时（非桌面Safari应用、非iOS实机）。发现已有WebKit2359与Playwright1.62.1预期2336不匹配后，通过Playwright官方CLI下载免费匹配版本2336以排除驱动差异；未改项目依赖或锁文件，未安装付费服务。

测试尺寸：360×800、390×844、430×932、768×1024、1265×712、844×390；每语言每引擎共48个场景。包括四语言名称跨语言搜索、全部520名称匹配、滤器折叠/多选、详情滚动和关闭、比较增删、收藏/取消/刷新、触屏命中及溢出。

软键盘仅以缩小可视区域模拟可用高度，再验证搜索和详情操作；不声称测试了真实系统软键盘、输入法或物理设备。CPU4倍减速为Chromium模拟，不代表真实Core Web Vitals。

初轮非匹配WebKit2359曾出现未归因的undefined Promise拒绝，按失败处理、保留日志，未忽略。加入窗口错误与可选Promise调用来源诊断；最终使用与Playwright1.62.1匹配的官方WebKit2336（26.5），关闭Promise包装诊断，原生Promise下完整test:browser退出0、48场景错误0。匹配运行时排除了版本不一致，但不据此断言初轮根因；后续Preview及生产仍独立复验。初轮探测与中断日志不计作最终通过证据。官方浏览器版本要求见 [Playwright文档](https://playwright.dev/docs/browsers)。

## 本地门禁与性能

- `check:aniimo-index`：通过，官方130与原始快照无差异，没有--write原始索引。
- `audit:local`：通过，静态/数据/SEO/指纹/构建幂等性/预算全部通过。
- `test:browser`：匹配运行时的本地完整命令退出0；原有100、新工具84、移动48、52实际页面、308 DOM/SEO、8损坏存储、历史缓存兼容通过。后续仅测试归因、等待器及网络重试修正，用当前audit/诊断单测及生产八场景复核验证，未宣称修正后再执行整条本地命令退出0。
- `check-localizations`纳入npm test：520名称与证据、稳定ID与收藏映射、缺失/歧义/来源变化拒绝错误绑定。
- `git diff --check`：通过。

未放宽预算。通过消除重复来源URL序列化保留250,000 B HTML上限。实际四语言HTML及JS/CSS字节见最终审计日志；后附最终统计。

## Git、Preview 与生产

基线：`6e11950a1dc95e34a68d7f0d3f5e4773a38410dd`，已验证生产部署`4523efc7-674d-4f6a-b8f3-d5a4b4b857b2`（本轮回滚目标）。

开发分支：`codex/aniimogg-p1-a1-localization-mobile`，提交`445c42517a2d2aa1cc549254b429ebdf194da07a`。仅本轮35文件进入提交，原报告、artifacts与未跟踪中间资源均保留。

Cloudflare项目仍aniimogg，Git Integration；只读确认Production main和All non-Production branches Preview，Cancel退出，未保存设置。

Preview `3f8f9c00-5aa5-4741-8f48-d52a01f2df88`（445c425），https://3f8f9c00.aniimogg.pages.dev ：控制台确认Preview、独立分支、commit一致及success。8页资源SHA/MIME、84交互、48个双引擎移动场景通过；运行时错误0、非取消资源失败0。快速搜索隐藏懒加载图片导致的WebKit cancelled请求单独记录，17个对应URL另经HTTP200、image MIME及实际SHA与本地文件一致验证，且各场景可见卡片图片正常解码。未关闭缓存或拦截请求。

测试分类修正仅涉及测试脚本，不修改生产页面。首次取消分类前的失败JSON与日志保留，不冒充通过。最终生产结果后附。

## 保护项、限制与回滚

_headers、CSP、AdSense、ads.txt、robots、noindex、DNS、域名与缓存配置未修改。原始数据文件、收藏协议、旧资源均保留，原168 Sitemap URL及sitemap.xml字节不变。无新依赖或锁文件修改。

真实手机、系统软键盘和物理设备CWV未验证；这些限制不以模拟结果替代。

本轮是否回滚：**否**。未出现资源错配、搜索/收藏失效或大面积HTTP故障。

## 最终静态字节与资源

| 语言 | 图鉴HTML字节 | 上限 |
|---|---:|---:|
| EN | 235474 | 250000 |
| 简中 | 240274 | 250000 |
| 繁中 | 241682 | 250000 |
| 日文 | 249262 | 250000 |

公共JS 4.6 KiB，图鉴JS 12.8 KiB，合计17.4 KiB（均未放宽20,000 B门禁）；公共CSS36.7 KiB，图鉴合计CSS未超过50,000 B。首页及长文章原75,000 B预算通过。

- `/assets/compendium.62156dcd5e89ba90.js`：SHA-256 `62156dcd5e89ba90ae9400fca6e264e46806bdfe5a9e1abd223c5be99d8bd35e`
- `/assets/compendium.2150cc3a6675131a.css`：SHA-256 `2150cc3a6675131a4ac765825537275d29b8c133f321612f80f327d03af504a8`

## 最终发布候选确认

- 功能提交445c425之后，仅测试脚本修正产生`ea2f279e51be03bd2618bc19985011e07854564c`，运行时源文件、HTML、manifest、资源字节完全一致。
- 最终Preview：`18764e0c-626e-4b7f-aa15-8825a51e05f2`，https://18764e0c.aniimogg.pages.dev ，控制台Preview/独立分支/ea2f279/success核对；GitHub validate成功。
- 既有同字节版本已完整84+48验收；最终Preview补做8个四语言双引擎小屏交互场景与8页资源SHA/MIME，全部通过。生产已完整执行48场景，操作断言全部通过；完整控制台/网络门禁的警告和原始退出值见下节。
- main正常fast-forward并push至ea2f279，无force/history rewrite；合并后audit:local与diff检查通过。
- 最终本地命令日志：`artifacts/aniimogg-p1-a1/local/matched-runtime-browser.log`，完整命令退出0；所有结果JSON与运行时版本证据在同目录/`runtime-versions.json`。

## 正式生产结果与真实警告

正式功能发布提交：`ea2f279e51be03bd2618bc19985011e07854564c`；Cloudflare **Production success**：`c006053c-d8c2-414a-b22f-350969ce2f55`，部署URL https://c006053c.aniimogg.pages.dev ，正式域名 https://aniimogg.com/ 。控制台实际确认main/完整SHA/success/原域名别名，GitHub main run `43013900086` validate成功。

| 检查 | 实际结果与证据（artifacts/aniimogg-p1-a1/） |
|---|---|
| 官方名称 | 四语言各130/130，520详情实际HTTP/title/ID一致；official/detail-results.json |
| 生产原工具交互 | 84/84通过，actual asset hash与原别名/来源ID/收藏/比较/键盘；live/compendium2-browser.json |
| 生产完整移动操作 | 两次均完成48/48操作场景（每语言每引擎六视口）；原始JSON和日志保留，不能称为全控制台零错误PASS |
| 生产8场景清理复核 | Chromium/WebKit四语言360×800原生Promise复核退出0；live/cleanup-confirmation/localization-mobile.json |
| 52页真实浏览器 | 52/52通过，应用错误及第一方加载失败0；live/production-seo.json；6条外部请求中止另记 |
| 168 Sitemap URL | 原集合完全相同，168/168状态/最终URL/canonical/hreflang/metadata/JSON-LD/接受版本正文/manifest通过；live/http-results.json |
| 静态资源 | 8页46响应SHA/MIME通过；无旧query或Preview资源；live/asset-network.json |
| 保护项 | 源码/原始数据/sitemap字节一致；实际首页/robots/ads/sitemap保护头对比通过，robots/ads内容SHA一致；protected-final.json与live/http-results.json |
| 其他HTTP | 4 RSS=200，19旧跳转正确，随机不存在路径真404 |

**警告及门禁退出值：**

1. 首次完整生产移动命令的48个操作全部完成，但命令因WebKit统计上报而退出1：Cloudflare注入`static.cloudflareinsights.com/beacon.min.js`向同源`/cdn-cgi/rum`上报时3条访问控制运行时错误、10条取消请求。`live/production-triage.json`保留已证明的调用栈归因，应用资源错误与操作断言不受影响；原始`live/localization-mobile.json`未改成虚假PASS。
2. 额外小屏复验曾有2条未归因的`unhandledrejection: undefined`。等待方式改为显式元素状态和HTMLImageElement.decode后，八场景复验退出0；进一步完整48场景仍观察到一条在reload阶段的来源为空Promise拒绝。因此**尚未证明这些未知拒绝的根因，也未将其自动归类为广告或统计忽略**。未知异常在严格测试脚本中继续阻断；当前发布以WITH_WARNINGS交付。
3. 最后完整48场景的图片补验遇到测试客户端TLS ECONNRESET，命令退出1；不是已证实的线上404或字节错误。保留原始`live/final-mobile/`证据，并对全部16个取消图片URL作独立有限并发/有界重试校验，HTTP/MIME/SHA全通过（`live/final-image-check.json`）。测试脚本现支持仅对网络异常有界重试，HTTP失败、字节不一致不放过。
4. WebKit2359属于早期非匹配探测；最终本地整命令、最终Preview八场景、生产完整/复核使用匹配的WebKit2336/26.5。窗口/Promise诊断可选，最终验收默认不包装原生Promise。开启追踪的小屏探测未再复现未知拒绝，不能据此宣称根因修复。

没有修改CSP、安全头、Cloudflare统计或缓存配置来压制上述异常；没有关闭浏览器缓存或force点击。不存在需要立即回滚的已观察核心功能故障。后续优先继续定位WebKit重载时的未知拒绝及RUM统计问题，不能在报告中隐去。

## 性能实测与限制

生产390×844、Chromium CPU4倍减速，每类每语言10样本，DOM输入/点击处理加两次动画帧的实验室观察如下；不是实际手机/输入法/CWV数据。首次加载导航、paint条目、130卡片与资源时序保存在`live/performance.json`。

| 语言 | 搜索p95 ms | 筛选p95 ms | 详情p95 ms | 比较p95 ms |
|---|---:|---:|---:|---:|
| EN | 91.6 | 63.7 | 72.5 | 61.7 |
| zh-cn/ | 105.4 | 43.2 | 121.5 | 60.0 |
| zh-tw/ | 36.2 | 51.0 | 123.6 | 51.0 |
| ja/ | 34.4 | 35.7 | 109.6 | 59.6 |

现有84项脚本另保留同步筛选处理器CPU4x采样与250ms上限。所有原静态字节预算保持，没有用压缩大小代替未压缩预算。

## P1-B交付边界

已形成`docs/product/ANIIMOGG_P1_B_TEAM_BUILDER_PRD.md`、`ANIIMOGG_P1_B_TEAM_BUILDER_TECHNICAL_PLAN.md`、`ANIIMOGG_P1_B_TEAM_BUILDER_ACCEPTANCE.md`。仅规划，没有Team Builder功能代码、新路由或索引页。当前官方证据不能确认角色编队上限，方案采用明确标注的自定义规划清单，不将合作玩家人数当编队人数。

本报告及配套文档连同测试归因/网络重试改进纳入后续文档与测试提交；功能资源与ea2f279保持同字节。用户已有报告、artifacts和未跟踪中间文件继续保留。没有提交IndexNow或申请广告审核。
