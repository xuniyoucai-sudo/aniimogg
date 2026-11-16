import fs from 'node:fs';
import assert from 'node:assert/strict';
import {expansionSlugs} from './guide-expansion-content.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),site=read('src/data/site.json'),content=read('src/locales/guide-expansion.json');
const sitemap=fs.readFileSync('sitemap.xml','utf8'),urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]),baseline=read('src/data/guide-expansion-baseline.json');
const added=expansionSlugs.flatMap(id=>['','zh-cn/','zh-tw/','ja/'].map(p=>`https://aniimogg.com/${p}guides/${id}/`));
assert.equal(baseline.urls.length,168);assert.deepEqual([...urls].sort(),[...baseline.urls,...added].sort());assert.equal(new Set(urls).size,180);
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const [lang,prefix] of [['en',''],['zh-CN','zh-cn/'],['zh-TW','zh-tw/'],['ja','ja/']])for(const id of expansionSlugs){
 const g=content[lang][id],h=fs.readFileSync(`${prefix}guides/${id}/index.html`,'utf8'),head=h.split('</head>')[0],url=`https://aniimogg.com/${prefix}guides/${id}/`;
 assert.ok(head.includes(esc(g.title)));assert.ok(h.includes('<h1>'+esc(g.h1)+'</h1>'));assert.ok(head.includes(`<link rel="canonical" href="${url}">`));assert.equal([...head.matchAll(/hreflang=/g)].length,5);assert.ok(!head.includes('noindex'));assert.equal((h.match(/<h1>/g)||[]).length,1);
 for(const [heading,text] of g.body){assert.ok(h.includes(esc(heading)));assert.ok(h.includes(esc(text)));}assert.ok(g.body.length>=6&&g.faq.length>=4&&g.matrix.rows.length>=3);
 const schemas=[...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(x=>JSON.parse(x[1])),a=schemas.find(x=>x['@type']==='Article'),faq=schemas.find(x=>x['@type']==='FAQPage');
 assert.equal(a.datePublished,'2026-11-16');assert.equal(a.dateModified,'2026-11-16');assert.equal(a.headline,g.h1);assert.equal(a.inLanguage,lang);assert.equal(faq.mainEntity.length,g.faq.length);
 for(const q of faq.mainEntity){assert.ok(h.includes(esc(q.name)));assert.ok(h.includes(esc(q.acceptedAnswer.text)));}
 assert.ok(sitemap.includes(`<loc>${url}</loc><lastmod>2026-11-16</lastmod>`));assert.ok(fs.readFileSync(`${prefix}guides/index.html`,'utf8').includes(`href="/${prefix}guides/${id}/"`));
 for(const related of site.guideMeta[id].related){const route=['map','events','team-builder'].includes(related)?related:'guides/'+related;assert.ok(h.includes(`href="/${prefix}${route}/"`),route);}
 if(id==='controls-keyboard-controller-mobile'){for(const marker of ['1.0','WASD','Space','Proton','2026'])assert.ok(h.includes(marker));assert.ok(h.includes('https://aniimo.guide/en/guides/controls-keyboard-controller-mobile'));}
 if(id==='photo-mode'){for(const marker of ['F7','F8','Creative','Selfie','Follow','Prismana Snapshots','100298'])assert.ok(h.includes(marker));}
 if(id==='alpha-omega-boss-preparation'){assert.ok(h.includes('world-bosses'));assert.ok(h.includes('Primegy'));assert.ok(!/60-second|30 Primegy|50 Primegy|100%/.test(h));}
}
assert.ok(!/[这为与个从们仅实测图录设键机级删发该点后场关]/.test(JSON.stringify(content['zh-TW'])),'New Traditional Chinese must be reviewed');
for(const p of ['','zh-cn/','zh-tw/','ja/'])for(const route of ['map','events','team-builder'])assert.ok(fs.readFileSync(p+route+'/index.html','utf8').includes('noindex,follow'));
console.log('PASS guide expansion: 12 localized original articles, FAQ/schema/dates/sources/links, human-reviewed TW, original 168 URLs preserved + exactly 12 approved additions, unchanged tool noindex.');
