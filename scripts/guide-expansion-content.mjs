import fs from 'node:fs';
export const expansionSlugs=['controls-keyboard-controller-mobile','photo-mode','alpha-omega-boss-preparation'];
const content=JSON.parse(fs.readFileSync(new URL('../src/locales/guide-expansion.json',import.meta.url),'utf8'));
const labels={
 en:['Community input reference — September 17, 2026, version 1.0; not site-tested','Community camera reference — September 17, 2026, version 1.0; not site-tested','Official November 9 notice: Prismana Snapshots rules','Third-party boss directory — historical/beta records; topic context only'],
 'zh-CN':['社区按键参考：2026年9月17日1.0记录，非本站实测','社区相机参考：2026年9月17日1.0记录，非本站实测','11月9日官方公告：Prismana Snapshots规则','第三方头目目录：含历史／封测资料，仅作主题背景'],
 'zh-TW':['社群按鍵參考：2026年9月17日1.0記錄，非本站實測','社群相機參考：2026年9月17日1.0記錄，非本站實測','11月9日官方公告：Prismana Snapshots規則','第三方頭目目錄：含歷史／封測資料，僅作主題背景'],
 ja:['コミュニティ操作資料：2026年9月17日・1.0、当サイト実測ではありません','コミュニティ撮影資料：2026年9月17日・1.0、当サイト実測ではありません','11月9日公式告知：Prismana Snapshotsの規則','第三者ボス一覧：過去・ベータ資料を含む、テーマの参考のみ']
};
export function applyGuideExpansion({locales}){
 for(const l of locales){
  if(!content[l.lang])throw Error('Missing expansion language '+l.lang);
  for(const slug of expansionSlugs)l.guides[slug]=structuredClone(content[l.lang][slug]);
  const q=labels[l.lang];
  l.guides[expansionSlugs[0]].sources=[[q[0],'https://aniimo.guide/en/guides/controls-keyboard-controller-mobile']];
  l.guides['photo-mode'].sources=[[q[1],'https://aniimo.guide/en/guides/photo-mode'],[q[2],'https://www.aniimo.com/newslist/detail/100298']];
  l.guides[expansionSlugs[2]].sources=[[q[3],'https://www.aniimoverse.com/guides/world-bosses']];
 }
}
