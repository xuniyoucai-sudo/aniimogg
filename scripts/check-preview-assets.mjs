import fs from 'node:fs';
import assert from 'node:assert/strict';
import {sha256} from './asset-fingerprints.mjs';
const base=process.env.TEST_PRODUCTION_URL||process.env.TEST_PREVIEW_URL;
assert.match(base||'',/^https:\/\/(?:[a-z0-9-]+\.aniimogg\.pages\.dev|aniimogg\.com)$/,'Only a verified non-production Preview origin is allowed');
const output=process.env.BROWSER_ARTIFACTS||'artifacts/aniimogg-p0-1/cloudflare-preview';fs.mkdirSync(output,{recursive:true});
const manifest=JSON.parse(fs.readFileSync('assets/asset-manifest.json','utf8'));
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
const results=[],errors=[],failures=[],requests=[],bytes=[],pending=[];
try{
 const context=await browser.newContext();const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>{if(r.url().startsWith(base))failures.push(r.url());});
 page.on('response',r=>{const a=Object.values(manifest.assets).find(a=>r.url()===base+a.file);if(a)pending.push(r.body().then(body=>{bytes.push({url:r.url(),status:r.status(),sha256:sha256(body),expected:a.sha256,mime:r.headers()['content-type']});}));});
 const remote=await context.request.get(base+'/assets/asset-manifest.json');assert.equal(remote.status(),200);assert.deepEqual(await remote.json(),manifest);
 for(const prefix of ['','zh-cn/','zh-tw/','ja/'])for(const route of ['','guides/confirmed-aniimo/','team-builder/','map/']){
  const path='/'+prefix+route;const r=await page.goto(base+path,{waitUntil:'domcontentloaded'});assert.equal(r.status(),200);
  const refs=await page.locator('script[src],link[rel=stylesheet]').evaluateAll(xs=>xs.map(x=>x.getAttribute('src')||x.getAttribute('href')).filter(x=>!x.startsWith('https:')));
  assert.deepEqual(refs.sort(),(route==='map/'?['app','styles','siteContent','accessibility','region','regionStyle']:route==='team-builder/'?['styles','siteContent','accessibility','team','teamStyle']:route?['app','styles','siteContent','accessibility','compendium','compendiumStyle']:['app','styles','siteContent','accessibility']).map(key=>manifest.assets[key].file).sort());
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://aniimogg.com'+path);
  if(route==='map/')await page.locator('[data-region-explorer][data-ready=true]').waitFor();
  if(route==='team-builder/')await page.locator('.team-status').filter({hasText:/Saved|保存|儲存/}).waitFor();
  if(route==='guides/confirmed-aniimo/'){await page.locator('.index-search').fill('Emberpup');assert.equal(await page.locator('.aniimo-card:visible').count(),1);}
  results.push({path,status:200,refs,canonical:'production URL'});
 }
 await Promise.all(pending);assert.ok(bytes.length>=4);
 for(const a of Object.values(manifest.assets))assert.ok(bytes.some(b=>b.url===base+a.file));
 for(const b of bytes){assert.equal(b.status,200);assert.equal(b.sha256,b.expected);assert.match(b.mime,/^(?:text\/css|(?:text|application)\/javascript|application\/json)(?:;|$)/);}
 if(!process.env.TEST_PRODUCTION_URL)assert.ok(!requests.some(u=>/^https:\/\/(?:www\.)?aniimogg\.com\//.test(u)),'No first-party production resources');
 assert.ok(!requests.some(u=>/\/app\.js\?v=|\.css\?v=/.test(u)));
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 await page.goto(base+'/zh-cn/guides/confirmed-aniimo/',{waitUntil:'domcontentloaded'});await page.locator('.index-search').fill('Emberpup');await page.screenshot({path:output+'/preview-proof.png'});
 await context.close();
}finally{fs.writeFileSync(output+'/asset-network.json',JSON.stringify({base,cache:'enabled, no routing interception',results,bytes,errors,failures,requests},null,2));await browser.close();}
console.log('PASS verified deployment: 16 four-language pages, exact browser response SHA-256/MIME and manifest, no old query or production resource requests, canonical retained.');
