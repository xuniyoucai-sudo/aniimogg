# ANIIMOGG P0 产品质量修复实施报告

日期：2026-11-11（Asia/Shanghai）。范围：P0-A～P0-G，本地实施与验收。当前基线 `main` / `a6b23bad014fc9270ad810f61809a4aa6ba35423`，没有回退到审计的 `6f06ac0`。原有未跟踪的 `ANIIOMOGG_PRODUCT_QUALITY_AUDIT.md` 保留，不混作本轮新审计或发布产物。

## 1. 执行摘要

**状态：PASS（本地授权范围）。发布条件：READY_FOR_RELEASE（本地检查门槛通过，尚未发布）。**

七个工作包的本地修改均已完成，最终回归结果见第6节。这里的发布条件仅表示本地代码达到约定的检查门槛，不表示已经部署、广告获批、游戏事实全经实测或搜索引擎已收录。

没有执行 commit、push、合并、PR、Cloudflare Pages部署、IndexNow、游戏账号操作或外部配置变更。没有改动 CSP、响应头、广告加载策略、publisher ID、ads.txt、robots、noindex策略、sitemap URL集合、DNS、密钥或生产数据。

## 2. 方案审查及必要调整

方案合理，按用户“审查后直接执行”的授权实施，无需追加普通实现细节确认。采用 Sites 技能的 local-only 路径，仅使用当前仓库和本地服务器，不注册、同步或发布新站点。

1. 当前 HEAD 比审计基线多了 `a6b23ba`，保留其中 Whirlbite 官方公告和既有 CSP 检查修正。Patch时间线因此是 **8 条**，而不是旧方案的7条；没有为满足旧数字删除新内容。
2. 130、118、12及2026-11-06快照保持原义。2026-11-11仅用于本轮编辑和归档分类日期，不把构建日期写成游戏实测或逐项来源核查日期。
3. 保留原八列JSON，以轻量规范化映射落地稳定实体ID；不进行高风险全量数据重写，不推断species/family/parent关系。
4. 不建设P1的对比器、组队器、坐标地图、事件中心或资源计算器。Map改为地区参考，Tier List改为比较方法；保留原路由和noindex。
5. 原测试的标题／描述最小字数门槛诱导自动填充“Official”后缀，已改为检查非空、无误导官方身份、OG一致和真实任务文案。没有放宽性能预算；原语义、来源、阶段、身份和链接检查均保留或按新数据结构更新。
6. 浏览器使用已有 Playwright 与本机 Chromium 1248，未增加付费服务、后端或下载浏览器。仓库原无锁文件，也没有本轮依赖安装或锁文件变更。

## 3. 实际完成的工作包

| 工作包 | 本地实施 | 主要变化 | 验收证据 |
|---|---|---|---|
| P0-A | 完成 | 去掉旧字符偏移拼接，模板直接生成图鉴；真实hidden规则；动态计数；窄屏布局／按钮命中；存储异常提示 | `phase-a/browser-results.json`，四语80例；最终浏览器再次覆盖 |
| P0-B | 完成 | manifest与规范字段映射；稳定opaque ID；v1→v2幂等迁移；未知与损坏数据保留 | `check-product-quality.mjs`；真实legacy迁移、刷新及异常测试 |
| P0-C | 完成 | 12码独立数据、逐条来源／日期／资格与期限未知／未实兑；11条需复核、1条报告过期归档；7日维护规则 | 数据边界测试及四语浏览器codes检查 |
| P0-D | 完成 | 攻略限定搜索、图鉴恢复链接；地区参考／比较方法；手动RAM/SSD检查、未知及4GB选项 | 四语搜索、菜单、390/768/1265、配置4/8与30/40边界 |
| P0-E | 完成 | 首页130形态＝118+12及快照说明；FAQ直答；最近复核攻略；取消官方品牌填充后缀，保留canonical/hreflang/JSON-LD | 静态一致性与308页真实DOM解析 |
| P0-F | 完成 | 历史新闻及RSS范围；公告、复核与编辑日期分离；8条时间线与8条活动/模式保留；术语关联当前攻略；旧社区与测试规范明确归档 | `publication-review.json`、既有内容回归、浏览器解析 |
| P0-G | 本地要求完成；外部实验未验证 | 明确official/mixed/editorial/community边界；真实图片归属；谨慎广告披露；公共Issue限制；单编辑署名；键盘语义、触屏与存储反馈 | 本地文案、键盘／触屏用例、protected检查；地区CMP及实机读屏不声称通过 |

