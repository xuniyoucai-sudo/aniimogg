import fs from 'node:fs';
import assert from 'node:assert/strict';
import {contentDate,contentSlugs} from './week1-content.mjs';
const site=JSON.parse(fs.readFileSync('src/data/site.json'));
const sitemap=fs.readFileSync('sitemap.xml','utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length,168);
const names=JSON.parse(fs.readFileSync('src/data/aniimo-localizations.json'));
for(const [prefix,lang]of [['','en'],['zh-cn/','zh-CN'],['zh-tw/','zh-TW'],['ja/','ja']]){
 for(const slug of contentSlugs){
  const url=`https://aniimogg.com/${prefix}guides/${slug}/`,html=fs.readFileSync(`${prefix}guides/${slug}/index.html`,'utf8');
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  const head=html.split('</head>')[0];assert.equal([...head.matchAll(/hreflang=/g)].length,5);assert.ok(!head.includes('noindex'));
  const h1=html.match(/<h1>(.*?)<\/h1>/s)[1];assert.ok(head.includes(h1),'final title/H1 must agree: '+url);
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
  const article=schemas.find(s=>s['@type']==='Article'&&s.headline);assert.equal(article.dateModified,contentDate);assert.equal(article.headline,h1.replaceAll('&amp;','&'));
  const faq=schemas.find(s=>s['@type']==='FAQPage');if(faq)for(const q of faq.mainEntity){const escaped=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));assert.ok(html.includes(escaped(q.name)));assert.ok(html.includes(escaped(q.acceptedAnswer.text)));}
  assert.ok(sitemap.includes(`<loc>${url}</loc><lastmod>${contentDate}</lastmod>`));
  if(slug==='inherit-training'){assert.ok(html.includes('UNKNOWN'));assert.ok(!/20[,.]?000/.test(html));assert.ok(html.indexOf('<h2>')<html.indexOf('class="support-matrix"'));for(const route of ['guides/resonance-ascension/','guides/confirmed-aniimo/','team-builder/'])assert.ok(html.includes(`href="/${prefix}${route}"`));}
  if(slug==='crossplay-cross-save'){for(const x of ['UNKNOWN','PSN','Xbox','Steam','Epic','iOS','Android','100089','100137'])assert.ok(html.includes(x));for(const x of ['multiplayer','steam-deck'])assert.ok(html.includes(`href="/${prefix}guides/${x}/"`));assert.ok(html.includes('<th>')&&html.includes('PC ↔ PS5'));}
  if(slug==='multiplayer'){for(const s of ['Aniimo Dash','Speed Showdown','Aniimo Affinity','Friend Affinity','100145','100298','PvP','Steam'])assert.ok(html.includes(s),url+' '+s);}
  if(slug==='steam-deck'){assert.ok(html.includes('UNKNOWN'));assert.ok(html.includes('Playable'));assert.ok(html.includes('2026-10-04'));assert.ok(html.includes('https://www.steamdeck.com/en/verified'));assert.ok(!html.includes('Steam now rates Aniimo Playable'));}
  if(slug==='confirmed-aniimo'){
   const cfg=JSON.parse(html.match(/class="compendium-data">(.*?)<\/script>/s)[1]);assert.equal(cfg.rows.length,130);assert.equal(new Set(cfg.rows.map(r=>r[0])).size,130);
   for(const r of cfg.rows){assert.equal(r[5][lang],names.records[r[2]].localizedNames[lang]);assert.ok(html.includes(`data-entity-id="${r[0]}"`));}
  }
 }
 for(const tool of ['team-builder','map','events'])assert.ok(fs.readFileSync(`${prefix}${tool}/index.html`,'utf8').includes('name="robots" content="noindex,follow"'));
}
const tw=fs.readFileSync('zh-tw/guides/elements-roles/index.html','utf8');
for(const s of ['光','火','冰','暗','電','草','水','土','風','輸出','治療','輔助','擊破','回能'])assert.ok(tw.includes(`<td>${s}</td>`));
assert.ok(tw.includes('https://wiki.aniimo.com/tw'));assert.ok(!tw.includes('岩石'));assert.ok(!tw.includes('雷電'));assert.ok(!tw.includes('中文是本站譯名'));
for(const slug of contentSlugs){assert.equal(site.guideMeta[slug].modifiedAt,contentDate);assert.equal(site.guideMeta[slug].updated,contentDate);}
console.log('PASS Week 1.2: 24 final title/H1/FAQ/schema/lastmod, evidence UNKNOWN, same-locale links, 130 stable localized identities, TW official terms and unchanged tool indexing.');
