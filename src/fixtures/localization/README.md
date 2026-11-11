# 官方本地化证据

抓取日期：2026-11-11（实际日期，与原始游戏索引快照日期分开）。

- en: https://wiki.aniimo.com/
- zh-CN: https://wiki.yimo.com/
- zh-TW: https://wiki.aniimo.com/tw
- ja: https://wiki.aniimo.com/ja

各 `LANG.html.gz` 是官方索引真实SSR响应的gzip副本；原始HTML SHA-256见 `src/data/aniimo-localizations.json`。`LANG-detail.html.gz` 为各官方域名/前缀下 `/item/001/basic-form`，`LANG-prismana.html.gz` 为 `/item/035/prismana-form/1000`，用于核对官方形态术语。未经重写或自行制作。

四语言源记录ID不相同，不可假定跨语言ID相等。按英文原始sourceRecordId定位既有记录，使用确切公开路径（去掉tw/ja前缀）及countryId、形态、sortOrder、阶段、定位、元素和立绘文件名交叉核验。重复显示编号不会合并不同实体。仅名称层更新，原始快照不改。

完整520个官方详情URL的HTTP状态、title、各语言ID和响应SHA证据保存在本轮 `artifacts/aniimogg-p1-a1/official/detail-results.json`。离线测试不冒充实时HTTP测试。