繁中图鉴UI（筛选、阶段、角色、空态、收藏等）与新增修复文案有独立词条，不只把简中字符替换后视为验收通过。既有长篇文章仍使用原共享翻译基础，未宣称全站已完成专业母语审校。

## 4. F01～F24 处理状态

FIXED表示本任务定义的修复范围通过；不会把未实施的新产品能力或需要游戏／广告后台的实验伪装成已完成。

| 发现 | 状态 | 实际处理及限制 | 主要文件／证据 |
|---|---|---|---|
| F01 | FIXED | 四语各1个SECTION#aniimo-catalogue；完整figure；无初始化异常；缺控件明确诊断且不阻断其他模块 | `scripts/build-site.mjs`、`app.js`；四语DOM／控制台 |
| F02 | FIXED | 卡片／表格由同一匹配集合控制；零结果和仅收藏真正隐藏对象；隐藏项不进入Tab焦点 | `app.js`、`site-content.css`；search／parity／keyboard |
| F03 | FIXED | 独立data-template；0→1→2→1及刷新一致；名称包含对象；有效数量不计未知ID | 构建、app；bookmark与legacy用例 |
| F04 | FIXED | 主文章CSS限制为直接子节点；卡片尺寸／换行；768筛选列重排；三视口中心点命中测试 | 样式；四语×3视口及截图 |
| F05 | FIXED | 首页／FAQ／图鉴／入口／ItemList统一形态口径；消除8/30=130；不声称物种数 | manifest、snapshot、quality文案与检查 |
| F06 | FIXED | 历史86/118为过去时；数量问题直答；未知关系和stage4保留；原始数据未改 | `aniimo-snapshot.mjs`、`product-quality.mjs` |
| F07 | FIXED | 旧来源的11条需复核、1条报告过期；来源日期与编辑日分开，未实兑、资格与期限未知 | `gift-codes.json`、`gift-code-status.mjs` |
| F08 | FIXED | 明示仅搜攻略卡片；Emberpup无攻略结果时给图鉴入口；不冒充跨实体搜索 | 构建、app；guide-only recovery |
| F09 | FIXED | News/RSS明确9/23前历史摘要；保留HEAD新增公告；时间线源核查未知不造新日期，编辑归档日另列 | `publication-review.json`、构建、quality文案 |
| F10 | FIXED | 地区参考及比较方法重新命名；共同指南入口；不造坐标或排名；原noindex不变 | quality文案、构建、索引回归 |
| F11 | ACCEPTED_RISK | 原能力缺口属于P1/P2，按本次明确范围不实现；Team Setup仍是攻略，不宣传Builder已上线 | README、范围声明 |
| F12 | FIXED | 手动RAM/SSD核对；未知不通过；4/8GB、30/40GB边界正确；无自动硬件扫描承诺 | 构建、app、四语readiness |
| F13 | FIXED | 移除自动Official/Game Wiki填充，任务标题＋独立站品牌；描述不按字数灌水 | metadata逻辑、check-site、308页OG检查 |
| F14 | FIXED | verified不回退Official；混合段落标mixed，建议标editorial；政策为本站政策；来源条目分类，无本站实测标签 | `product-quality.mjs`、构建；quality测试 |
| F15 | FIXED | 官方立绘归属Pawprint/FunPlus等并链接Wiki；模板图是编辑示意，不是截图或实测证据；不新增图片 | 构建、四语credit；既有资产未变 |
| F16 | FIXED | 繁中搜索正／空态与恢复，图鉴交互使用独立繁中词条 | quality JSON、app；繁中浏览器 |
| F17 | FIXED | Crossplay／Prismana／Egg Heist定义与当前引用指南对齐；所有术语有相关指南；编辑日期非游戏核验 | glossary构建与quality文案 |
| F18 | FIXED | 社区9/16报告是历史档案并指现排障/Deck；Launch Verification仅规范／模板，不是实测结果 | 构建、quality文案 |
| F19 | FIXED（披露范围） | 区分代码、广告展示、第三方存储、同意行为；全地区CMP/广告实验NOT_VERIFIED；无配置改动 | Privacy/Advertising、protected比对 |
| F20 | FIXED（透明度范围） | 明示GitHub登录、公示性和无已核实私密渠道；不造邮箱、不发Issue；私密渠道仍不存在 | Contact/Copyright、quality检查 |
| F21 | FIXED（身份表述） | 独立单编辑、无独立多人审核暗示；未新增作者／资历／游戏实测记录 | About/Authors、byline |
| F22 | FIXED | 真实浏览器回归＋全四语图鉴体积预算；保留原阈值与有效测试；CWV无数据不称通过 | 测试脚本、final-audit、final-browser |
| F23 | FIXED（已测试范围） | aria-controls/expanded、Escape焦点、可见移动菜单、live状态、对象名；实机读屏/WCAG认证NOT_VERIFIED | keyboard／touch／308页ID目标解析 |
| F24 | FIXED | 存储阻止／写失败／损坏JSON／非数组／未知ID提示及会话回退；v1原文不覆盖；v2迁移可重复 | app；四语storage5场景；跨标签即时同步未实现且未宣称 |

