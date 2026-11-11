import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {sha256} from './asset-fingerprints.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir='artifacts/aniimogg-p0-1/local-preview';fs.mkdirSync(dir,{recursive:true});
const provenance=JSON.parse(fs.readFileSync('src/fixtures/asset-cache/provenance.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('assets/asset-manifest.json','utf8'));
const fixtures=new Map(provenance.fixtures.map(f=>{
  const bytes=gunzipSync(fs.readFileSync('src/fixtures/asset-cache/'+f.file));assert.equal(sha256(bytes),f.sha256);
  return ['/__legacy/'+f.file.replace('.gz',''),{...f,bytes}];
}));
// Normal browser cache remains enabled. Route interception would disable it,
// so use a normal static origin with the historical pages alongside new pages.
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');const fixture=fixtures.get(url.pathname);
  const file=path.resolve('.','.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403).end();return;}
  try{const bytes=fixture?.bytes||fs.readFileSync(file);const ext=fixture?'.html':path.extname(file);
    res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'})[ext]||'application/octet-stream','Cache-Control':'public, max-age=3600'}).end(bytes);
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
const results=[],oldKnownFailures=[],errors=[],failures=[];
try{
 const context=await browser.newContext({viewport:{width:390,height:844}});const old=await context.newPage();
 for(const [url,f] of fixtures){
  const observed=[];const handler=e=>observed.push(e.message);old.on('pageerror',handler);
  await old.goto(base+url,{waitUntil:'domcontentloaded'});
  if(f.hashed){for(const [url,hash] of Object.entries(provenance.retainedHashedAssets)){const r=await context.request.get(base+url);assert.equal(sha256(await r.body()),hash);}await old.locator('.index-search').fill('Emberpup');assert.equal(await old.locator('.aniimo-card:visible').count(),1);}
  else assert.equal(await old.locator('script[src^="/app.js"]').getAttribute('src'),'/app.js?v=20260917-3');
  const response=await context.request.get(base+'/app.js?v=20260917-3');assert.equal(sha256(await response.body()),provenance.legacyAssets['app.js']);
  if(f.mixedContract){const error=old.waitForEvent('pageerror',{predicate:e=>e.message===f.knownError});await old.locator('.index-search').fill('Emberpup');await error;assert.equal(await old.locator('.aniimo-card:visible').count(),130);}
  old.off('pageerror',handler);
  if(f.knownError){assert.ok(observed.includes(f.knownError),f.sourcePath+' known historical error changed');oldKnownFailures.push({path:f.sourcePath,errors:observed});}
  else assert.deepEqual(observed,[],f.sourcePath);
  if(f.sourcePath==='index.html'){await old.locator('.menu-btn').click();assert.equal(await old.locator('.menu-btn').getAttribute('aria-expanded'),'true');}
  results.push({historicalPage:f.sourcePath,legacyAssetMatches:true,knownFailure:Boolean(f.knownError)});
 }
 const page=await context.newPage();const requested=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().startsWith(base))requested.push(r.url());});
 page.on('requestfailed',r=>{if(r.url().startsWith(base))failures.push(r.url());});
 for(const prefix of ['','zh-cn/','zh-tw/','ja/']){
  await page.goto(base+'/'+prefix+'guides/confirmed-aniimo/',{waitUntil:'domcontentloaded'});
  const refs=await page.locator('script[src],link[rel=stylesheet]').evaluateAll(xs=>xs.map(x=>x.getAttribute('src')||x.getAttribute('href')).filter(x=>x.startsWith('/')));
  assert.deepEqual(refs.sort(),Object.values(manifest.assets).map(x=>x.file).sort());
  const hashes={};for(const a of Object.values(manifest.assets)){const r=await context.request.get(base+a.file);assert.equal(r.status(),200);assert.equal(r.headers()['content-type'],a.mime);hashes[a.file]=sha256(await r.body());assert.equal(hashes[a.file],a.sha256);}
  await page.locator('.index-search').fill('Emberpup');assert.equal(await page.locator('.aniimo-card:visible').count(),1);
  await page.locator('[data-aniimo-save="001"]').click();await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('[data-aniimo-save="001"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-aniimo-save="001"]').click();
  results.push({newPage:prefix||'en',refs,hashes,searchCount:1,reloadAndSave:'PASS'});
 }
 assert.ok(!requested.some(x=>/\/app\.js\?|\.css\?v=/.test(x)));assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 await context.close();
}finally{fs.writeFileSync(dir+'/asset-cache-browser.json',JSON.stringify({base,cache:'normal, not disabled; no routing interception',results,oldKnownFailures,errors,failures},null,2));await browser.close();await new Promise(resolve=>server.close(resolve));}
console.log('PASS historical fixtures + retained legacy bytes + four-language hashed pages coexist in one cache-enabled browser context; 3 known legacy failures plus the P0 mixed-resource regression recorded separately.');
