# ANIIMOGG P1-D.1 运营核验报告

## 当前结果与维护后复核

本轮来源检查：2026-11-12T06:17:54.584Z。当前未到北京时间2026-11-12 19:15，**维护后核验待执行**，不得写成维护完成或 APAC 恢复。已创建一次性 Codex heartbeat `aniimogg`，计划本日19:15，完成后停止；执行依赖本机 Codex 可运行，若未执行不得声称已经核验。

官方 [100298](https://www.aniimo.com/newslist/detail/100298) 与100244正文哈希未变，新官方详情链接0。Steam公告列表有动态内容哈希变化，人工查看最新仍为11月9日预告，不能解释为新版本已开放。计划三个维护窗口均截至11:00 UTC（北京时间19:00）；实际时长可变。**AWAITING_UPDATE_CONFIRMATION** 保留。

| 核查项 | 当前证据结论 |
|---|---|
| 维护完成、APAC恢复、新版本 | 无维护完成正式公告；UNKNOWN |
| Prismana Snapshots / Aniimo Dash | 仅更新预告；实际开放 UNKNOWN |
| Aniimo Affinity / 两项Crescent Bay故事 | 预告内容存在，不证明本次实际开放 |
| Glimmer × 500 | 官方预告资格：Season 2版本更新前注册；实际发放、领取方式和期限 UNKNOWN |
| Whirlbite重置 | 预告时间及重置规则已保留；是否实际执行 UNKNOWN |
| Valiant Knight / Shadow Rose / Homeland | 批次及实际开放信息未获新确认；UNKNOWN |

未登录游戏，未测试APAC登录或兑换；不以网页HTTP200推断游戏服务恢复。

## 活动与奖励字段

逐条审查16项活动、27项奖励，完整字段快照 `artifacts/aniimogg-p1-d1/field-audit.json`。
所有实际开始时间仍为空，未生成虚构 actualStartAt。27项奖励 claimStartAt、claimEndAt 均未知，均不以 scheduledEndAt 推算领取截止。sourceCheckedAt 为既有已核对来源时间，verifiedAt 为人工核对时间；本次无内容证据变更，未批量刷新生产字段日期。具体服务器时区及分阶段计划保持原值。

持续未知项包括：16项活动实际开放/结束确认、27项领取起止时间、Snapshots目标、补偿发放方式、服装批次及12条代码有效性。完整ID见只读 monitor/report.json 的 operations。

## 12条兑换码

原始来源：[PC Gamer](https://www.pcgamer.com/games/rpg/aniimo-codes/)，交叉参考为普通Steam用户讨论而非官方。两来源本次均HTTP200；原文仍列出12条记录，文章旧内容不构成新的有效性证据。最近实际来源访问记录在 code-sources.json；不把访问时间当成官方验证时间。本站没有游戏内实兑证据，未导入新代码。

| 代码 | 原始来源/日期 | 本次来源访问 | 新有效证据 | 明确到期 | 官方确认 | 游戏内实兑 | 状态 |
|---|---|---|---|---|---|---|---|
| aniimofreetoplay | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimotogether | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimoidyll | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimowelcome | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| twinewithaniimo | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| anyoneaniimo | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimoopenworld | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimolaunch2026 | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimobonus | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| ANIIMOGIFT | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| Aniimo2026 | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |
| aniimoparty | PC Gamer / 2026-09-16（内容更新09-24） | 2026-11-12 06:18 UTC | 无 | UNKNOWN | 无 | 无 | NEEDS_RECHECK |

aniimoparty 的历史第三方过期报告继续保留，不改写为官方到期日。生产 sourceCheckedAt=2026-09-28 为既有历史来源核验字段，本次访问单独记录，不能据此重置7日有效性复核状态。

## 自动检查

每日北京时间10:00（UTC02:00）原计划保留。最近既有执行 [43163692618](https://github.com/xuniyoucai-sudo/aniimogg/actions/runs/43163692618) 成功；来源步骤、Summary输出、Artifact上传及编辑跟进Issue步骤成功，Artifact official-event-source-review 未过期。该运行是既有手动执行，不能冒称今日定时触发。

本次补充只读队列：开始前24小时、计划结束后、领取开始/截止前24小时、代码7日复核、未知活动和领取时间持续跟踪。提醒不会自动将活动置为ACTIVE或结束。已核对日期可消除对应时间提醒；未来伪造核验时间不得消除提醒。未知项独立保留。

新公告发现及已有正文变化检测保留。网络失败逐来源记录 error/needsRecheck，Summary及Artifact保留，不将失败解释为无变化。Workflow权限仍只有 contents:read / issues:write，无提交、推送或部署步骤；只读运行不会触发Cloudflare。人工确认有实质证据后才允许更新数据。

## 保护与发布记录

未修改生产活动/奖励/兑换码数据、四语言HTML、manifest及应用资源。原130角色、收藏、Team Builder、Region Explorer、168 Sitemap URL、DNS/CSP/广告/ads.txt/缓存规则均未修改。

基线提交：4ef1b589f2849e38dfbf250a1d285432a48f5494。本次代码范围仅运营检查逻辑、单元测试、现有workflow门禁及本报告。npm run audit:local 已通过；运营队列测试通过；git diff --check通过。实施提交：`849eae9545361eead3539cc8d876d109c926f276`，已正常推送main（无force）。[GitHub验证43167363588](https://github.com/xuniyoucai-sudo/aniimogg/actions/runs/43167363588)成功；[新检查器运行43167372849](https://github.com/xuniyoucai-sudo/aniimogg/actions/runs/43167372849)成功，5个来源无网络错误，Summary与Artifact归档成功，检测新公告0、待复核代码12、未知活动16、未知领取27。

Cloudflare部署 `18c83ae5-4dcb-470f-8eed-bf9a2dcf90fc` 成功；控制台实际确认类型Production、来源main、完整提交对应849eae9，域名仍aniimogg.com/www。部署地址 https://18c83ae5.aniimogg.pages.dev 。本次是检查代码发布触发的既有Git Integration；日常纯只读检查无push路径，不触发生产发布。

正式域名四语言Events/Codes/Patch Notes共12页HTTP200，canonical正确、JSON-LD可解析，无旧固定query资源。Sitemap及ads.txt与仓库字节一致；robots线上含既有Cloudflare托管前缀，完整响应SHA-256与上一生产证据一致（不是强行与仓库裸文件比较）。共15项线上检查通过，证据online-checks.json。应用数据及保护文件相对基线diff为空。没有回滚。本报告补充归档提交会再次执行既有发布门禁，最终归档提交及部署记录保存在本轮artifacts与交付回复，避免报告自引用提交循环。

## 尚未完成

19:15后官方核验尚未执行，由一次性后续任务处理。当前所有无证据的开放、领取及兑换状态继续UNKNOWN/待确认。没有维护后结果就不声称11月12日更新实际已开放。