## 5. 数据与收藏兼容

- `aniimo-index.json`原始130行完全保留，来源检查脚本只读运行，未加`--write`。
- `aniimo-index-manifest.json`：snapshotDate=2026-11-06、auditedAt=2026-11-10；130＝118 Basic＋12 Prismana；历史86/118/130分别为9/23、10/30、11/6。检查方法是官方visible API及公开路由对照，不是游戏内实测。
- `normalizeSnapshot`由sourceRecordId哈希生成稳定opaque ID，不使用91种可重复显示编号当主键；保留entryKey映射与别名。speciesId、familyId、parentFormId、gameVersion等无可靠关系时为null；2条stage4的stageLabel为空，不映射Nova。
- 浏览器v2键：`aniimo-guide-collection-v2`，结构`{version:2, entityIds:[], unrecognizedIds:[]}`。首次有合法v1且无v2时迁移；v1原始字符串留存，后续只写v2。未知ID进入unrecognizedIds，不静默删除或计入有效收藏数。
- JSON损坏／非数组不会自动清空或覆盖原始存储；读写失败可继续使用会话内状态并明确提示无法持久保存。没有跨设备／游戏账号同步；未实现跨标签实时同步。
- v2旧字段坏值保守停止持久化，不以空集合覆盖。这一schema校验路径另以四语言8个真实浏览器场景验证损坏v2 JSON／错误v2结构；警告可见、页面可继续使用、原始v1和v2都未被覆盖，见storage-v2-browser.json。
- gift-codes保存12条旧来源报告、9/28来源检查、11/11编辑复核、可空expiry/eligibility及无本站兑换记录。7日为维护阈值；超时只降为needs_recheck，不据此判过期。无来源或无效日期也需复核。
- publication-review将publishedAt、sourceCheckedAt、lastReviewedAt、modifiedAt、eventStartAt/eventEndAt分开。未知sourceCheckedAt保持null；日历原有10/15来源检查保留；编辑归档分类11/11，不自动宣称活动仍开放。

## 6. 验收矩阵与命令

最终命令结果：PASS。完整构建、全部静态／单元／数据检查、四语言原预算、100个功能浏览器用例、308页结构解析、52次真实页面控制台冒烟以及8个v2损坏场景均通过。

| 检查 | 覆盖与结果文件 |
|---|---|
| 修改前 `npm run audit:local` | PASS；309 HTML、多语／模拟交互／原体积预算。基线实际缺陷仍存在，见baseline-browser |
| 修改前真实浏览器 | PRE-EXISTING：EN节点FIG<SECTION且130卡不隐藏；另三语IMG节点和dataset异常。`baseline-browser.json`及8张基线截图 |
| P0-A真实浏览器 | PASS：80例；`phase-a/browser-results.json`及三视口截图 |
| `npm run check:aniimo-index` | PASS：官方130、本地130、0差异；`official-index.log`，没有写入参数 |
| `npm run audit:local`（最终） | `final-audit.log`；含构建、全部单元／静态／quality测试和四语体积 |
| `npm run test:browser`（最终） | `final-browser.log`、`browser-results.json`；后续同一有效源码分别运行新增的 `node scripts/check-browser-seo.mjs`（含52页控制台冒烟）与 `node scripts/check-storage-schema-browser.mjs`，日志为final-seo-console.log、final-storage-v2.log；真实Chromium，而非假DOM冒充。最终test:browser脚本已串联这三个已验证步骤 |
| `git diff --check` | `diff-check.log`；最终再次检查包含交付报告 |
| 保护项与索引集合 | `protected-regression.json`；响应头/ads.txt/redirects/robots与基线哈希，广告加载片段、publisher及168 URL集合 |

浏览器调用使用已有安装：

