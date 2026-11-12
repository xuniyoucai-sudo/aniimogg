import fs from 'node:fs';import assert from 'node:assert/strict';
import {normalizeSnapshot} from './aniimo-snapshot.mjs';import {giftCodeStatus} from './gift-code-status.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const rows=read('src/data/aniimo-index.json'),manifest=read('src/data/aniimo-index-manifest.json'),site=read('src/data/site.json'),copy=read('src/locales/product-quality.json');
const {entities,counts,legacyToEntity}=normalizeSnapshot(rows,manifest,site.aniimoAliases);
assert.deepEqual(counts,{totalRecords:130,basicRecords:118,prismanaRecords:12});assert.equal(counts.totalRecords,counts.basicRecords+counts.prismanaRecords);
assert.equal(new Set(entities.map(e=>e.entityId)).size,130);assert.equal(Object.keys(legacyToEntity).length,130);assert.notEqual(legacyToEntity['001'],legacyToEntity['300301:001']);
for(const e of entities){assert.equal(e.familyId,null);assert.equal(e.speciesId,null);assert.equal(e.parentFormId,null);assert.equal(e.gameVersion,null);assert.equal(e.lastVerifiedAt,'2026-11-06');if(e.stageCode===4)assert.equal(e.stageLabel,null);assert.equal(legacyToEntity[e.entryKey],e.entityId);}
assert.equal(entities.filter(e=>e.stageCode===4).length,2);
const review=read('src/data/publication-review.json');assert.equal(review.news.coverageEndsAt,'2026-09-23');assert.equal(review.calendar.records.filter(r=>r.status==='ended').length,5);assert.equal(review.patches.length,8);for(const item of review.patches){const checked=item.sourceUrl.endsWith('/100298');assert.equal(item.sourceCheckedAt,checked?'2026-11-12':null);assert.equal(item.lastReviewedAt,checked?'2026-11-12':'2026-11-11');}
const codes=read('src/data/gift-codes.json');assert.equal(codes.records.length,12);assert.equal(codes.records.filter(r=>r.reportedStatus==='reported_expired').length,1);
for(const r of codes.records){assert.equal(r.sourceCheckedAt,'2026-09-28');assert.equal(r.expiryAt,null);assert.equal(r.siteRedemptionTest,null);assert.equal(giftCodeStatus(r,{asOf:'2026-11-11T00:00:00Z',freshnessDays:7}),r.reportedStatus==='reported_expired'?'reported_expired':'needs_recheck');}
assert.equal(giftCodeStatus({...codes.records[0],sourceCheckedAt:'invalid'},{asOf:'2026-11-11',freshnessDays:7}),'needs_recheck');
const example=codes.records[0];assert.equal(giftCodeStatus(example,{asOf:'2026-10-05T00:00:00Z',freshnessDays:7}),'third_party_reported_active');assert.equal(giftCodeStatus(example,{asOf:'2026-10-05T00:00:01Z',freshnessDays:7}),'needs_recheck');
const policyUrls=[...site.routes.filter(r=>!site.noindexRoutes.includes(r)),...site.guideArticles.filter(r=>!site.noindexGuideArticles.includes(r)).map(r=>'guides/'+r)].flatMap(r=>['','zh-cn/','zh-tw/','ja/'].map(p=>'https://aniimogg.com/'+p+r+(r?'/':'')));
const sitemap=fs.readFileSync('sitemap.xml','utf8'),urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);assert.deepEqual([...urls].sort(),policyUrls.sort());assert.equal(urls.length,168);
for(const [lang,prefix] of [['en',''],['zh-CN','zh-cn/'],['zh-TW','zh-tw/'],['ja','ja/']]){
 const html=p=>fs.readFileSync(prefix+p+'/index.html','utf8');const home=fs.readFileSync(prefix+'index.html','utf8'),catalogue=html('guides/confirmed-aniimo');
 assert.ok(home.includes(copy[lang].forms));assert.ok(home.includes('2026-11-06'));assert.ok(!home.includes('August 30')&&!home.includes('8 月 30')&&!home.includes('8月30'));
 assert.ok(home.includes(copy[lang].searchScope));assert.equal((catalogue.match(/id="aniimo-catalogue"/g)||[]).length,1);assert.ok(catalogue.includes('<section id="aniimo-catalogue"'));assert.ok(!catalogue.includes('<fig<section'));assert.ok(catalogue.includes('data-template='));assert.ok(catalogue.includes('"numberOfItems":130'));
 assert.equal((catalogue.match(/data-entity-id=/g)||[]).length,130);
 for(const route of ['map','tier-list'])assert.ok(html(route).includes('noindex,follow'));
 assert.ok(html('codes').includes('data-mode="codes"'));assert.ok(!html('codes').includes('reported-codes'));assert.ok(!html('codes').includes('event-archive'));assert.ok(!html('codes').includes('Confirmed Redemption Codes'));
 assert.ok(html('guides/editorial-policy').includes(copy[lang].editorial));assert.ok(html('guides/team-setup').includes(copy[lang].editorial));
 assert.ok(html('privacy').includes(copy[lang].privacyAds));assert.ok(html('advertising').includes(copy[lang].privacyAds));assert.ok(html('contact').includes(copy[lang].contactLimit));
 assert.ok(html('news').includes(copy[lang].newsArchive));assert.ok(html('launch-verification').includes(copy[lang].verification));
 for(const r of site.guideArticles){const page=html('guides/'+r);assert.ok(page.includes(site.guideMeta[r].updated),r+' original fact review date missing');assert.ok(page.includes('"dateModified":"'+(site.guideMeta[r].modifiedAt||'2026-11-11')+'"')); }
}
console.log('PASS quality: 130/118/12 manifest, opaque identity map, null unknowns, freshness boundary, four-language evidence/copy, original fact dates and unchanged 168-URL indexing policy.');
