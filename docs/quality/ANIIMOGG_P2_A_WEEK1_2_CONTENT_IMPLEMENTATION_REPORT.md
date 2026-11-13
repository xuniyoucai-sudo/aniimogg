# ANIIMOGG P2-A Week 1.2 内容实施报告

执行日期：2026-11-14（Asia/Shanghai）。当前状态：本地实施完成，发布验证进行中；本节将在取得实际部署结果后更新，不将待执行操作记为通过。

## 实际修改与四语言结果

只更新六个现有主题的EN、简中、繁中、日文，共24个主页面。保留原URL；攻略目录、首页或相关文章中引用这些标题和摘要的文本随构建同步更新，不新增重复文章。

| 原路径（另有zh-cn、zh-tw、ja前缀） | 实施内容 |
| --- | --- |
| /guides/inherit-training/ | 作用及Capafruit官方确认置前；其他当前官方字段UNKNOWN；操作前清单、FAQ、共鸣／图鉴／Team Builder内链；保留1.0社区观察与独立限时重置 |
| /guides/crossplay-cross-save/ | 同服共享短答案、联机与存档区分；四语言8行平台／账号／服务器矩阵；解绑后果UNKNOWN；多人与Deck内链 |
| /guides/elements-roles/ | 四语言首屏区分官方分类与未证实倍率；繁中九属性、五定位采用官方显示词，不改变内部键 |
| /guides/confirmed-aniimo/ | 在构建标题覆盖之后应用最终title/H1/导语；索引分组不冒称地图区域；保持130条记录及entityId |
| /guides/multiplayer/ | 多人答案提前；Holo-Battle四人／AI、初始Egg Heist三人范围及Dash特定八人公告分开；两种Affinity继续分离 |
| /guides/steam-deck/ | 旧Playable记录明确为历史记录，当前面板未重新核实；无本站实机测试；安全排错，不虚构性能或推荐关闭安全保护 |

繁中新增内容单独人工校对，目标文章残留“账號／绑定／状態／兼容”等显示词定向修正。日文实体名不从英文翻译：以官方公开路径、形态及稳定字段逐条核对现有130条名称，无名称或ID变化。原始核验材料仅保存在私有artifacts。

## 新增或重新组织的事实与来源

| 事实 | 来源及范围 |
| --- | --- |
| Capafruit效果在Inherit时自动转移 | [官方开发者信，2026-09-03](https://www.aniimo.com/de/newslist/detail/100064)，/de路径的英文正文；不延伸为完整转移／保留表 |
| 同服进度共享、跨服数据独立 | [官方PC／主机FAQ，2026-09-14](https://www.aniimo.com/newslist/detail/100089)、[移动FAQ，2026-09-22](https://www.aniimo.com/newslist/detail/100137)；不承诺通用钱包、转服、合并或恢复 |
| 在线合作、PvP、跨平台多人 | [Steam官方商店](https://store.steampowered.com/app/4126040/Aniimo/)；不证明每一平台组合或剧情主客进度 |
| Holo-Battle四人或AI队友 | [官方1.1公告，2026-09-21](https://www.aniimo.com/newslist/detail/100145)；限定模式 |
| Speed Showdown最多八名探路者 | [2026-11-09发布的11月12日更新预告](https://www.aniimo.com/newslist/detail/100298)；不是所有模式统一上限或服务器可用性检测 |
| 繁中九属性及五定位、日文名称 | [官方繁中Wiki](https://wiki.aniimo.com/tw)、[官方日文Wiki](https://wiki.aniimo.com/ja/)；分类显示不构成完整正式服克制倍率表 |
| Playable与Verified类别区别 | [Valve说明](https://www.steamdeck.com/en/verified)；Aniimo当前评级详情仍未重新核实 |

现有来源、带日期的首登与奖励说明、11月5日Steam/Epic菜单历史记录继续保留。未把旧记录称为本轮重新验证。社区观察继续标注1.0及来源，既不是当前官方保证，也不是本站实测。

## UNKNOWN与GSC边界

未添加固定继承费用、完整资格、完整保留清单、撤销或恢复保证。个体Affinity的继承交互、解绑后果、各平台逐对匹配、完整倍率及Deck实测参数保持UNKNOWN。

仅用既有三项真实精确Query→Pages作为优先级依据。另六项页面维度仍UNKNOWN；本轮再次定位正确GSC标签，但绑定/读取仍失败，停止重复调用。没有把查询聚合指标填入页面级字段，没有认定全站不存在蚕食，也没有合并或重定向主题近似的页面。详细查询及原始数据不进入公开GitHub。

## SEO与用户改动保护

保留canonical、四语言hreflang、x-default、robots/noindex、既有重定向及原168个sitemap URL集合；工具页noindex不变。新增回归检查最终title/H1与Article一致、FAQ结构化数据与可见正文一致、资源指纹、UNKNOWN和实体名称。

只有24个实际改文主页面的编辑评审日期、Article dateModified及sitemap lastmod更新到2026-11-14。保留原官方公告和历史来源日期，不伪装成新发布事实。最终复核修正了评审提示沿用旧日期的问题；目录和首页现有入口同步反映实际更新。未改GA4、隐私声明、广告、CSP、响应头、DNS或缓存规则。既有用户报告改动和所有原未跟踪文件保留且不混入提交。

## 验证与发布

本地门禁全部PASS：`npm test`、`npm run audit:local`（含构建、全测试与性能检查）、单独`npm run check:performance`、`npm run check:aniimo-index`、`git diff --check`。所有命令均为项目真实脚本。首轮发现的日文HTML预算超限已通过精简导语修复，没有放宽预算；旧断言的固定日期及旧繁中标签已更新，并新增本轮24页回归检查。

本地真实Chrome验收PASS：24页、移动390px与桌面1440px共48组布局检查，最终标题/H1、canonical、hreflang、Article/FAQ、第一方资源响应SHA256、FAQ键盘操作和日文正式名搜索。静态保护检查覆盖所有已跟踪HTML的索引策略，24个实际改文日期变化，其他Article日期不变。全部130个日文官方名称重新逐条匹配成功；官方索引130/130，无差异。

独立分支：`codex/p2-a-week1-2-content`。Preview和Production尚待取得实际发布结果，不将本地验收冒充远端验收。

## 回滚与未解决事项

仅在真实部署或关键线上验收失败时回滚本轮内容，不触碰用户已有改动或其他系统；尚未发生生产变更或回滚。GSC六项缺口、正确GA4资源归属、当前Deck评级、Steam/Epic解绑后果及其他UNKNOWN继续保留。