```sh
PLAYWRIGHT_MODULE=/Users/asuka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs \
PLAYWRIGHT_CHROMIUM_EXECUTABLE='/Users/asuka/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' \
npm run test:browser
```

本地预览为`python3 -m http.server 4173 --bind 127.0.0.1`。初始问题截图还用只读`git archive HEAD`临时副本与4174端口重现，以保留当前HEAD基线；没有reset或改写历史。运行过程中执行过`npm run build`、`npm test`、`npm run check:performance`、特定Node回归脚本和状态／差异只读检查，均在本轮本地范围。

### 四语言矩阵

| 范围 | EN | 简中 | 繁中 | 日文 |
|---|---|---|---|---|
| DOM、搜索名称／001／Witchin、元素／角色／目录组／stage4、组合、零结果、clear、图库表格一致 | PASS（25主用例＋2个v2坏数据用例） | PASS（25主用例＋2个v2坏数据用例） | PASS（25主用例＋2个v2坏数据用例） | PASS（25主用例＋2个v2坏数据用例） |
| 收藏0→1→2→1、刷新、仅收藏、隐藏项Tab、异常存储、旧ID与未知ID | 同上 | 同上 | 同上 | 同上 |
| 390×844／768宽／1265×712，页面溢出与4个按钮中心命中 | 同上 | 同上 | 同上 | 同上 |
| 攻略限定搜索、恢复链接、移动菜单Enter/Escape与语言菜单、4/8GB＋30/40GB、代码状态、触屏tap保存 | 同上 | 同上 | 同上 | 同上 |
| 全部页面SEO/ID/JSON-LD（各77页） | PASS（77页） | PASS（77页） | PASS（77页） | PASS（77页） |

每语言20个图鉴/存储/视口场景＋5个周边／触屏场景，主回归100例；另每语言2个v2坏数据场景，共计108个命名浏览器用例。视口命中用例内部还逐个点击001～004并核对aria-pressed。触屏是Chromium hasTouch/isMobile模拟，不是实机iOS/Android实验。主回归对未捕获pageerror断言；另52次真实页面加载检查console.error、未捕获异常和本地资源请求失败，均为0；外部请求被隔离所产生的网络消息单独计数，见browser-seo.json。第三方请求在本地回归中阻止，不把广告网络失败算作站内功能失败，也不由此证明生产广告行为。

### 中途发现及修正（不隐瞒失败）

- 初稿浏览器断言错把001的子串搜索期望写成3；按真实数据实际为4（001 Emberpup、001 Reefish、10001 Irisalis、11001 Sparkelf），修正测试预期，没有删除记录。
- 768px筛选列发生溢出，已增加中等屏幕两列布局；中心命中测试排除粘性header遮挡的滚动位置后仍验证真实元素命中，未用force绕过点击门禁。
- 新字段一度超英文／日文250,000字节门槛；通过去掉表格重复filter数据、从卡片名取按钮名称等减少HTML，而非放宽预算。
- 原测试对旧title最小字数、dateModified、结束轮次、精确属性顺序／重复表格dataset及繁中旧标签有实现耦合。测试更新为非误导元信息、11/11编辑日与原事实日分别保留、5个已结束轮次、真实卡片字段＋行对应，以及独立繁中词条。原官方公告内容与来源断言仍通过。
- 没有把中途失败包装成通过；以最终完整运行日志为准。

## 7. SEO、性能与保护项

保留原168个sitemap URL及全部noindex/robots策略，仅lastmod反映本轮真实编辑。重定向与canonical路径没有改。真实Chromium DOMParser检查308份完整页面：JSON-LD可解析、canonical与路径相符、四语＋x-default目标存在、OG与title/description一致、无重复ID、aria-controls目标存在；图鉴ItemList=130实际项。查询参数不生成独立索引URL。未调用Search Console、IndexNow或声称实际收录。

四语言图鉴仍使用250,000字节原预算；共享CSS50,000、JS20,000、首页75,000、长攻略75,000均未放宽。实际数值以`final-audit.log`为准。这是文件大小检查，不是Lighthouse、真实低端机或现场Core Web Vitals实验。

最终图鉴大小：EN 240839字节、简中 247361字节、繁中 247304字节、日文 248282字节，均小于250,000字节。

## 8. 广告、来源与外部未知项

