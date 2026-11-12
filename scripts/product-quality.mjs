// Local editorial corrections. No source-date is advanced merely by building a page.
export const qualityReviewDate='2026-11-11';
export const sourceType=url=>/(^https:\/\/([^/]+\.)?aniimo\.com\/|playstation\.com|store\.steampowered\.com|store\.epicgames\.com)/.test(url)?'official':'community-reported';
export function applyProductQuality({locales,utilityCopy,launchCopy,copy,manifest,snapshot,toTraditional,data}){
 utilityCopy['zh-TW']=toTraditional(utilityCopy['zh-CN']);launchCopy['zh-TW']=toTraditional(launchCopy['zh-CN']);
 const fill=(text)=>text.replaceAll('{records}',String(snapshot.counts.totalRecords)).replaceAll('{basic}',String(snapshot.counts.basicRecords)).replaceAll('{prismana}',String(snapshot.counts.prismanaRecords)).replaceAll('{date}',manifest.snapshotDate);
 for(const l of locales){
  const q=copy[l.lang],uc=utilityCopy[l.lang],lc=launchCopy[l.lang];
  q.snapshot=fill(q.snapshot);l.quality=q;if(q.catalogue)Object.assign(l.aniimoIndex,q.catalogue);l.aniimoIndex.showing=fill(q.showing);l.aniimoIndex.collectionCount=q.collectionCount;
  l.common.search=q.search;l.common.officialSource=q.source;l.common.writtenBy=q.byline;l.common.imageCredit=q.graphicCredit;
  l.common.browseAllAniimo=q.browse+' · '+snapshot.counts.totalRecords+' '+q.forms;
  l.common.aniimoIndexLead=q.snapshot;l.common.communityEvidence=q.community;l.common.statusBeta=q.historical;
  l.nav.map=q.mapName;l.nav.tierList=q.compareName;
  Object.assign(l.pages.map,{title:q.mapTitle,h1:q.mapName,description:q.mapLead,lead:q.mapLead});
  Object.assign(l.pages['tier-list'],{title:q.compareTitle,h1:q.compareName,description:q.compareLead,lead:q.compareLead});
  l.pages['tier-list'].links[0][0]=l.common.browseAllAniimo;
  lc.mapStatus=q.mapLead;lc.mapTitle=q.mapName;lc.mapText=q.mapLead;
  lc.check=q.ramTitle;lc.result=q.ramButton;
  lc.newsTitle=l.pages.news.h1;lc.newsLead=q.newsArchive;l.pages.news.lead=q.newsArchive;l.pages.news.description=q.newsArchive;
  uc.pages.codes=[q.codeTitle,q.codeLead,q.codeName,q.codeLead];uc.codeSections=uc.codeSections.filter((_,i)=>i>0);
  uc.pages['patch-notes'][3]=q.patchArchive;uc.pages['patch-notes'][1]=q.patchArchive;
  uc.pages['launch-verification'][3]=q.verification;uc.pages['launch-verification'][1]=q.verification;
  // Homepage FAQ data and the catalogue answer are derived, never independently counted.
  l.home.section=q.recentGuides;l.home.sectionLead=q.recentScope;
  l.home.faq[2]=[q.countQuestion,q.snapshot];l.home.sections[3][1]=q.snapshot;l.home.sections[3][3]=q.browse;
  l.home.lead=q.siteLead;l.home.cards[0]=[q.browse,snapshot.counts.totalRecords+' '+q.forms];
  l.aniimoIndex.note=q.snapshot;l.aniimoIndex.title=l.common.browseAllAniimo;l.aniimoIndex.showing=l.aniimoIndex.showing.replaceAll('130',String(snapshot.counts.totalRecords));l.aniimoIndex.collectionLocal={en:'Saved only in this browser; no game ownership or account sync.', 'zh-CN':'仅保存于当前浏览器，不代表游戏拥有状态，不同步游戏账号。','zh-TW':'僅儲存於目前瀏覽器，不代表遊戲擁有狀態，不與遊戲帳號同步。',ja:'このブラウザー内のみ。ゲームの所持状況やアカウントとは同期しません。'}[l.lang];
  const g=l.guides['confirmed-aniimo'];for(const field of ['title','h1','description'])g[field]=g[field].replaceAll('130',String(snapshot.counts.totalRecords));l.aniimoIndex.overviewLead=q.snapshot;g.body[0][1]=q.snapshot;g.faq[0]=[q.countQuestion,q.snapshot];
  // Replace stale present-tense snapshot paragraphs with explicitly dated historical facts.
  for(const key of ['body','extraBody'])if(g[key])g[key]=g[key].map(row=>{
   if(/total remains 118|verified official index now contains 118|当前.*118|目前.*118|現在.*118|合計は118/.test(row[1]))return [row[0],{en:'Historical snapshots: 86 records on 2026-09-23; 118 on 2026-10-30 and 2026-11-05. These are past index states, not the current form count. No gameplay buff or species relationship is inferred.','zh-CN':'历史快照：2026-09-23 为 86 条，2026-10-30 与 2026-11-05 为 118 条。这些是过去索引状态，不是当前形态数量，也不代表游戏增强或物种关系。','zh-TW':'歷史快照：2026-09-23 為 86 條，2026-10-30 與 2026-11-05 為 118 條。這些是過去索引狀態，不是目前形態數量，也不代表遊戲增強或物種關係。',ja:'過去のスナップショット：2026-09-23は86件、2026-10-30と2026-11-05は118件です。現在のフォーム件数ではなく、ゲーム内の強化や種の関係を示しません。'}[l.lang]];return row;
  });
  // Unambiguous public contact and honest identity; no invented private mailbox/reviewer.
  for(const name of ['contact','copyright'])l.pages[name].sections.push([q.source,q.contactLimit]);
  for(const name of ['about','authors'])l.pages[name].sections.push([q.byline,q.authorNote]);
  l.pages.authors.lead=q.authorNote;l.pages.authors.description=q.authorNote;
  l.pages.privacy.lead=q.privacyAds;l.pages.advertising.lead=q.privacyAds;
  for(const name of ['privacy','advertising'])l.pages[name].sections=l.pages[name].sections.map(row=>[row[0],/ads|advert|cookies|consent|广告|廣告|cookie|同意|クッキー|広告/i.test(row[0])?q.privacyAds:row[1]]);
  l.pages.advertising.sections[0][1]=q.privacyAds;
  for(const name of ['privacy','advertising']){const seen=new Set();l.pages[name].sections=l.pages[name].sections.filter(row=>{if(seen.has(row[1]))return false;seen.add(row[1]);return true;});}
  l.pages.privacy.sections.push([q.reviewDate,qualityReviewDate]);
  l.pages.advertising.sections.push([q.reviewDate,qualityReviewDate]);

  for(const term of uc.glossary){
   if(/^(Crossplay|跨平台联机|跨平台聯機|クロスプレイ)$/.test(term[0]))term[1]=q.crossplayTerm;
   if(term[0]==='Prismana')term[1]=q.prismanaTerm;
   if(term[0]==='Egg Heist')term[1]=q.eggTerm;
  }
  // Never treat a page's historic "verified" enum as an official or site-tested claim.
  l.common.statusOfficial=q.official;
 }
 for(const [id,m] of Object.entries(data.guideMeta)){
  m.sourceStatus=m.status;
  m.status=id==='editorial-policy'||id==='team-setup'?'editorial':m.status==='verified'?'mixed':m.status==='official'?(id==='confirmed-aniimo'?'official':'mixed'):'unverified';
  m.lastReviewedAt=m.updated;m.modifiedAt=m.modifiedAt||qualityReviewDate;
 }
}
export function blockEvidence({id,heading,text,q}){
 if(id==='editorial-policy')return q.editorial;
 if(id==='team-setup'&&!/official labels|official Compendium|公式.*分類|官方.*标签|官方.*標籤/.test(heading))return q.editorial;
 if(/editorial|checklist|safe |Aniimo.GG recommends|本站建议|本站建議|核对清单|核對清單|チェックリスト/i.test(heading+' '+text))return q.editorial;
 return q.mixed;
}
