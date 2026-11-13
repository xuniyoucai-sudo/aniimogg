import {expiredEventReviews,operationReviews} from './official-event-review.mjs';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {affinityReview} from './affinity-review.mjs';
const output=process.env.EVENT_ARTIFACTS||'artifacts/aniimogg-p1-d/monitor';fs.mkdirSync(output,{recursive:true});
export const normalize=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const data=JSON.parse(fs.readFileSync('src/data/aniimo-events.json')),baseline=JSON.parse(fs.readFileSync('src/data/official-events-baseline.json'));
const affinityWatch=JSON.parse(fs.readFileSync('src/data/affinity-watch.json'));
const affinityBaseline=JSON.parse(fs.readFileSync('src/data/affinity-source-baseline.json'));
const urls=[...new Set(['https://www.aniimo.com/main','https://www.aniimo.com/newslist','https://steamcommunity.com/app/4126040/announcements/',...data.events.map(e=>e.sourceUrl),...affinityWatch.sources.map(s=>s.url)])];
const results=[],queue=[...urls],seen=new Set(urls);
const knownNoticeIds=new Set([...baseline.knownLinks,...urls].map(u=>u.match(/\/detail\/(\d+)/)?.[1]).filter(Boolean));
await Promise.all(Array.from({length:3},async()=>{while(queue.length){const url=queue.shift();try{
 const response=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'AniimoGG official-notice review (+https://aniimogg.com/)'}});
 if(!response.ok)throw Error('HTTP '+response.status);
 const html=await response.text(),text=normalize(html),sha256=createHash('sha256').update(text).digest('hex'),title=html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]||null,dates=[...new Set(text.match(/2026[-/]\d{2}[-/]\d{2}/g)||[])];
 const links=[...new Set([...html.matchAll(/(?:https:\/\/www\.aniimo\.com)?\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?newslist\/detail\/(\d+)/g)].map(m=>'https://www.aniimo.com/newslist/detail/'+m[1]))];
 // Only official notices are followed. Third-party outbound links are not promoted to evidence.
 const source=affinityWatch.sources.find(s=>s.url===url),kind=source?.kind||'official';
 if(kind==='official')for(const next of links){const id=next.match(/\/detail\/(\d+)/)[1];if(!seen.has(next)&&!knownNoticeIds.has(id)&&seen.size<40){seen.add(next);knownNoticeIds.add(id);queue.push(next);}}
 const affinity=affinityReview(html,affinityBaseline[url]);
 const snapshotFile='source-'+createHash('sha256').update(url).digest('hex').slice(0,16)+'-'+sha256.slice(0,16)+'.html';
 fs.writeFileSync(output+'/'+snapshotFile,html);
 results.push({url,title,dates,sha256,checkedAt:new Date().toISOString(),changed:baseline[url]?baseline[url]!==sha256:null,links,kind,language:source?.language||null,publishedAt:source?.publishedAt||null,lastModified:response.headers.get('last-modified'),snapshotFile,affinity});
 }catch(e){results.push({url,error:e.message,needsRecheck:true});}}}));
const tracked=new Set([...data.events.map(e=>e.sourceUrl),...affinityWatch.sources.map(s=>s.url)].map(u=>u.replace(/\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?newslist\/detail\//,'/newslist/detail/'))),newLinks=[...new Set(results.filter(r=>r.kind==='official').flatMap(r=>r.links||[]))].filter(u=>!baseline.knownLinks.includes(u)&&!tracked.has(u));
const expired=expiredEventReviews(data.events);
const operations=operationReviews({events:data.events,rewards:JSON.parse(fs.readFileSync('src/data/aniimo-rewards.json')),codes:JSON.parse(fs.readFileSync('src/data/gift-codes.json')).records});
const affinity={topic:affinityWatch.topic,numericStatus:'UNVERIFIED_REVIEW_ONLY',unknownMetrics:affinityWatch.unknownMetrics,requiresReview:results.some(r=>r.error||r.affinity?.changed===true||(!affinityBaseline[r.url]&&r.affinity?.matchedTerms.length))};
const report={checkedAt:new Date().toISOString(),readOnly:true,affinity,operations,results,newLinks,expired,requiresReview:affinity.requiresReview||results.some(r=>r.changed||r.error)||!!newLinks.length||!!expired.length||Object.values(operations).some(a=>a.length)};fs.writeFileSync(output+'/report.json',JSON.stringify(report,null,2)+'\n');
const summary=`## Official event source review\n\n${report.requiresReview?'Editorial review required.':'No source changes detected.'}\n\n${results.map(r=>`- [${r.title||r.url}](${r.url}): ${r.error|| (r.changed===null?'no event baseline':r.changed?'changed':'unchanged')}`).join('\n')}\n\nNew notices: ${newLinks.length}; events past a scheduled end: ${expired.length}.\n\nOperational queues: ${JSON.stringify(operations)}\n\nThis job does not confirm a game release, edit production data, commit or deploy.\n`;
const affinitySummary=`\n## Aniimo Affinity evidence watch\n\n${affinity.requiresReview?'Evidence/scope review required.':'No tracked Affinity evidence change detected.'} Numeric candidates are never verified facts.\n\n${results.filter(r=>r.affinity?.matchedTerms.length||r.error).map(r=>`- ${r.url}: ${r.error||`${r.kind}; ${r.affinity.scope}; changed=${r.affinity.changed}; numeric candidates=${r.affinity.numericCandidates.length}; +${r.affinity.added.length}/-${r.affinity.removedHashes.length}`}`).join('\n')}\n\n14 metrics remain UNKNOWN until source and individual-Aniimo scope are reviewed. See report.json and source snapshots for differences. This read-only workflow never edits articles or publishes; the 10:00 local editorial task performs verified maintenance.\n`;
fs.writeFileSync(output+'/summary.md',summary+affinitySummary);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary+affinitySummary);
if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`review=${report.requiresReview}\n`);console.log(summary);