- 仅修改Privacy／Advertising的事实陈述：页面已有Google广告相关代码；实际展示、第三方存储和同意流程不能从代码存在或一次未见广告推导。本轮未进入广告账号、付款后台，未改脚本加载、CSP、publisher或ads.txt。
- NOT_VERIFIED：各地区CMP／Cookie／真实广告展示、Google审批、真实索引、游戏兑换与账号资格、站内游戏实测、角色亲缘和可获取总数、全套素材授权链、真实读屏／WCAG或实机性能。
- 有官方来源不等于官方隶属；集体署名不等于多人独立复核；示意图不等于游戏测试证据。没有新增作者资历、版权图片、坐标、榜单、胜率、活动时间或私密联系渠道。
- 公共GitHub Issue可能要求登录且公开。没有已核实私密渠道时如实说明，不上传证件或发送测试Issue。
- 待后续用户授权阶段处理：P1工具、真实区域/成本资料、可验证玩法实验；这些不属于本轮交付的上线功能。

## 9. 修改文件清单

以下由最终工作区自动列出，原审计报告不属于本轮变更。HTML/RSS/sitemap是构建产物，按项目现有静态发布架构保留；不是额外批量生成文章。

| 文件 | 修改原因 |
|---|---|
| `README.md` | 纠正四语、形态快照、功能边界与本地测试流程 |
| `app.js` | 筛选一致性、收藏迁移／反馈、范围搜索、导航、readiness |
| `llms.txt` | 去掉无证据本站实测声明，说明资料性质 |
| `package.json` | 接入quality与真实浏览器回归命令 |
| `scripts/aniimo-snapshot.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `scripts/build-site.mjs` | 稳定模板、数据渲染、明确内容与元信息、原索引策略 |
| `scripts/check-browser-seo.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `scripts/check-compendium-ui.mjs` | v2状态及保留原v1的单元夹具 |
| `scripts/check-launch-ui.mjs` | 未知与低于最低配置边界 |
| `scripts/check-performance-budget.mjs` | 扩展到四语言图鉴，保留原阈值 |
| `scripts/check-product-browser.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `scripts/check-product-quality.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `scripts/check-site.mjs` | 按新结构和真实内容语义更新回归，不以字数填充 |
| `scripts/check-storage-schema-browser.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `scripts/gift-code-status.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `scripts/product-quality.mjs` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `site-content.css` | hidden、卡片／导航／响应式与状态样式 |
| `src/data/aniimo-index-manifest.json` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `src/data/gift-codes.json` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `src/data/publication-review.json` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |
| `src/locales/product-quality.json` | 轻量数据模型／四语修复文案／验收辅助，见文件注释与本报告工作包 |

构建产物（310个）：

