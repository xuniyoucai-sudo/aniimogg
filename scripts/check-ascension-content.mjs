import fs from 'node:fs';
import assert from 'node:assert/strict';
const site=JSON.parse(fs.readFileSync('src/data/site.json','utf8'));
const m=site.guideMeta['resonance-ascension'],sitemap=fs.readFileSync('sitemap.xml','utf8');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const prefix of ['','zh-cn/','zh-tw/','ja/']){
 const url=`https://aniimogg.com/${prefix}guides/resonance-ascension/`,h=fs.readFileSync(`${prefix}guides/resonance-ascension/index.html`,'utf8'),head=h.split('</head>')[0];
 assert.ok(h.includes(`<link rel="canonical" href="${url}">`));assert.equal([...head.matchAll(/hreflang=/g)].length,5);assert.ok(!head.includes('noindex'));
 for(const marker of ['Evolution Item','Season Tag','Dewdrop Crystal','Stellar Tier 6','Resonance Star Up','https://aniimo.com/newslist/detail/100244','1.0'])assert.ok(h.includes(marker),prefix+marker);
 assert.ok(h.includes(`href="/${prefix}guides/level-titles-elite-training/"`));
 const schemas=[...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(x=>JSON.parse(x[1]));
 const a=schemas.find(x=>x['@type']==='Article'),faq=schemas.find(x=>x['@type']==='FAQPage');assert.equal(a.dateModified,m.modifiedAt);assert.ok(a.dateModified>='2026-11-14');
 assert.ok(sitemap.includes(`<loc>${url}</loc><lastmod>${m.modifiedAt}</lastmod>`));
 assert.ok(faq.mainEntity.length>=9);for(const q of faq.mainEntity){assert.ok(h.includes(esc(q.name)));assert.ok(h.includes(esc(q.acceptedAnswer.text)));}
 const first=h.slice(h.indexOf('<h2>'),h.indexOf('<h2>')+1400);assert.match(first,/60/);assert.match(first,/65/);assert.match(first,/Season Tag/);
 assert.ok(!/20[,.]?000|870|645|225/.test(first),'Do not import an unverified universal cost table');
}
const tw=JSON.parse(fs.readFileSync('src/locales/ascension-tw.json','utf8')),h=fs.readFileSync('zh-tw/guides/resonance-ascension/index.html','utf8');
for(const section of tw.body)for(const v of section)assert.ok(h.includes(esc(v)));
assert.ok(!/[赛适识对当给两据导绕槛]/.test(JSON.stringify(tw)),'New TW text must be human-reviewed');
assert.equal([...sitemap.matchAll(/<loc>/g)].length,168);
console.log('PASS Ascension: four-language official Part 2 boundaries, human-reviewed TW, historical community scope, FAQ/schema/dates and 168 sitemap URLs.');