- `404.html`
- `404/index.html`
- `about/index.html`
- `advertising/index.html`
- `aniimo/emberpup/index.html`
- `aniimo/fentuft/index.html`
- `aniimo/fulmintis/index.html`
- `aniimo/glacy/index.html`
- `aniimo/helion/index.html`
- `aniimo/index.html`
- `aniimo/lunara/index.html`
- `aniimo/magmarex/index.html`
- `aniimo/melloblum/index.html`
- `aniimo/nimbi/index.html`
- `aniimo/panpanta/index.html`
- `aniimo/scorchhowl/index.html`
- `aniimo/witchin/index.html`
- `authors/index.html`
- `codes/index.html`
- `community-reports/index.html`
- `contact/index.html`
- `copyright/index.html`
- `database/index.html`
- `faq/index.html`
- `glossary/index.html`
- `guides/accessibility-features/index.html`
- `guides/beginner-mistakes/index.html`
- `guides/catching-twine/index.html`
- `guides/confirmed-aniimo/index.html`
- `guides/core-gameplay/index.html`
- `guides/crossplay-cross-save/index.html`
- `guides/download-preload/index.html`
- `guides/editorial-policy/index.html`
- `guides/egg-heist/index.html`
- `guides/elements-roles/index.html`
- `guides/evolution-forms/index.html`
- `guides/free-to-play/index.html`
- `guides/getting-started/index.html`
- `guides/index.html`
- `guides/inherit-training/index.html`
- `guides/languages-voice-acting/index.html`
- `guides/launch-troubleshooting/index.html`
- `guides/level-titles-elite-training/index.html`
- `guides/mobile-launch/index.html`
- `guides/multiplayer/index.html`
- `guides/potential-personality/index.html`
- `guides/pre-registration/index.html`
- `guides/preorder-bundles/index.html`
- `guides/prismana-rare-forms/index.html`
- `guides/regions-world/index.html`
- `guides/release-date-platforms/index.html`
- `guides/research-aniilog/index.html`
- `guides/resonance-ascension/index.html`
- `guides/server-launch-times/index.html`
- `guides/steam-deck/index.html`
- `guides/system-requirements/index.html`
- `guides/team-setup/index.html`
- `index.html`
- `ja/404/index.html`
- `ja/about/index.html`
- `ja/advertising/index.html`
- `ja/aniimo/emberpup/index.html`
- `ja/aniimo/fentuft/index.html`
- `ja/aniimo/fulmintis/index.html`
- `ja/aniimo/glacy/index.html`
- `ja/aniimo/helion/index.html`
- `ja/aniimo/index.html`
- `ja/aniimo/lunara/index.html`
- `ja/aniimo/magmarex/index.html`
- `ja/aniimo/melloblum/index.html`
- `ja/aniimo/nimbi/index.html`
- `ja/aniimo/panpanta/index.html`
- `ja/aniimo/scorchhowl/index.html`
- `ja/aniimo/witchin/index.html`
- `ja/authors/index.html`
- `ja/codes/index.html`
- `ja/community-reports/index.html`
- `ja/contact/index.html`
- `ja/copyright/index.html`
- `ja/database/index.html`
- `ja/faq/index.html`
- `ja/glossary/index.html`
- `ja/guides/accessibility-features/index.html`
- `ja/guides/beginner-mistakes/index.html`
- `ja/guides/catching-twine/index.html`
- `ja/guides/confirmed-aniimo/index.html`
- `ja/guides/core-gameplay/index.html`
- `ja/guides/crossplay-cross-save/index.html`
- `ja/guides/download-preload/index.html`
- `ja/guides/editorial-policy/index.html`
- `ja/guides/egg-heist/index.html`
- `ja/guides/elements-roles/index.html`
- `ja/guides/evolution-forms/index.html`
- `ja/guides/free-to-play/index.html`
- `ja/guides/getting-started/index.html`
- `ja/guides/index.html`
- `ja/guides/inherit-training/index.html`
- `ja/guides/languages-voice-acting/index.html`
- `ja/guides/launch-troubleshooting/index.html`
- `ja/guides/level-titles-elite-training/index.html`
- `ja/guides/mobile-launch/index.html`
- `ja/guides/multiplayer/index.html`
- `ja/guides/potential-personality/index.html`
- `ja/guides/pre-registration/index.html`
- `ja/guides/preorder-bundles/index.html`
- `ja/guides/prismana-rare-forms/index.html`
- `ja/guides/regions-world/index.html`
- `ja/guides/release-date-platforms/index.html`
- `ja/guides/research-aniilog/index.html`
- `ja/guides/resonance-ascension/index.html`
- `ja/guides/server-launch-times/index.html`
- `ja/guides/steam-deck/index.html`
- `ja/guides/system-requirements/index.html`
- `ja/guides/team-setup/index.html`
- `ja/index.html`
- `ja/launch-verification/index.html`
- `ja/launch/index.html`
- `ja/map/index.html`
- `ja/news/beta-reward-account-linking/index.html`
- `ja/news/global-launch-dates/index.html`
- `ja/news/index.html`
- `ja/news/intel-cpu-stability-notice/index.html`
- `ja/news/launch-version-dev-letter/index.html`
- `ja/news/mobile-launch-live/index.html`
- `ja/news/pc-console-launch-faq/index.html`
- `ja/news/ps5-preorder-packs/index.html`
- `ja/news/september-23-version-1-1-update/index.html`
- `ja/news/steam-language-support/index.html`
- `ja/news/steam-launch-rewards-and-queues/index.html`
- `ja/patch-notes/index.html`
- `ja/privacy/index.html`
- `ja/server-status/index.html`
- `ja/terms/index.html`
- `ja/tier-list/index.html`
- `ja/tools/index.html`
- `launch-verification/index.html`
- `launch/index.html`
- `map/index.html`
- `news/beta-reward-account-linking/index.html`
- `news/global-launch-dates/index.html`
- `news/index.html`
- `news/intel-cpu-stability-notice/index.html`
- `news/launch-version-dev-letter/index.html`
- `news/mobile-launch-live/index.html`
- `news/pc-console-launch-faq/index.html`
- `news/ps5-preorder-packs/index.html`
- `news/september-23-version-1-1-update/index.html`
- `news/steam-language-support/index.html`
- `news/steam-launch-rewards-and-queues/index.html`
- `patch-notes/index.html`
- `privacy/index.html`
- `server-status/index.html`
- `sitemap.xml`
- `terms/index.html`
- `tier-list/index.html`
- `tools/index.html`
- `zh-cn/404/index.html`
- `zh-cn/about/index.html`
- `zh-cn/advertising/index.html`
- `zh-cn/aniimo/emberpup/index.html`
- `zh-cn/aniimo/fentuft/index.html`
- `zh-cn/aniimo/fulmintis/index.html`
- `zh-cn/aniimo/glacy/index.html`
- `zh-cn/aniimo/helion/index.html`
- `zh-cn/aniimo/index.html`
- `zh-cn/aniimo/lunara/index.html`
- `zh-cn/aniimo/magmarex/index.html`
- `zh-cn/aniimo/melloblum/index.html`
- `zh-cn/aniimo/nimbi/index.html`
- `zh-cn/aniimo/panpanta/index.html`
- `zh-cn/aniimo/scorchhowl/index.html`
- `zh-cn/aniimo/witchin/index.html`
- `zh-cn/authors/index.html`
- `zh-cn/codes/index.html`
- `zh-cn/community-reports/index.html`
- `zh-cn/contact/index.html`
- `zh-cn/copyright/index.html`
- `zh-cn/database/index.html`
- `zh-cn/faq/index.html`
- `zh-cn/glossary/index.html`
- `zh-cn/guides/accessibility-features/index.html`
- `zh-cn/guides/beginner-mistakes/index.html`
- `zh-cn/guides/catching-twine/index.html`
- `zh-cn/guides/confirmed-aniimo/index.html`
- `zh-cn/guides/core-gameplay/index.html`
- `zh-cn/guides/crossplay-cross-save/index.html`
- `zh-cn/guides/download-preload/index.html`
- `zh-cn/guides/editorial-policy/index.html`
- `zh-cn/guides/egg-heist/index.html`
- `zh-cn/guides/elements-roles/index.html`
- `zh-cn/guides/evolution-forms/index.html`
- `zh-cn/guides/free-to-play/index.html`
- `zh-cn/guides/getting-started/index.html`
- `zh-cn/guides/index.html`
- `zh-cn/guides/inherit-training/index.html`
- `zh-cn/guides/languages-voice-acting/index.html`
- `zh-cn/guides/launch-troubleshooting/index.html`
- `zh-cn/guides/level-titles-elite-training/index.html`
- `zh-cn/guides/mobile-launch/index.html`
- `zh-cn/guides/multiplayer/index.html`
- `zh-cn/guides/potential-personality/index.html`
- `zh-cn/guides/pre-registration/index.html`
- `zh-cn/guides/preorder-bundles/index.html`
- `zh-cn/guides/prismana-rare-forms/index.html`
- `zh-cn/guides/regions-world/index.html`
- `zh-cn/guides/release-date-platforms/index.html`
- `zh-cn/guides/research-aniilog/index.html`
- `zh-cn/guides/resonance-ascension/index.html`
- `zh-cn/guides/server-launch-times/index.html`
- `zh-cn/guides/steam-deck/index.html`
- `zh-cn/guides/system-requirements/index.html`
- `zh-cn/guides/team-setup/index.html`
- `zh-cn/index.html`
- `zh-cn/launch-verification/index.html`
- `zh-cn/launch/index.html`
- `zh-cn/map/index.html`
- `zh-cn/news/beta-reward-account-linking/index.html`
- `zh-cn/news/global-launch-dates/index.html`
- `zh-cn/news/index.html`
- `zh-cn/news/intel-cpu-stability-notice/index.html`
- `zh-cn/news/launch-version-dev-letter/index.html`
- `zh-cn/news/mobile-launch-live/index.html`
- `zh-cn/news/pc-console-launch-faq/index.html`
- `zh-cn/news/ps5-preorder-packs/index.html`
- `zh-cn/news/september-23-version-1-1-update/index.html`
- `zh-cn/news/steam-language-support/index.html`
- `zh-cn/news/steam-launch-rewards-and-queues/index.html`
- `zh-cn/patch-notes/index.html`
- `zh-cn/privacy/index.html`
- `zh-cn/server-status/index.html`
- `zh-cn/terms/index.html`
- `zh-cn/tier-list/index.html`
- `zh-cn/tools/index.html`
- `zh-tw/404/index.html`
- `zh-tw/about/index.html`
- `zh-tw/advertising/index.html`
- `zh-tw/aniimo/emberpup/index.html`
- `zh-tw/aniimo/fentuft/index.html`
- `zh-tw/aniimo/fulmintis/index.html`
- `zh-tw/aniimo/glacy/index.html`
- `zh-tw/aniimo/helion/index.html`
- `zh-tw/aniimo/index.html`
- `zh-tw/aniimo/lunara/index.html`
- `zh-tw/aniimo/magmarex/index.html`
- `zh-tw/aniimo/melloblum/index.html`
- `zh-tw/aniimo/nimbi/index.html`
- `zh-tw/aniimo/panpanta/index.html`
- `zh-tw/aniimo/scorchhowl/index.html`
- `zh-tw/aniimo/witchin/index.html`
- `zh-tw/authors/index.html`
- `zh-tw/codes/index.html`
- `zh-tw/community-reports/index.html`
- `zh-tw/contact/index.html`
- `zh-tw/copyright/index.html`
- `zh-tw/database/index.html`
- `zh-tw/faq/index.html`
- `zh-tw/glossary/index.html`
- `zh-tw/guides/accessibility-features/index.html`
- `zh-tw/guides/beginner-mistakes/index.html`
- `zh-tw/guides/catching-twine/index.html`
- `zh-tw/guides/confirmed-aniimo/index.html`
- `zh-tw/guides/core-gameplay/index.html`
- `zh-tw/guides/crossplay-cross-save/index.html`
- `zh-tw/guides/download-preload/index.html`
- `zh-tw/guides/editorial-policy/index.html`
- `zh-tw/guides/egg-heist/index.html`
- `zh-tw/guides/elements-roles/index.html`
- `zh-tw/guides/evolution-forms/index.html`
- `zh-tw/guides/free-to-play/index.html`
- `zh-tw/guides/getting-started/index.html`
- `zh-tw/guides/index.html`
- `zh-tw/guides/inherit-training/index.html`
- `zh-tw/guides/languages-voice-acting/index.html`
- `zh-tw/guides/launch-troubleshooting/index.html`
- `zh-tw/guides/level-titles-elite-training/index.html`
- `zh-tw/guides/mobile-launch/index.html`
- `zh-tw/guides/multiplayer/index.html`
- `zh-tw/guides/potential-personality/index.html`
- `zh-tw/guides/pre-registration/index.html`
- `zh-tw/guides/preorder-bundles/index.html`
- `zh-tw/guides/prismana-rare-forms/index.html`
- `zh-tw/guides/regions-world/index.html`
- `zh-tw/guides/release-date-platforms/index.html`
- `zh-tw/guides/research-aniilog/index.html`
- `zh-tw/guides/resonance-ascension/index.html`
- `zh-tw/guides/server-launch-times/index.html`
- `zh-tw/guides/steam-deck/index.html`
- `zh-tw/guides/system-requirements/index.html`
- `zh-tw/guides/team-setup/index.html`
- `zh-tw/index.html`
- `zh-tw/launch-verification/index.html`
- `zh-tw/launch/index.html`
- `zh-tw/map/index.html`
- `zh-tw/news/beta-reward-account-linking/index.html`
- `zh-tw/news/global-launch-dates/index.html`
- `zh-tw/news/index.html`
- `zh-tw/news/intel-cpu-stability-notice/index.html`
- `zh-tw/news/launch-version-dev-letter/index.html`
- `zh-tw/news/mobile-launch-live/index.html`
- `zh-tw/news/pc-console-launch-faq/index.html`
- `zh-tw/news/ps5-preorder-packs/index.html`
- `zh-tw/news/september-23-version-1-1-update/index.html`
- `zh-tw/news/steam-language-support/index.html`
- `zh-tw/news/steam-launch-rewards-and-queues/index.html`
- `zh-tw/patch-notes/index.html`
- `zh-tw/privacy/index.html`
- `zh-tw/server-status/index.html`
- `zh-tw/terms/index.html`
- `zh-tw/tier-list/index.html`
- `zh-tw/tools/index.html`

## 10. 发布前状态

READY_FOR_RELEASE：本地全部可执行门槛已通过，没有发现未解决的高严重度P0缺陷；外部NOT_VERIFIED事项不伪装成已完成。此状态不授予提交或生产发布权限。

后续若发布需另按本任务约定取得发布指令。本轮不使用项目常规自动发布授权覆盖本次文档明确的本地限制；不进行commit、push或部署。既有根目录审计报告保留，所有测试仅使用隔离浏览器上下文和临时本地数据，没有清理真实用户收藏。拥有的本地预览服务器在交付前关闭。
